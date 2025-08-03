import axios from "axios";
import { useEffect, useState } from "react";
import { FiBookOpen, FiClipboard, FiTrendingUp, FiUsers } from "react-icons/fi";

const Dashboard = () => {
  // Step 2: Initialize stats state with zero values
  const [stats, setStats] = useState([
    {
      label: "Total Books",
      value: 0,
      icon: <FiBookOpen className="text-3xl text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      label: "Total Users",
      value: 0,
      icon: <FiUsers className="text-3xl text-green-600" />,
      bg: "bg-green-100",
    },
    {
      label: "Books Issued",
      value: 0,
      icon: <FiClipboard className="text-3xl text-purple-600" />,
      bg: "bg-purple-100",
    },
    {
      label: "Users with Issued Books",
      value: 0,
      icon: <FiUsers className="text-3xl text-pink-600" />,
      bg: "bg-pink-100",
    }, // New stat
    {
      label: "Active Sessions",
      value: 14,
      icon: <FiTrendingUp className="text-3xl text-pink-600" />,
      bg: "bg-pink-100",
    }, // Keep this if you want
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Step 3: Fetch all data from APIs
        const [usersRes, booksRes, issuedBooksRes] = await Promise.all([
          axios.get("http://localhost:5000/users"),
          axios.get("http://localhost:5000/books"),
          axios.get("http://localhost:5000/issuedBooks"),
        ]);

        // Step 4: Filter users (exclude admins if needed)
        const users = usersRes.data.filter((user) => user.role !== "admin");

        // Step 5: Calculate how many books are currently issued (status === "issued")
        const booksIssuedCount = issuedBooksRes.data.filter(
          (issue) => issue.status === "issued"
        ).length;

        // Step 6: Find distinct users who have currently issued books
        const currentlyIssued = issuedBooksRes.data.filter(
          (issue) => issue.status === "issued"
        );
        const uniqueUserIds = [
          ...new Set(currentlyIssued.map((issue) => issue.userId)),
        ];
        const usersWithIssuedBooksCount = uniqueUserIds.length;

        // Step 7: Update your stats state with real values
        setStats((prevStats) =>
          prevStats.map((stat) => {
            switch (stat.label) {
              case "Total Books":
                return { ...stat, value: booksRes.data.length };
              case "Total Users":
                return { ...stat, value: users.length };
              case "Books Issued":
                return { ...stat, value: booksIssuedCount };
              case "Users with Issued Books":
                return { ...stat, value: usersWithIssuedBooksCount };
              default:
                return stat;
            }
          })
        );

        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Step 8: Handle loading & error UI
  if (loading)
    return <p className="text-center py-10">Loading dashboard data...</p>;

  if (error)
    return (
      <p className="text-center py-10 text-red-600 font-semibold bg-red-100 rounded max-w-md mx-auto">
        {error}
      </p>
    );

  // Step 9: Render stats grid (unchanged)
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl shadow-sm ${stat.bg} flex items-center justify-between`}
          >
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
            </div>
            <div>{stat.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
