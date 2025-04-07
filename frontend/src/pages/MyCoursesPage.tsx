import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myCoursesService } from '../api/services';
import { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';

export function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyCourses();
  }, [isAuthenticated, navigate]);

  const fetchMyCourses = async () => {
    try {
      const data = await myCoursesService.getMyCourses();
      console.log('Fetched courses:', data); // Debug log
      setCourses(data);
    } catch (err) {
      setError('Failed to load your courses');
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't purchased any courses yet.</p>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 hover:text-blue-800"
          >
            Browse Available Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            // Skip courses without valid IDs
            if (!course.courseId) {
              console.warn('Course missing ID:', course);
              return null;
            }
            return (
              <div
                key={`course-${course.courseId}`}
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
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Price: ${course.price}
                    </span>
                    <button
                      onClick={() => navigate(`/course/${course.courseId}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 