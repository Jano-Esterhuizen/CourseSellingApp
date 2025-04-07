import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Layout - isAuthenticated:', isAuthenticated);
  console.log('Layout - isAdmin:', isAdmin);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Course Platform
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/courses"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Courses
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/my-courses"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                    >
                      My Courses
                    </Link>
                    <Link
                      to="/basket"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md relative"
                    >
                      Basket
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="py-4">
        <Outlet />
      </main>
    </div>
  );
} 