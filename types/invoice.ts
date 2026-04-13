export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export interface InvoiceLineItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  hsnCode: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  sellerName: string;
  sellerGst: string;
  sellerAddress: string;
  buyerName: string;
  buyerGst: string;
  buyerAddress: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
  amountInWords: string;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
