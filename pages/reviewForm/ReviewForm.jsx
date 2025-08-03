// ReviewForm.jsx
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const ReviewForm = ({ bookId, user }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      bookId,
      userId: user.id,
      userName: user.fullName,
      rating,
      review,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5000/reviews", newReview);
      toast.success("Review submitted successfully!");
      setReview("");
      setRating(5);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        className="border p-2 w-full"
        required
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
