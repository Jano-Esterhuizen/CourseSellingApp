import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StarBorder } from './ui/star-border';

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
    <div className="min-h-screen bg-[#0A0A0B]">
      <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-white">
                Course Platform
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/courses"
                  className="text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md"
                >
                  Courses
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/my-courses"
                      className="text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md"
                    >
                      My Courses
                    </Link>
                    <Link
                      to="/basket"
                      className="text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md relative"
                    >
                      Basket
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md"
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
                    className="text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md"
                  >
                    Login
                  </Link>
                  <StarBorder as={Link} to="/signup">
                    Sign Up
                  </StarBorder>
                </>
              ) : (
                <StarBorder onClick={handleLogout}>
                  Logout
                </StarBorder>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
} 