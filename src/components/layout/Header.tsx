import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Lightbulb, DollarSign, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Use a handler to ensure logout completes before redirecting
  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="container-custom mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Lightbulb className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Fund Your Idea</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-base font-medium ${isActive('/') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
              Home
            </Link>
            <Link to="/ideas" className={`text-base font-medium ${isActive('/ideas') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
              Explore Ideas
            </Link>
            <Link to="/how-it-works" className={`text-base font-medium ${isActive('/how-it-works') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}>
              How It Works
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className={`text-base font-medium ${isActive('/dashboard') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">{user?.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-base font-medium text-gray-600 hover:text-gray-900">
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="container-custom py-4 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/ideas" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/ideas') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={closeMenu}
            >
              Explore Ideas
            </Link>
            <Link 
              to="/how-it-works" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/how-it-works') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={closeMenu}
            >
              How It Works
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <Link 
                  to="/login" 
                  className="block w-full px-4 py-2 text-center font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
                  onClick={closeMenu}
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full px-4 py-2 text-center font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  onClick={closeMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;