import api from './axios';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  imageUrl: string;
}

export const courseService = {
  getAllCourses: async () => {
    const response = await api.get<Course[]>('/api/courses');
    return response.data;
  },

  getCourseById: async (id: string) => {
    const response = await api.get<Course>(`/api/courses/${id}`);
    return response.data;
  },

  createCourse: async (course: Omit<Course, 'id'>) => {
    const response = await api.post<Course>('/api/courses', course);
    return response.data;
  },

  updateCourse: async (id: string, course: Partial<Course>) => {
    const response = await api.put<Course>(`/api/courses/${id}`, course);
    return response.data;
  },

  deleteCourse: async (id: string) => {
    await api.delete(`/api/courses/${id}`);
  },
}; 