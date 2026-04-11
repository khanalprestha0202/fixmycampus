// Notifications page - alerts users about report status changes and updates
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  const clearAll = () => {
    localStorage.removeItem("notifications");
    setNotifications([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No notifications yet</p>
          <p className="text-sm mt-2">
            You will be notified when your report status changes
          </p>
          <Link
            to="/reports"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Reports
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <p className="font-medium text-gray-800">{n.title}</p>
              <p className="text-sm text-gray-600 mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">{n.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;