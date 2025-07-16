import React from "react";
import {
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
} from "../../features/api/bookingApi";
import {
  useUpdatePaymentMutation,
} from "../../features/api/paymentsApi";
import Swal from "sweetalert2";
import { Loader2, CalendarDays } from "lucide-react";

const AllBookings: React.FC = () => {
  const { data: bookings, isLoading, error, refetch } = useGetBookingsQuery();
  const [deleteBooking] = useDeleteBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [updatePayment] = useUpdatePaymentMutation();

  const handleDeleteBooking = async (bookingId: number) => {
    const result = await Swal.fire({
      title: "Delete booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteBooking(bookingId).unwrap();
        Swal.fire("Deleted", "Booking removed", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Could not delete booking", "error");
      }
    }
  };

  const handleConfirmBooking = async (bookingId: number) => {
    try {
      await updateBooking({ booking_id: bookingId, payload: { bookingStatus: "Confirmed" } }).unwrap();
      Swal.fire("Booking Confirmed", "", "success");
      refetch();
    } catch {
      Swal.fire("Error", "Could not confirm booking", "error");
    }
  };

  const handleConfirmPayment = async (paymentId: number) => {
    try {
      await updatePayment({ payment_id: paymentId, payload: { paymentStatus: "Confirmed" } }).unwrap();
      Swal.fire("Payment Confirmed", "", "success");
      refetch();
    } catch {
      Swal.fire("Error", "Could not confirm payment", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
          <CalendarDays size={20} /> All Bookings
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center font-semibold p-4">
          Failed to fetch bookings.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Event</th>
                <th className="p-2">Date</th>
                <th className="p-2">Tickets</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((b: any) => (
                <tr key={b.bookingId} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-green-800 font-medium">
                    {b.userName}<br/>
                    <span className="text-xs text-gray-900 font-semibold">{b.userEmail}</span>
                  </td>
                  <td className="p-2 text-slate-800">{b.eventTitle}</td>
                  <td className="p-2 text-xs text-blue-800 font-medium">{b.eventDate}</td>
                  <td className="p-2 text-indigo-700 font-bold">{b.quantity}</td>
                  <td className="p-2 text-amber-950 font-semibold">Ksh {b.totalAmount.toLocaleString()}</td>
                  <td className="p-2">
                    <span className="text-xs text-blue-800 font-medium">{b.paymentMethod}</span><br/>
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      b.paymentStatus === "Confirmed"
                        ? "bg-green-600"
                        : b.paymentStatus === "Failed"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}>
                      {b.paymentStatus}
                    </span>
                 {b.paymentStatus === "Pending" && b.paymentId && (
  <button
    className="mt-1 btn btn-xs bg-green-700 text-white"
    onClick={() => handleConfirmPayment(b.paymentId)}
  >
    Confirm Payment
  </button>
)}

                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      b.bookingStatus === "Confirmed"
                        ? "bg-green-700"
                        : "bg-blue-500"
                    }`}>
                      {b.bookingStatus}
                    </span>
                    {b.bookingStatus === "Pending" && (
                      <button
                        className="mt-1 btn btn-xs bg-blue-700 text-white"
                        onClick={() => handleConfirmBooking(b.bookingId)}
                      >
                        Confirm Booking
                      </button>
                    )}
                  </td>
                  <td className="p-2 space-y-1">
                    <button
                      className="btn btn-sm bg-red-600 text-white"
                      onClick={() => handleDeleteBooking(b.bookingId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
