export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  maxQuantity: number;
  imageUrl: string;
}
