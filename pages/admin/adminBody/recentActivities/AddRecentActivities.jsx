import axios from "axios";
import { useEffect, useState } from "react";
import { FiBook, FiCalendar, FiFileText, FiTag, FiUser } from "react-icons/fi";

const iconMap = {
  FiBook: FiBook,
  FiUser: FiUser,
  FiTag: FiTag,
  FiCalendar: FiCalendar,
  FiFileText: FiFileText,
};

const AddRecentActivities = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/activities?_sort=time&_order=desc")
      .then((res) => setActivities(res.data.slice(0, 5)))
      .catch((err) => console.error("Error fetching activities", err));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Recent Activities
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = iconMap[activity.icon] || FiBook;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <IconComponent className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.user}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.book}
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddRecentActivities;
