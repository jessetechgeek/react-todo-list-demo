import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../lib/api-client';
import { LogOut, CheckSquare, User, Moon, Sun } from 'lucide-react';

const Header = () => {
  const isLoggedIn = authApi.isLoggedIn();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const handleLogout = () => {
    authApi.logout();
    window.location.href = '/login';
  };

  useEffect(() => {
    const checkScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would normally toggle a class on document.body or use a theme context
    // For now, let's just console log as an example
    console.log('Toggling dark mode:', !isDarkMode);
  };

  return (
    <header 
      className={`sticky top-0 z-30 w-full bg-white transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-md">
            <CheckSquare size={20} />
          </div>
          <span className="text-xl font-bold text-gray-800">TodoMaster</span>
        </Link>
        
        <nav className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center text-gray-600 hover:text-gray-800">
                <User size={20} className="mr-1.5" />
                <span className="font-medium">User</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === '/login' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === '/signup' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;