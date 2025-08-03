import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaBook,
  FaBookOpen,
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newBooksCount, setNewBooksCount] = useState(0);
  const [previousBooksCount, setPreviousBooksCount] = useState(null);

  useEffect(() => {
    const fetchBooksCount = () => {
      axios
        .get("http://localhost:5000/books")
        .then((res) => {
          const currentCount = res.data.length;

          // Only update notification if we have a previous count and current count is greater
          if (
            previousBooksCount !== null &&
            currentCount > previousBooksCount
          ) {
            setNewBooksCount(currentCount - previousBooksCount);
          }

          // Always update the previous count
          setPreviousBooksCount(currentCount);
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
        });
    };

    // Initial fetch
    fetchBooksCount();

    // Set up polling interval
    const interval = setInterval(fetchBooksCount, 10000); // Poll every 10 seconds

    // Cleanup function
    return () => clearInterval(interval);
  }, []); // Empty dependency array - effect runs once on mount

  // Alternative approach: Reset notification count when user clicks the bell
  const handleNotificationClick = () => {
    setNewBooksCount(0); // Reset the notification count
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/public-books?search=${searchQuery}`);
    }
  };

  const navigationItems = [
    { name: "Books", icon: FaBookOpen, href: "/public-books" },
  ];

  const profileMenuItems = [
    { name: "My Profile", icon: FaUser, href: "/profile-info" },
    { name: "Logout", icon: FaSignOutAlt, href: "#" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FaBook className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">LibraryMS</h1>
                  <p className="text-xs text-gray-500">Management System</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search books..."
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <button className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
              <FaSearch className="h-5 w-5" />
            </button>

            {/* Notifications */}
            {currentUser && (
              <div className="relative">
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
                  onClick={handleNotificationClick}
                >
                  <FaBell className="h-5 w-5" />
                  {newBooksCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {newBooksCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Profile or Register */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 rounded-md"
                >
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaUser className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden cursor-pointer sm:block text-sm font-medium text-gray-700">
                    {currentUser?.fullName || currentUser?.email}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {profileMenuItems.map((item) => {
                      const IconComponent = item.icon;
                      const isLogout = item.name === "Logout";

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={isLogout ? handleLogout : undefined}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search..."
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Overlay for profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
