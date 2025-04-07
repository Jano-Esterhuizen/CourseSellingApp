import api from './axios';
import { Course } from '../types/course';
import { Order } from '../types/order';

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string) => {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  }
};

// Courses Service
export const coursesService = {
  getAllCourses: async () => {
    const response = await api.get<Course[]>('/api/courses');
    return response.data;
  },
  getCourseById: async (id: string) => {
    const response = await api.get<Course>(`/api/courses/${id}`);
    return response.data;
  }
};

// Admin Courses Service
export const adminCoursesService = {
  createCourse: async (course: Omit<Course, 'id'>) => {
    const response = await api.post('/api/admin/courseadmin', course);
    return response.data;
  },
  updateCourse: async (id: string, course: Course) => {
    const response = await api.put(`/api/admin/courseadmin/${id}`, course);
    return response.data;
  },
  deleteCourse: async (id: string) => {
    await api.delete(`/api/admin/courseadmin/${id}`);
  },
  uploadThumbnail: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/admin/courseadmin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

// Basket Service
export const basketService = {
  getBasket: async () => {
    const response = await api.get('/api/basket');
    return response.data;
  },
  addItem: async (courseId: string) => {
    if (!courseId) {
      throw new Error('Course ID is required');
    }
    console.log('Original courseId:', courseId);
    const guidCourseId = courseId.replace(/-/g, '');
    console.log('Converted courseId:', guidCourseId);
    try {
      await api.post(`/api/basket/add/${guidCourseId}`);
      console.log('API call successful');
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  },
  removeItem: async (courseId: string) => {
    if (!courseId) {
      throw new Error('Course ID is required');
    }
    const guidCourseId = courseId.replace(/-/g, '');
    console.log("Sending DELETE to /api/basket/remove/" + guidCourseId);
    await api.delete(`/api/basket/remove/${guidCourseId}`);
  },
  
  clearBasket: async () => {
    await api.delete('/api/basket/clear');
  }
};

// Orders Service
export const ordersService = {
  checkout: async () => {
    const response = await api.post('/api/orders/checkout');
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get<Order[]>('/api/orders');
    return response.data;
  }
};

// My Courses Service
export const myCoursesService = {
  getMyCourses: async () => {
    const response = await api.get<Course[]>('/api/mycourses');
    return response.data;
  }
};

// Payments Service
export const paymentsService = {
  createCheckoutSession: async () => {
    const response = await api.post('/api/payments/checkout-session');
    return response.data;
  }
}; 