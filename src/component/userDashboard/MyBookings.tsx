import React from "react";
import { useGetUserBookingsQuery } from "../../features/api/bookingApi";


const MyBookings: React.FC = () => {
 const { data: bookings, isLoading, isError, error } = useGetUserBookingsQuery();

if (isLoading) {
  return <p className="text-center py-6">Loading your bookings…</p>;
}

if (isError) {
  let errorMessage = "Something went wrong while fetching your bookings.";

  if ("status" in error) {
    if (error.status === 401 || error.status === 403) {
      errorMessage = "Your session has expired. Please log in again.";
    } else if (error.status === 500) {
      errorMessage = "Server error. Please try again later.";
    }
  }
  return (
    <p className="text-center py-6 text-red-400">
      {errorMessage}
    </p>
  );
}

if (!bookings || bookings.length === 0) {
  return (
    <p className="text-center py-6 text-gray-500">
      You haven’t made any bookings yet.
    </p>
  );
}


  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">My Bookings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((b) => (
          <div
            key={b.bookingId}
            className="border rounded-md p-4 shadow-sm bg-gray-50"
          >
            <h3 className="font-semibold text-purple-600 text-lg mb-1">
              {b.eventTitle}
            </h3>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(b.eventDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {b.quantity}
            </p>
            <p>
              <span className="font-semibold">Total:</span> KSh {b.totalAmount}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`badge ${
                  b.bookingStatus === "Confirmed"
                    ? "badge-success"
                    : b.bookingStatus === "Pending"
                    ? "badge-warning"
                    : "badge-ghost"
                }`}
              >
                {b.bookingStatus}
              </span>
            </p>
            <p>
              <span className="font-semibold">Payment:</span>{" "}
              {b.paymentMethod} ({b.paymentStatus})
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Booked on {new Date(b.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
