import axios from "axios";
import { useState } from "react";
import {
  FaBook,
  FaCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    address: "",
    gender: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.length < 2
          ? "Full name must be at least 2 characters"
          : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";
      case "mobileNo":
        const phoneRegex = /^[0-9]{10}$/;
        return !phoneRegex.test(value) ? "Mobile number must be 10 digits" : "";
      case "address":
        return value.length < 10
          ? "Address must be at least 10 characters"
          : "";
      case "gender":
        return !value ? "Please select a gender" : "";
      case "password":
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain uppercase, lowercase, and number";
        }
        return "";
      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match" : "";
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

    // Re-validate confirm password when password changes
    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          formData.confirmPassword !== value ? "Passwords do not match" : "",
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

  // Check if email already exists
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users?email=${email}`
      );
      return response.data.length > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission and page refresh

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "role") {
        // Skip role validation as it has default value
        newErrors[key] = validateField(key, formData[key]);
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    const isValid = Object.values(newErrors).every((error) => !error);

    if (!isValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        toast.error("An account with this email already exists");
        setErrors((prev) => ({
          ...prev,
          email: "An account with this email already exists",
        }));
        setIsLoading(false);
        return;
      }

      // Generate a unique ID (simple implementation)
      const userId = Math.random().toString(36).substr(2, 4);

      // Create user object without confirmPassword
      const { confirmPassword, ...userData } = formData;
      const userToCreate = {
        id: userId,
        ...userData,
      };

      const response = await axios.post(
        "http://localhost:5000/users",
        userToCreate
      );

      if (response.status === 201) {
        toast.success("Registration successful! Please login to continue.");
        navigate("/login");

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          mobileNo: "",
          address: "",
          gender: "",
          password: "",
          confirmPassword: "",
          role: "user",
        });
        setErrors({});
        setTouched({});

        // Navigate to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Error registering user:", error);

      if (error.response) {
        // Server responded with error status
        toast.error(
          `Registration failed: ${
            error.response.data?.message || error.response.status
          }`
        );
      } else if (error.request) {
        // Request was made but no response received
        toast.error(
          "Cannot connect to server. Please check if json-server is running on port 5000."
        );
      } else {
        // Something else happened
        toast.error(
          "Something went wrong during registration. Please try again."
        );
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
            Join LibraryMS
          </h1>
          <p className="text-lg text-gray-600">
            Create your account to access our library services
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    getFieldStatus("fullName") === "error"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : getFieldStatus("fullName") === "success"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your full name"
                />
                {getFieldStatus("fullName") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {getFieldStatus("fullName") === "success" ? (
                      <FaCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <FaTimes className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.fullName && touched.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

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
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    getFieldStatus("email") === "error"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : getFieldStatus("email") === "success"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your email address"
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

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobileNo"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="mobileNo"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    getFieldStatus("mobileNo") === "error"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : getFieldStatus("mobileNo") === "success"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your mobile number"
                />
                {getFieldStatus("mobileNo") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {getFieldStatus("mobileNo") === "success" ? (
                      <FaCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <FaTimes className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.mobileNo && touched.mobileNo && (
                <p className="mt-1 text-sm text-red-600">{errors.mobileNo}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Address *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 resize-none ${
                    getFieldStatus("address") === "error"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : getFieldStatus("address") === "success"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your complete address"
                />
                {getFieldStatus("address") && (
                  <div className="absolute top-3 right-0 pr-3 flex items-start">
                    {getFieldStatus("address") === "success" ? (
                      <FaCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <FaTimes className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.address && touched.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["Male", "Female", "Other"].map((gender) => (
                  <label
                    key={gender}
                    className="relative flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className="sr-only"
                    />
                    <div
                      className={`w-full p-3 text-center border-2 rounded-lg transition-all duration-200 ${
                        formData.gender === gender
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {gender}
                    </div>
                  </label>
                ))}
              </div>
              {errors.gender && touched.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
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
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    getFieldStatus("password") === "error"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : getFieldStatus("password") === "success"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your password"
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
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase,
                  lowercase, and number
                </p>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                    getFieldStatus("confirmPassword") === "error"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : getFieldStatus("confirmPassword") === "success"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
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
                <FaUserPlus className="h-5 w-5" />
                <span>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </span>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
