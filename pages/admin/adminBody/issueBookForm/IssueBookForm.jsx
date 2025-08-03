import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const IssueBookForm = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    bookId: "",
    issueDate: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, bookRes] = await Promise.all([
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/books"),
        ]);
        // Filter out users with role 'admin'
        const filteredUsers = userRes.data.filter((u) => u.role !== "admin");
        setUsers(filteredUsers);
        setBooks(bookRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load users or books");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.bookId || !form.issueDate || !form.dueDate) {
      toast.error("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/issuedBooks", {
        ...form,
        returnDate: null,
        status: "issued",
      });
      toast.success("✅ Book issued successfully!");
      setForm({ userId: "", bookId: "", issueDate: "", dueDate: "" });
    } catch (err) {
      toast.error("❌ Failed to issue book.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <span className="ml-3 text-blue-700 font-semibold">
          Loading data...
        </span>
      </div>
    );

  if (error)
    return (
      <p className="max-w-md mx-auto p-4 text-center text-red-600 font-semibold bg-red-100 rounded">
        {error}
      </p>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-lg p-8 rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center gap-2">
        <span>📚</span> Issue Book Form
      </h2>

      {/* User Select */}
      <div>
        <label
          className="block mb-2 font-semibold text-gray-700"
          htmlFor="userId"
        >
          Select User:
        </label>
        <select
          id="userId"
          name="userId"
          value={form.userId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
          disabled={submitting}
        >
          <option value="" disabled>
            -- Choose a user --
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Book Select */}
      <div>
        <label
          className="block mb-2 font-semibold text-gray-700"
          htmlFor="bookId"
        >
          Select Book:
        </label>
        <select
          id="bookId"
          name="bookId"
          value={form.bookId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
          disabled={submitting}
        >
          <option value="" disabled>
            -- Choose a book --
          </option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
      </div>

      {/* Issue Date */}
      <div>
        <label
          className="block mb-2 font-semibold text-gray-700"
          htmlFor="issueDate"
        >
          Issue Date:
        </label>
        <input
          id="issueDate"
          type="date"
          name="issueDate"
          value={form.issueDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
          disabled={submitting}
        />
      </div>

      {/* Due Date */}
      <div>
        <label
          className="block mb-2 font-semibold text-gray-700"
          htmlFor="dueDate"
        >
          Due Date:
        </label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
          disabled={submitting}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-3 rounded-lg font-semibold text-white transition
          ${
            submitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {submitting ? "Issuing..." : "Issue Book"}
      </button>
    </form>
  );
};

export default IssueBookForm;
