import axios from "axios";
import { useState } from "react";
import {
  FaBook,
  FaCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignInAlt,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";

      case "password":
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain uppercase, lowercase, and number";
        }
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // Fixed handleLogin function
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission if called from form

    // Validate all fields before submission
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      setTouched({
        email: true,
        password: true,
      });
      toast.error("Please fix the validation errors");
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Query user by email - Fixed the API call
      const res = await axios.get(
        `http://localhost:5000/users?email=${formData.email}`
      );

      const users = res.data;

      if (users.length === 0) {
        // No user with this email
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      const user = users[0];

      if (user.password !== formData.password) {
        // Password mismatch
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Login success
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast.success("Login successful!");

      // Navigate based on role
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // Server responded with error status
        toast.error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        toast.error(
          "Cannot connect to server. Please check if json-server is running on port 5000."
        );
      } else {
        // Something else happened
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return null;
    return errors[fieldName] ? "error" : "success";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <FaBook className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to access your library account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    getFieldStatus("email") === "error"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : getFieldStatus("email") === "success"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your email address"
                  required
                />
                {getFieldStatus("email") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {getFieldStatus("email") === "success" ? (
                      <FaCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <FaTimes className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    getFieldStatus("password") === "error"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : getFieldStatus("password") === "success"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <FaSignInAlt className="h-5 w-5" />
                <span>{isLoading ? "Signing in..." : "Sign In"}</span>
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
