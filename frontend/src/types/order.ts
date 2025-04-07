export interface OrderItem {
  courseId: string;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
} 