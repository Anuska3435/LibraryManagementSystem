import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaAward,
  FaBook,
  FaBookOpen,
  FaChartBar,
  FaClock,
  FaGraduationCap,
  FaLaptop,
  FaPlus,
  FaSearch,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AddRecentActivities from "../admin/adminBody/recentActivities/AddRecentActivities";

const Home = () => {
  const [recentBooks, setRecentBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/public-books?search=${searchQuery}`);
    }
  };

  const statsCards = [
    {
      title: "Total Books",
      value: "15,247",
      change: "+12%",
      icon: FaBook,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Members",
      value: "3,567",
      change: "+8%",
      icon: FaUsers,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Books Issued",
      value: "1,234",
      change: "+15%",
      icon: FaBookOpen,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Overdue Books",
      value: "89",
      change: "-5%",
      icon: FaClock,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/books?_sort=createdAt&_order=desc&_limit=4"
        );
        setRecentBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const recentActivities = [
    {
      id: 1,
      type: "issue",
      user: "Alice Cooper",
      book: "JavaScript: The Good Parts",
      time: "2 hours ago",
      icon: FaBookOpen,
    },
    {
      id: 2,
      type: "return",
      user: "Bob Johnson",
      book: "Clean Code",
      time: "4 hours ago",
      icon: FaBook,
    },
    {
      id: 3,
      type: "register",
      user: "Carol Smith",
      book: "New member registration",
      time: "6 hours ago",
      icon: FaUsers,
    },
    {
      id: 4,
      type: "overdue",
      user: "David Brown",
      book: "Python Programming",
      time: "1 day ago",
      icon: FaClock,
    },
  ];

  const popularCategories = [
    {
      name: "Technology",
      count: 2847,
      icon: FaLaptop,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Science",
      count: 1923,
      icon: FaGraduationCap,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Literature",
      count: 3421,
      icon: FaBook,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "History",
      count: 1567,
      icon: FaAward,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const quickActions = [
    { name: "Add New Book", icon: FaPlus, color: "bg-blue-600", href: "#" },
    {
      name: "Register Member",
      icon: FaUsers,
      color: "bg-green-600",
      href: "#",
    },
    { name: "Issue Book", icon: FaBookOpen, color: "bg-orange-600", href: "#" },
    {
      name: "Generate Report",
      icon: FaChartBar,
      color: "bg-purple-600",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-display">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Welcome to
                <span className="block text-blue-200">PUSTAKALAYA</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Your comprehensive library management solution. Streamline
                operations, enhance user experience, and manage your collection
                with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/public-books"
                  className="bg-white cursor-pointer text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FaSearch className="h-5 w-5" />
                  <span>Browse Books</span>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Quick Search</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 h-5 w-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      placeholder="Search books, authors,"
                      className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <button className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                    Search Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <IconComponent className={`h-8 w-8 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <a
                  key={index}
                  href={action.href}
                  className={`${action.color} text-white p-6 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 group`}
                >
                  <div className="flex items-center space-x-4">
                    <IconComponent className="h-8 w-8" />
                    <span className="font-semibold text-lg">{action.name}</span>
                    <FaArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Books */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recently Added Books
                </h2>
                <Link
                  to="/public-books"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <FaArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1">
                          <FaStar className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <AddRecentActivities />
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Get notifications about new books, system updates, and library
              events. Never miss what's happening in your library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-white rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
