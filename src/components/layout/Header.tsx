import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use a handler to ensure logout completes before redirecting
  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/ideas', label: 'Explore Ideas' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/services', label: 'Services' },
  ];

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'top-4' : 'top-6'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container-custom mx-auto px-4">
        <motion.div 
          className={`mx-auto max-w-6xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl transition-all duration-500 ${
            scrolled ? 'py-3' : 'py-4'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
          whileHover={{ 
            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <div className="flex justify-between items-center px-6">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <motion.img 
                  src="/images/logo2.png" 
                  alt="Fund Your Idea Logo" 
                  className="h-8 w-auto"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Fund Your Idea
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link 
                    to={item.path} 
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                      isActive(item.path) 
                        ? 'text-blue-400' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Active indicator */}
                    {isActive(item.path) && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        layoutId="activeTab"
                        initial={{ x: '-50%' }}
                        style={{ x: '-50%' }}
                      />
                    )}
                    
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-lg blur-xl"
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
              
              {isAuthenticated ? (
                <motion.div 
                  className="flex items-center space-x-4 ml-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link 
                    to="/dashboard" 
                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                      isActive('/dashboard') 
                        ? 'text-blue-400' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <div className="relative group">
                    <motion.button 
                      className="flex items-center space-x-2 focus:outline-none"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {user?.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={user.name} 
                          className="h-8 w-8 rounded-full object-cover border border-white/20" 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-300">{user?.name.split(' ')[0]}</span>
                    </motion.button>
                    
                    {/* Dropdown */}
                    <motion.div 
                      className="absolute right-0 w-48 mt-2 py-2 backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(30,30,30,0.8) 100%)',
                      }}
                    >
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center space-x-4 ml-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/signup" 
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      Sign up
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </nav>

            {/* Mobile menu button */}
            <motion.button 
              className="md:hidden rounded-lg p-2 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 mx-4"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(30,30,30,0.8) 100%)',
              }}
            >
              <div className="px-6 py-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      to={item.path} 
                      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.path) 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link 
                      to="/dashboard" 
                      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive('/dashboard') 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive('/profile') 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="flex w-full items-center px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="pt-4 flex flex-col space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link 
                      to="/login" 
                      className="block w-full px-4 py-2 text-center font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                      onClick={closeMenu}
                    >
                      Log in
                    </Link>
                    <Link 
                      to="/signup" 
                      className="block w-full px-4 py-2 text-center font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                      onClick={closeMenu}
                    >
                      Sign up
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;