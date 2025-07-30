import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEventBySlugQuery, useCreateBookingMutation } from "../features/api/eventsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import Navbar from "../component/common/Navbar";
import Footer from "../component/common/Footer";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: event, error, isLoading } = useGetEventBySlugQuery(slug!, {
    skip: !slug,
  });

  const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();

  const handleBooking = async () => {
    if (!event || !user) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to book this event.",
      });
      return;
    }

    try {
      const totalAmount = event.ticketPrice * quantity;
      const response = await createBooking({
        userId: user.userId,
        eventId: event.eventId,
        quantity,
        totalAmount,
      }).unwrap();

      const bookingId = response?.bookingId || response?.id;

      if (!bookingId) {
        throw new Error("Booking ID not returned.");
      }

      navigate(`/payment/${bookingId}`, {
  state: {
    booking: {
      bookingId,
      eventTitle: event.title,
      eventCategory: event.category,
      quantity,
      totalAmount: event.ticketPrice * quantity,
      ticketPrice: event.ticketPrice,
      location: event.venue?.address,
      eventDate: event.date,
      eventTime: event.time,
    }
  }
});

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "Something went wrong. Please try again.",
      });
      console.error("Booking Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50 min-h-screen">
        {isLoading ? (
          <div className="p-6">Loading event details...</div>
        ) : error || !event ? (
          <div className="p-6 text-red-500">Error loading event details</div>
        ) : (
          <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 shadow-md rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{event.title}</h2>
            <img
              src={
                event.image?.startsWith("http")
                  ? event.image
                  : `/images/${event.image || "default-event.jpg"}`
              }
              alt={event.title}
              className="w-full h-48 sm:h-60 object-cover rounded-md mb-4"
            />

            <p className="text-gray-600 mb-4 text-base sm:text-lg">{event.description}</p>
            <div className="space-y-2 text-gray-700 mb-6 text-sm sm:text-base">
              <p>
                <strong>Venue:</strong> {event.venue?.name} - {event.venue?.address}
              </p>
              <p>
                <strong>Date:</strong> {event.date}
              </p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>Ticket Price:</strong> Ksh {event.ticketPrice}
              </p>
              <p>
                <strong>Total Tickets:</strong> {event.ticketsTotal}
              </p>
              <p>
                <strong>Tickets Sold:</strong> {event.ticketsSold}
              </p>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🎟️ Book Tickets</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <label
                  htmlFor="quantity"
                  className="text-sm font-medium text-gray-700"
                >
                  Number of Tickets:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={event.ticketsTotal - event.ticketsSold}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded px-3 py-2 w-full sm:w-24"
                />
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Total: <span className="font-semibold">Ksh {event.ticketPrice * quantity}</span>
              </p>
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="btn btn-primary bg-green-700 text-white px-6 py-2 rounded w-full sm:w-auto"
              >
                {bookingLoading ? "Processing..." : "Book Now"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EventDetail;
