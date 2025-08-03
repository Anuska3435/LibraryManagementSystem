import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiBook,
  FiCalendar,
  FiCheckCircle,
  FiFileText,
  FiImage,
  FiLoader,
  FiPlus,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddBookForm = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    imageUrl: "",
    description: "",
    publishedYear: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [existingBooks, setExistingBooks] = useState([]);

  // Predefined categories (you can also fetch these from server)
  const defaultCategories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Technology",
    "Business",
    "Philosophy",
    "Poetry",
    "Drama",
    "Horror",
  ];

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/books");
      const data = response.data;

      setExistingBooks(data);

      // Extract unique categories from existing books
      const uniqueCategories = [...new Set(data.map((book) => book.category))];
      setCategories([...new Set([...defaultCategories, ...uniqueCategories])]);
    } catch (error) {
      console.error("Failed to fetch existing data", error);
      setCategories(defaultCategories);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });

    // Clear error when user starts typing
    if (error) setError("");
    if (success) setSuccess(false);
  };

  const validateForm = () => {
    if (!book.title.trim()) return "Title is required";
    if (!book.author.trim()) return "Author is required";
    if (!book.category.trim()) return "Category is required";
    if (!book.publishedYear) return "Published year is required";
    if (
      book.publishedYear < 1000 ||
      book.publishedYear > new Date().getFullYear()
    ) {
      return "Please enter a valid published year";
    }
    if (!book.description.trim()) return "Description is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookData = {
        ...book,
        id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString(),
        publishedYear: parseInt(book.publishedYear),
      };

      await axios.post("http://localhost:5000/books", bookData);

      await axios.post("http://localhost:5000/activities", {
        id: Date.now().toString(),
        user: "Admin", // वा login user name
        book: bookData.title,
        time: new Date().toLocaleString(), // readable time
        icon: "FiBook", // frontend मा resolve गर्नुहोस्
      });

      setSuccess(true);
      navigate("/admin-dashboard/all-books");

      setBook({
        title: "",
        author: "",
        category: "",
        imageUrl: "",
        description: "",
        publishedYear: "",
      });

      // Refresh existing books
      fetchExistingData();

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError("Failed to add book. Please try again.");
      console.error("Failed to add book", error);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <FiBook className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Book
          </h1>
          <p className="text-gray-600">
            Expand your library with amazing books
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">
                  {existingBooks.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiTag className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiUser className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Authors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    [...new Set(existingBooks.map((book) => book.author))]
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">
              Book Information
            </h2>
          </div>

          <div className="p-8 space-y-6">
            {/* Success/Error Messages */}
            {success && (
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">
                  Book added successfully!
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiBook className="w-4 h-4 mr-2 text-blue-600" />
                  Book Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter book title"
                  disabled={loading}
                />
              </div>

              {/* Author */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="w-4 h-4 mr-2 text-green-600" />
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={book.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter author name"
                  disabled={loading}
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiTag className="w-4 h-4 mr-2 text-purple-600" />
                  Category *
                </label>
                <select
                  name="category"
                  value={book.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Published Year */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="w-4 h-4 mr-2 text-orange-600" />
                  Published Year *
                </label>
                <input
                  type="number"
                  name="publishedYear"
                  value={book.publishedYear}
                  onChange={handleChange}
                  min="1000"
                  max={currentYear}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={`e.g., ${currentYear}`}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FiImage className="w-4 h-4 mr-2 text-pink-600" />
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={book.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/book-cover.jpg"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="w-4 h-4 mr-2 text-indigo-600" />
                Description *
              </label>
              <textarea
                name="description"
                value={book.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                placeholder="Enter book description..."
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                    Adding Book...
                  </>
                ) : (
                  <>
                    <FiPlus className="w-5 h-5 mr-2" />
                    Add Book
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Books Preview */}
        {existingBooks.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Books
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingBooks.slice(-6).map((book, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0 w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                    <FiBook className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {book.title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {book.author}
                    </p>
                    <p className="text-xs text-gray-500">{book.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBookForm;
