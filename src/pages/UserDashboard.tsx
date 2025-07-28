import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useGetUserBookingsQuery } from "../features/api/bookingApi";
import { useGetUserPaymentsQuery } from "../features/api/paymentsApi";
import { useGetUserSupportTicketsQuery } from "../features/api/supportTicketApi";
import { Link } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: bookings = [], isLoading: loadingBookings } = useGetUserBookingsQuery();
  const { data: payments = [], isLoading: loadingPayments } = useGetUserPaymentsQuery();
  const { data: tickets = [], isLoading: loadingTickets } = useGetUserSupportTicketsQuery();

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  const upcoming = bookings.filter(b => new Date(b.eventDate) > new Date());
  const upcomingEvents = upcoming.length;
  const openTickets = tickets.filter(t => t.status !== "resolved").length;
  const recentBookings = bookings.slice(0, 3);
  const nextEvent = upcoming.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())[0];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-3">
        Welcome back, {user?.firstname && user?.lastname} 👋
      </h1>
      <p className="text-cyan-600 text-sm sm:text-base mb-6">
        Use the sidebar to manage your bookings, track payments, and reach out for support.
      </p>

      {(loadingBookings || loadingPayments || loadingTickets) ? (
        <p className="text-gray-600">Loading your dashboard...</p>
      ) : (
        <>
          {/* SECTION: Dashboard overview Cards */}
          <h2 className="text-xl sm:text-2xl font-semibold  text-amber-500  mb-4"> Dashboard Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-600">My Bookings</h3>
              <p className="text-3xl font-bold text-fuchsia-600">{bookings.length}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-600">Payments (KES)</h3>
              <p className="text-3xl font-bold text-green-600">{totalPayments.toLocaleString()}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-600">Upcoming Events</h3>
              <p className="text-3xl font-bold text-blue-600">{upcomingEvents}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-600">Open Tickets</h3>
              <p className="text-3xl font-bold text-red-500">{openTickets}</p>
            </div>
          </div>

          {/* SECTION: Next Upcoming Event */}
          {nextEvent && (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold  text-amber-500  mb-3 "> Next Upcoming Event</h2>
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <p className="text-gray-800 font-medium text-lg">{nextEvent.eventTitle}</p>
                <p className="text-sm text-gray-600 mt-1">📍 {nextEvent.eventDate} | Payment: {nextEvent.paymentStatus}</p>
                <Link
                  to="/events"
                  className="inline-block mt-3 px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded"
                >
                  View Event Details
                </Link>
              </div>
            </>
          )}

          {/* SECTION: Open Tickets Alert */}
          {openTickets > 0 && (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold  text-amber-500  mb-2"> Support Alerts</h2>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6">
                You have {openTickets} unresolved support ticket{openTickets > 1 ? 's' : ''}.{" "}
                <Link to="/dashboard/me/support" className="underline text-yellow-800 font-medium">View Now</Link>
              </div>
            </>
          )}

          {/* SECTION: Recent Bookings */}
          <h2 className="text-xl sm:text-2xl font-semibold  text-amber-500  mb-4 "> Recent Bookings</h2>
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <ul className="divide-y divide-gray-200">
              {recentBookings.map((b, index) => (
                <li key={index} className="py-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{b.eventTitle}</span>
                    <span className="text-sm text-gray-500">{b.bookingStatus}</span>
                  </div>
                  <p className="text-sm text-gray-500">📅 {new Date(b.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* SECTION: Quick Actions */}
          <h2 className="text-xl sm:text-2xl font-semibold text-amber-500 mb-4 "> Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/events" className="btn btn-outline text-fuchsia-600">🎟️ Book Event</Link>
            <Link to="/dashboard/me/payments" className="btn btn-outline text-green-600">💳 Payments</Link>
            <Link to="/dashboard/me/bookings" className="btn btn-outline text-blue-600">📑 My Bookings</Link>
            <Link to="/dashboard/me/support" className="btn btn-outline text-red-500">✉️ Support Tickets</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
