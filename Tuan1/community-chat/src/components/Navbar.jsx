import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../stores/auth.store";
import { useTheme } from "../stores/theme.store";
import { Sun, Moon, Zap } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout, isGuestMode } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const username = currentUser?.username || localStorage.getItem("username") || "User";

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-blue-200 dark:border-gray-700 p-4 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center max-w-4xl mx-auto relative">
        {/* Logo */}
        <Link 
          to="/chat" 
          className="font-bold text-lg text-blue-800 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          TaZi Community Chat
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Ẩn Join nếu đã đăng nhập */}
          {!(isAuthenticated || isGuestMode) && (
            <Link to="/" className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100">
              Join
            </Link>
          )}
          <Link to="/chat" className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100">
            Chat
          </Link>
          <Link to="/about" className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100">
            About
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-yellow-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}

          </button>

          {/* Avatar Dropdown */}
          {(isAuthenticated || isGuestMode) && (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={
                  "flex items-center justify-center w-9 h-9 rounded-full font-semibold focus:outline-none overflow-hidden " +
                  (currentUser?.avatar
                    ? ""
                    : "bg-blue-500 hover:bg-blue-600 text-white")
                }
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <span>{username.charAt(0).toUpperCase()}</span>
                )}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                    {username}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Buttons (dark mode + avatar bên cạnh menu 3 gạch) */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-yellow-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </button>

          {(isAuthenticated || isGuestMode) && (
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={
                "flex items-center justify-center w-9 h-9 rounded-full font-semibold focus:outline-none overflow-hidden " +
                (currentUser?.avatar
                  ? ""
                  : "bg-blue-500 hover:bg-blue-600 text-white")
              }
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <span>{username.charAt(0).toUpperCase()}</span>
              )}
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Avatar Dropdown Mobile */}
      {isProfileMenuOpen && (isAuthenticated || isGuestMode) && (
        <div className="md:hidden absolute right-4 top-16 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
            {username}
          </div>
          <Link
            to="/profile"
            onClick={() => setIsProfileMenuOpen(false)}
            className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            View Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-blue-200 dark:border-gray-700 mt-2 py-2">
          <div className="flex flex-col space-y-2 px-4">
            {!(isAuthenticated || isGuestMode) && (
              <Link 
                to="/" 
                className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join
              </Link>
            )}
            <Link 
              to="/chat" 
              className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chat
            </Link>
            <Link 
              to="/about" 
              className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}