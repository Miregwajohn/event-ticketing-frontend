import React from "react";

const UserDashboard: React.FC = () => {
  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Welcome, Explorer 👋</h1>
      <p className="text-gray-700">
        Use the sidebar to browse events, manage your bookings, track payments, and reach out for support. Your event journey starts here!
      </p>
    </div>
  );
};

export default UserDashboard;
