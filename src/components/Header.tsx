import { Link } from 'react-router-dom';
import { authApi } from '../lib/api-client';

const Header = () => {
  const isLoggedIn = authApi.isLoggedIn();
  
  const handleLogout = () => {
    authApi.logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Todo List App
        </Link>
        
        <nav>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition"
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