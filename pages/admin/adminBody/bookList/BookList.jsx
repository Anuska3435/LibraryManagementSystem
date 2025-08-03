import axios from "axios";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Book List</h1>
        <Link to="/admin-dashboard/add-book-form">
          <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add Book
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Author</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">PublishedYear</th>
              <th className="px-4 py-2 text-left">createdAt</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {books.length > 0 ? (
              books.map((book, idx) => (
                <tr
                  key={book.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-1">{idx + 1}</td>
                  <td className="px-4 py-1">
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded shadow"
                    />
                  </td>
                  <td className="px-4 py-1">{book.title}</td>
                  <td className="px-4 py-1">{book.author}</td>
                  <td className="px-4 py-1 capitalize">{book.category}</td>
                  <td className="px-4 py-1">{book.publishedYear}</td>
                  <td className="px-4 py-1">{book.createdAt}</td>
                  <td className="px-4 py-1 text-center space-x-2">
                    <Link to={`/admin-dashboard/edit-book-form/${book.id}`}>
                      <button className="text-blue-600 cursor-pointer hover:text-blue-800">
                        <FiEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
