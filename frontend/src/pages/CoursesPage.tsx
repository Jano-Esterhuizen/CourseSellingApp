import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesService, basketService } from '../api/services';
import { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';
import toast, { Toast } from 'react-hot-toast';
import { HeroSection } from '../components/ui/hero-section';
import { StarBorder } from '../components/ui/star-border';
import { Clock, BookOpen, ChevronRight, Search, LayoutGrid, List } from 'lucide-react';

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      await basketService.addItem(courseId);
      toast.success('Course added to basket!');
      toast((t: Toast) => (
        <div className="flex items-center space-x-3">
          <span>Course added to basket!</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate('/basket');
            }}
            className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-900"
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

  const filteredCourses = courses
    .filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
        default:
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        <HeroSection
          title="Welcome to Our Learning Platform"
          subtitle={{
            regular: "Transform your future with ",
            gradient: "expert-led courses",
          }}
          description="Discover a world of knowledge with our comprehensive collection of courses designed to help you achieve your learning goals."
          ctaText="Browse Courses"
          ctaHref="#courses"
          gridOptions={{
            angle: 65,
            opacity: 0.4,
            cellSize: 50,
            lightLineColor: "rgba(255,255,255,0.1)",
            darkLineColor: "rgba(255,255,255,0.1)",
          }}
        />
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white/5 rounded-lg overflow-hidden">
                  <div className="h-48 bg-white/10" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                    <div className="h-10 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <HeroSection
        title="Welcome to Our Learning Platform"
        subtitle={{
          regular: "Transform your future with ",
          gradient: "expert-led courses",
        }}
        description="Discover a world of knowledge with our comprehensive collection of courses designed to help you achieve your learning goals."
        ctaText="Browse Courses"
        ctaHref="#courses"
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
          lightLineColor: "rgba(255,255,255,0.1)",
          darkLineColor: "rgba(255,255,255,0.1)",
        }}
      />

      <div id="courses" className="container mx-auto px-4 py-16">
        <div className="mb-12 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">
              Available Courses
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our collection of expert-crafted courses designed to help you master new skills
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 
                focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 
                group-focus-within:text-purple-400 transition-colors duration-300" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 
            bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white 
                focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-[#0A0A0B]">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-xl mb-8 
            flex items-center space-x-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <p>{error}</p>
          </div>
        )}

        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "space-y-6"
        }>
          {filteredCourses.map((course) => (
            <div
              key={course.courseId}
              className={`group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden 
                hover:border-purple-500/30 hover:bg-white/8 transition-all duration-500 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-72' : 'h-56'}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <img
                  src={`http://localhost:5025${course.thumbnailUrl}`}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <div className="flex items-center space-x-4 text-sm text-white/90">
                    <div className="flex items-center bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <span>2h 30m</span>
                    </div>
                    <div className="flex items-center bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm">
                      <BookOpen className="w-4 h-4 mr-1.5" />
                      <span>12 lessons</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Instructor</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 text-sm font-medium">
                          {course.instructor[0]}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium">{course.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Price</p>
                    <span className="text-2xl font-bold text-purple-400">
                      ${course.price}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <button 
                    className="text-purple-400 hover:text-purple-300 transition-colors flex items-center text-sm
                    hover:translate-x-1 transform transition-transform duration-300"
                    onClick={() => {/* TODO: Implement quick view */}}
                  >
                    Quick View
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                  <StarBorder
                    onClick={() => handleAddToBasket(course.id)}
                    className="w-[120px]"
                    speed="6s"
                  >
                    Add to Basket
                  </StarBorder>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <div className="max-w-md mx-auto space-y-4">
              <Search className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-xl font-medium text-white">
                {searchQuery
                  ? 'No courses found matching your search'
                  : 'No courses available at the moment'}
              </p>
              <p className="text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search terms or browse all courses'
                  : 'Check back later for new course offerings'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 