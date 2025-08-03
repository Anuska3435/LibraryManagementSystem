import axios from "axios";
import { useEffect, useState } from "react";

const IssueBookHistoryList = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null); // track updating record

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [issuedRes, userRes, bookRes] = await Promise.all([
        axios.get("http://localhost:5000/issuedBooks"),
        axios.get("http://localhost:5000/users"),
        axios.get("http://localhost:5000/books"),
      ]);
      setIssuedBooks(issuedRes.data);
      setUsers(userRes.data);
      setBooks(bookRes.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load issue history");
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  const getBookTitle = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    return book ? book.title : "Unknown Book";
  };

  // Handler to mark book as returned
  const handleMarkReturned = async (record) => {
    if (
      !window.confirm(
        `Mark "${getBookTitle(record.bookId)}" as returned by ${getUserName(
          record.userId
        )}?`
      )
    ) {
      return;
    }
    setUpdatingId(record.id);
    try {
      await axios.patch(`http://localhost:5000/issuedBooks/${record.id}`, {
        status: "returned",
        returnDate: new Date().toISOString().split("T")[0], // yyyy-mm-dd
      });
      // Refresh data
      await fetchAllData();
    } catch (err) {
      alert("Failed to update return status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return <p className="text-center py-10">Loading issue history...</p>;

  if (error)
    return (
      <p className="text-center py-10 text-red-600 font-semibold bg-red-100 rounded max-w-md mx-auto">
        {error}
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        📖 Issue History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                User
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Book
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Issue Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Due Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Return Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {issuedBooks.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-600 italic"
                >
                  No issue records found.
                </td>
              </tr>
            ) : (
              issuedBooks.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50 transition">
                  <td className="border border-gray-300 px-4 py-2">
                    {getUserName(record.userId)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {getBookTitle(record.bookId)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(record.issueDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(record.dueDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.returnDate
                      ? new Date(record.returnDate).toLocaleDateString()
                      : "Not returned"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.status === "issued" ? (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800">
                        Issued
                      </span>
                    ) : record.status === "returned" ? (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
                        Returned
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
                        {record.status}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.status === "issued" ? (
                      <button
                        disabled={updatingId === record.id}
                        onClick={() => handleMarkReturned(record)}
                        className={`px-3 py-1 rounded bg-green-600 cursor-pointer text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingId === record.id
                          ? "Updating..."
                          : "Mark as Returned"}
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueBookHistoryList;
