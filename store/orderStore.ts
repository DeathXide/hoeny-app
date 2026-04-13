import { create } from 'zustand';
import { Order, OrderStatus, PaymentStatus, CartItem, OrderItem } from '@/types';
import { mockOrders } from '@/data';
import { generateId } from '@/utils/generateId';
import { delay } from '@/utils/delay';
import { useCartStore } from '@/store/cartStore';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  getOrdersByExecutive: (executiveId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  createOrder: (
    distributorId: string,
    distributorName: string,
    items: CartItem[],
    executiveId: string,
    executiveName: string,
    notes?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

/** Generates an order number like "HNY-2426-XXXX". */
const generateOrderNumber = (): string => {
  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyEnd = fyStart + 1;
  const fyCode = `${fyStart.toString().slice(2)}${fyEnd.toString().slice(2)}`;
  const suffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `HNY-${fyCode}-${suffix}`;
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    await delay(500);
    set({ orders: mockOrders, isLoading: false });
  },

  getOrdersByExecutive: (executiveId: string) => {
    return get().orders.filter((o) => o.salesExecutiveId === executiveId);
  },

  getOrderById: (orderId: string) => {
    return get().orders.find((o) => o.id === orderId);
  },

  createOrder: (
    distributorId: string,
    distributorName: string,
    items: CartItem[],
    executiveId: string,
    executiveName: string,
    notes?: string
  ): Order => {
    const now = new Date().toISOString();

    // Convert CartItems to OrderItems
    const orderItems: OrderItem[] = items.map((item) => ({
      id: generateId(),
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      color: item.color,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const gstRate = 12;
    const gstAmount = Math.round((subtotal * gstRate) / 100 * 100) / 100;
    const totalAmount = Math.round((subtotal + gstAmount) * 100) / 100;

    // Expected delivery: 10 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 10);

    const order: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      distributorId,
      distributorName,
      salesExecutiveId: executiveId,
      salesExecutiveName: executiveName,
      items: orderItems,
      totalItems,
      subtotal,
      gstRate,
      gstAmount,
      totalAmount,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      notes,
      orderDate: now,
      expectedDeliveryDate: deliveryDate.toISOString(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({ orders: [order, ...state.orders] }));

    // Clear the cart after order creation
    useCartStore.getState().clearCart();

    return order;
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const now = new Date().toISOString();

    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;

        const updates: Partial<Order> = {
          status,
          updatedAt: now,
        };

        if (status === OrderStatus.DELIVERED) {
          updates.deliveredDate = now;
        }

        if (status === OrderStatus.CANCELLED) {
          updates.cancelledDate = now;
        }

        return { ...order, ...updates };
      }),
    }));
  },
}));
