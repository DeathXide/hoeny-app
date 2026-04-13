import { Order, CartItem, OrderItem, OrderStatus, PaymentStatus } from '@/types';
import { mockOrders } from '@/data';
import { delay } from '@/utils/delay';
import { generateId } from '@/utils/generateId';

/**
 * Returns all orders.
 */
export const getOrders = async (): Promise<Order[]> => {
  await delay(500);
  return mockOrders;
};

/**
 * Returns orders filtered by sales executive ID.
 */
export const getOrdersByExecutive = async (executiveId: string): Promise<Order[]> => {
  await delay(500);
  return mockOrders.filter((o) => o.salesExecutiveId === executiveId);
};

interface CreateOrderData {
  distributorId: string;
  distributorName: string;
  items: CartItem[];
  executiveId: string;
  executiveName: string;
  notes?: string;
}

/**
 * Creates a new order from the provided data.
 */
export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  await delay(800);

  const now = new Date().toISOString();

  const orderItems: OrderItem[] = data.items.map((item) => ({
    id: generateId(),
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    color: item.color,
  }));

  const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const gstRate = 12;
  const gstAmount = Math.round((subtotal * gstRate) / 100 * 100) / 100;
  const totalAmount = Math.round((subtotal + gstAmount) * 100) / 100;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 10);

  const fyStart = new Date().getMonth() >= 3 ? new Date().getFullYear() : new Date().getFullYear() - 1;
  const fyEnd = fyStart + 1;
  const fyCode = `${fyStart.toString().slice(2)}${fyEnd.toString().slice(2)}`;
  const suffix = Math.floor(1000 + Math.random() * 9000).toString();

  const order: Order = {
    id: generateId(),
    orderNumber: `HNY-${fyCode}-${suffix}`,
    distributorId: data.distributorId,
    distributorName: data.distributorName,
    salesExecutiveId: data.executiveId,
    salesExecutiveName: data.executiveName,
    items: orderItems,
    totalItems,
    subtotal,
    gstRate,
    gstAmount,
    totalAmount,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.UNPAID,
    notes: data.notes,
    orderDate: now,
    expectedDeliveryDate: deliveryDate.toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  return order;
};
