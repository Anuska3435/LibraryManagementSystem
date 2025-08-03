import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookViewDetails = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")); // logged-in user
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(5);

  // Fetch book details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(console.error);
  }, [id]);

  // Fetch existing reviews
  useEffect(() => {
    axios
      .get(`http://localhost:5000/reviews?bookId=${id}`)
      .then((res) => setReviews(res.data))
      .catch(console.error);
  }, [id]);

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      bookId: id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      rating: userRating,
      review: userReview,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5000/reviews", newReview);
      setUserReview("");
      setUserRating(5);
      setReviews([...reviews, newReview]);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {book ? (
        <>
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-80 object-cover rounded mb-4"
          />
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-sm text-gray-600">Author: {book.author}</p>
          <p className="text-sm text-gray-600">Category: {book.category}</p>
          <p className="mt-4">{book.description}</p>
          <p className="text-xs text-gray-500 mt-2">
            Published Year: {book.publishedYear}
          </p>

          {/* Review Form (only for logged-in user) */}
          {currentUser && currentUser.role === "user" && (
            <form
              onSubmit={handleReviewSubmit}
              className="mt-6 space-x-5 space-y-3 border-t pt-4"
            >
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full border p-2 rounded"
                required
              />
              <select
                value={userRating}
                onChange={(e) => setUserRating(Number(e.target.value))}
                className="border p-2 rounded"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 && "s"}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Review List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">User Reviews</h3>
            {reviews.length === 0 && <p>No reviews yet.</p>}
            {reviews.map((r) => (
              <div
                key={r.id}
                className="mt-3 p-3 border rounded bg-gray-50 space-y-1"
              >
                <div className="font-medium">{r.userName}</div>
                <div className="text-yellow-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                <p>{r.review}</p>
                <p className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading book details...</p>
      )}
    </div>
  );
};

export default BookViewDetails;
