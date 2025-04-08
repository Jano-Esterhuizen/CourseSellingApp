export interface Course {
  id: string;
  courseId: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  instructor: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
} 