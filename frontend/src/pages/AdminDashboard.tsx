import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminCoursesService, coursesService } from '../api/services';
import { Course } from '../types/course';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  instructor: z.string().min(1, 'Instructor name is required'),
  imageUrl: z.string().min(1, 'Image is required'),
});

type CourseForm = z.infer<typeof courseSchema>;

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');

  console.log('AdminDashboard - isAdmin:', isAdmin);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    if (!isAdmin) {
      console.log('Not admin, redirecting to home');
      navigate('/');
      return;
    }
    fetchCourses();
  }, [isAdmin, navigate]);

  const fetchCourses = async () => {
    try {
      const data = await coursesService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setValue('title', course.title);
    setValue('description', course.description);
    setValue('price', course.price);
    setValue('instructor', course.instructor);
    setValue('imageUrl', course.imageUrl);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await adminCoursesService.deleteCourse(id);
        await fetchCourses();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  const onSubmit = async (data: CourseForm) => {
    try {
      if (editingCourse) {
        await adminCoursesService.updateCourse(editingCourse.id, {
          ...editingCourse,
          ...data,
        });
      } else {
        await adminCoursesService.createCourse(data);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      reset();
      await fetchCourses();
    } catch (err) {
      setError('Failed to save course');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await adminCoursesService.uploadThumbnail(file);
      const imageUrl = `/images/${result.fileName}`;
      setValue('imageUrl', imageUrl);
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button
          onClick={() => {
            setEditingCourse(null);
            reset();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Course
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
              <p className="text-blue-600 font-semibold">${course.price}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(course)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  {...register('title')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instructor
                </label>
                <input
                  {...register('instructor')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.instructor && (
                  <p className="text-red-600 text-sm">
                    {errors.instructor.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  className="mt-1 block w-full"
                  accept="image/*"
                />
                <input
                  {...register('imageUrl')}
                  type="hidden"
                />
                {errors.imageUrl && (
                  <p className="text-red-600 text-sm">{errors.imageUrl.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCourse(null);
                    reset();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  {editingCourse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 