import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Welcome, Admin 👋</h1>
      <p className="text-gray-700">
        Use the sidebar to manage users, events, venues, bookings, support tickets, and view analytics.
      </p>
    </div>
  );
};

export default AdminDashboard;
