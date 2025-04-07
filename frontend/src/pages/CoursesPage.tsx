import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesService, basketService } from '../api/services';
import { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';
import toast, { Toast } from 'react-hot-toast';

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await coursesService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBasket = async (courseId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      console.log('Adding course to basket:', courseId);
      await basketService.addItem(courseId);
      console.log('Course added successfully');
      toast.success('Course added to basket!');
      // Optional: Show a button to view basket
      toast((t: Toast) => (
        <div className="flex items-center space-x-3">
          <span>Course added to basket!</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate('/basket');
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            View Basket
          </button>
        </div>
      ), {
        duration: 5000,
      });
    } catch (err) {
      console.error('Error adding course to basket:', err);
      setError('Failed to add course to basket');
      toast.error('Failed to add course to basket');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Courses</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={`http://localhost:5025${course.thumbnailUrl}`}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  ${course.price}
                </span>
              </div>
              <button
                onClick={() => {
                  console.log('Course object:', course);
                  console.log('Course ID:', course.id);
                  if (!course.id) {
                    console.error('Course has no ID:', course);
                    toast.error('Invalid course data');
                    return;
                  }
                  handleAddToBasket(course.id);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Add to Basket
              </button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No courses available at the moment.</p>
        </div>
      )}
    </div>
  );
} 