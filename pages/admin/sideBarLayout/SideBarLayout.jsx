import { useEffect, useState } from "react";
import { FiBookOpen, FiClock, FiHome, FiLogOut, FiUsers } from "react-icons/fi";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { path: "/admin-dashboard", label: "Dashboard", icon: <FiHome /> },
  { path: "/admin-dashboard/all-books", label: "Books", icon: <FiBookOpen /> },
  {
    path: "/admin-dashboard/add-book-form",
    label: "Add Book",
    icon: <FiBookOpen />,
  },
  {
    path: "/admin-dashboard/edit-book-form/:id",
    label: "Edit Book",
    icon: <FiBookOpen />,
  },
  { path: "/admin-dashboard/all-customers", label: "Users", icon: <FiUsers /> },
  {
    path: "/admin-dashboard/issue-book-form",
    label: "Issue Book",
    icon: <FiClock />,
  },
  {
    path: "/admin-dashboard/issue-book-history",
    label: "Issue Book History",
    icon: <FiClock />,
  },
];

const SideBarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user?.role === "admin") {
      setAdminName(user.fullName || "Admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-white">📚 Library Admin</h2>

        <nav className="flex flex-col gap-3">
          {navLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Admin Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="text-lg font-semibold text-gray-800">
            Welcome, <span className="text-blue-600">{adminName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 text-red-600 hover:text-red-800 transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>

        {/* Outlet */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SideBarLayout;
