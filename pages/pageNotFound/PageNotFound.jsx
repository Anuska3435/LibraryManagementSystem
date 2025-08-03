import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-lg">
        404
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
        Page Not Found
      </h2>
      <p className="text-lg text-gray-600 mt-2 mb-6 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-md transition hover:scale-105"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default PageNotFound;
