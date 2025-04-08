import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminCoursesService, coursesService } from '../api/services';
import { Course } from '../types/course';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BookOpen } from 'lucide-react';
import { StarBorder } from '../components/ui/star-border';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  instructor: z.string().min(1, 'Instructor name is required'),
  thumbnailUrl: z.string().min(1, 'Image is required'),
});

type CourseForm = z.infer<typeof courseSchema>;

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    setValue('thumbnailUrl', course.thumbnailUrl);
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
        await adminCoursesService.createCourse({
          ...data,
          courseId: '', // This will be set by the backend
          createdAt: new Date().toISOString(),
        });
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
      setValue('thumbnailUrl', imageUrl);
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">
              Course Management
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Manage your course catalog, update content, and track your educational offerings
            </p>
          </div>

          <div className="flex justify-end">
            <StarBorder
              onClick={() => {
                setEditingCourse(null);
                reset();
                setIsModalOpen(true);
              }}
              className="w-[160px]"
              speed="6s"
            >
              Add New Course
            </StarBorder>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-xl mb-8 
            flex items-center space-x-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden 
                hover:border-purple-500/30 hover:bg-white/8 transition-all duration-500"
            >
              <div className="flex items-start space-x-6 p-6">
                <div className="w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={`http://localhost:5025${course.thumbnailUrl}`}
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 
                      transition-colors duration-300 truncate">
                      {course.title}
                    </h3>
                    <span className="text-2xl font-bold text-purple-400">
                      ${course.price}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-gray-400 line-clamp-2 text-sm leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 text-sm font-medium">
                          {course.instructor[0]}
                        </span>
                      </div>
                      <span className="text-gray-300 text-sm">{course.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-purple-400 hover:text-purple-300 transition-colors flex items-center text-sm
                      px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20"
                  >
                    Edit Course
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center text-sm
                      px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-xl font-medium text-white">
                No courses available
              </p>
              <p className="text-gray-400">
                Get started by adding your first course
              </p>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#1A1A1B] rounded-xl border border-white/10 p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-6 text-white">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    {...register('title')}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white 
                      placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 
                      focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Enter course title"
                  />
                  {errors.title && (
                    <p className="mt-2 text-red-400 text-sm">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white 
                      placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 
                      focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Enter course description"
                  />
                  {errors.description && (
                    <p className="mt-2 text-red-400 text-sm">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white 
                      placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 
                      focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Enter course price"
                  />
                  {errors.price && (
                    <p className="mt-2 text-red-400 text-sm">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instructor
                  </label>
                  <input
                    {...register('instructor')}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white 
                      placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 
                      focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Enter instructor name"
                  />
                  {errors.instructor && (
                    <p className="mt-2 text-red-400 text-sm">{errors.instructor.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white 
                        file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm 
                        file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30
                        focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 
                        transition-all duration-300"
                      accept="image/*"
                    />
                    <input {...register('thumbnailUrl')} type="hidden" />
                  </div>
                  {errors.thumbnailUrl && (
                    <p className="mt-2 text-red-400 text-sm">{errors.thumbnailUrl.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCourse(null);
                      reset();
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <StarBorder type="submit" speed="6s">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </StarBorder>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 