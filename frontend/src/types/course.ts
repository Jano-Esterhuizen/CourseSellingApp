export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  instructor?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
} 