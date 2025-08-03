import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const PublicBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Update search query when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, [location.search]);

  // Fetch books from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Unique categories
  const categories = useMemo(() => {
    const unique = new Set(books.map((b) => b.category));
    return ["All", ...unique];
  }, [books]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      const matchSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  // Optional: add search box
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearchQuery(newSearch);
    navigate(`/public-books?search=${encodeURIComponent(newSearch)}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Library Books</h2>

      {/* Search Box */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search books..."
          className="border rounded-lg px-4 py-2 w-1/2"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center mb-8 gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium border ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-blue-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Book Cards */}
      <div className="grid grid-cols-1 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 font-display">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition"
            >
              <Link to={`/book-view-details/${book.id}`}>
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-60 object-cover"
                />
              </Link>
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <p className="text-xs text-gray-500">{book.category}</p>
                <p className="text-sm mt-2">
                  {book.description.slice(0, 80)}...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Published: {book.publishedYear}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No books found.
          </p>
        )}
      </div>
    </div>
  );
};

export default PublicBooks;
