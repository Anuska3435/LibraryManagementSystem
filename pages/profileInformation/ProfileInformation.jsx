import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProfileInformation = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNo: "",
    address: "",
    gender: "",
  });

  // Parse user object from localStorage and get userId
  const userObj = JSON.parse(localStorage.getItem("currentUser"));
  const userId = userObj?.id;

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/users/${userId}`)
        .then((res) => {
          setUser(res.data);
          setFormData({
            fullName: res.data.fullName,
            mobileNo: res.data.mobileNo,
            address: res.data.address,
            gender: res.data.gender,
          });
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = () => {
    if (!userId) return;
    axios
      .put(`http://localhost:5000/users/${userId}`, {
        ...user,
        ...formData,
      })
      .then((res) => {
        setUser(res.data);
        setEditing(false);
        toast("Profile updated successfully");
      })
      .catch((err) => console.error("Update failed:", err));
  };

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            disabled={!editing}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium">Mobile No:</label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            disabled={!editing}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            disabled={!editing}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            disabled={!editing}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between">
        {editing ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setFormData({
                  fullName: user.fullName,
                  mobileNo: user.mobileNo,
                  address: user.address,
                  gender: user.gender,
                });
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileInformation;
