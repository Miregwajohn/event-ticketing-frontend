// import React from "react";
// import {
//   useGetUserVenueBookingsQuery,
//   useDeleteVenueBookingMutation,
// } from "@/store/rtk/venueBookingApi"; // adjust path as needed
// import { VenueBooking } from "@/types/types"; // make sure types match your RTK slice
// import { formatTime } from "@/utils/formatters"; // optional helper for prettifying time
// import { FiTrash2, FiMapPin } from "react-icons/fi";

// const VenueBookings: React.FC = () => {
//   const { data: bookings, isLoading, isError } = useGetUserVenueBookingsQuery();
//   const [deleteBooking] = useDeleteVenueBookingMutation();

//   const handleDelete = (id: number) => {
//     if (window.confirm("Are you sure you want to cancel this booking?")) {
//       deleteBooking(id);
//     }
//   };

//   return (
//     <section className="p-6 max-w-4xl mx-auto space-y-6">
//       <h2 className="text-2xl font-bold">📍 My Venue Bookings</h2>

//       {isLoading && <p className="text-gray-500">Loading venue bookings...</p>}
//       {isError && <p className="text-red-500">Failed to load bookings. Please try again.</p>}

//       {!isLoading && bookings?.length === 0 && (
//         <p className="text-gray-500">You haven’t booked any venues yet.</p>
//       )}

//       {!isLoading && bookings?.map((booking: VenueBooking) => (
//         <div
//           key={booking.venueBookingId}
//           className="bg-white border shadow-sm rounded-md p-5 flex flex-col gap-2"
//         >
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-semibold">{booking.eventTitle}</h3>
//             <button
//               onClick={() => handleDelete(booking.venueBookingId)}
//               className="text-red-600 hover:text-red-800"
//               title="Cancel Booking"
//             >
//               <FiTrash2 size={20} />
//             </button>
//           </div>

//           <p className="text-sm text-gray-600">
//             <strong>Date:</strong> {booking.date} | <strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
//           </p>

//           <p className="text-sm">
//             <strong>Status:</strong>{" "}
//             <span className={`px-2 py-1 rounded-full text-white text-xs ${
//               booking.status === "Confirmed" ? "bg-green-500"
//               : booking.status === "Pending" ? "bg-yellow-500"
//               : "bg-red-500"
//             }`}>
//               {booking.status}
//             </span>
//           </p>

//           {booking.venue && (
//             <div className="text-sm space-y-1">
//               <p>
//                 <strong>Venue:</strong> {booking.venue.name}
//               </p>
//               <p className="flex items-center gap-1 text-gray-600">
//                 <FiMapPin /> {booking.venue.address}
//               </p>
//               <p>
//                 <strong>Rate:</strong> KES {booking.venue.pricePerHour}/hr
//               </p>
//             </div>
//           )}
//         </div>
//       ))}
//     </section>
//   );
// };

// export default VenueBookings;
