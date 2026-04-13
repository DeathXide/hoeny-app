export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  color: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  distributorId: string;
  distributorName: string;
  salesExecutiveId: string;
  salesExecutiveName: string;
  items: OrderItem[];
  totalItems: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  deliveredDate?: string;
  cancelledDate?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}
