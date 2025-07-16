import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetEventByIdQuery,
  useGetEventsQuery,
  useCreateBookingMutation,
} from "../features/api/eventsApi";
import Navbar from "../component/common/Navbar";
import Footer from "../component/common/Footer";
import EventCard from "../component/events/EventCard";
import EventFilter from "../component/events/EventFilters";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { Event } from "../types/types";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Events: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const id = Number(eventId);
  const navigate = useNavigate();

  const { category, date } = useSelector((state: RootState) => state.events.filters);
  const { user } = useSelector((state: RootState) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();

  const {
    data: event,
    error: eventError,
    isLoading: loadingSingle,
  } = useGetEventByIdQuery(id, { skip: isNaN(id) });

  const {
    data: events,
    error: eventsError,
    isLoading: loadingList,
  } = useGetEventsQuery({ category, date }, { skip: !!eventId });

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

      const bookingId = response.bookingId || response.id || 1;

      Swal.fire({
        title: "🎉 Booking Successful!",
        html: `
          <div style="text-align:left;">
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Tickets:</strong> ${quantity}</p>
            <p><strong>Total:</strong> Ksh ${totalAmount}</p>
          </div>
          <br/>
          <p>Redirecting to payment...</p>
        `,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate(`/payment/${bookingId}`);
      }, 2000);
    } catch (error: any) {
      console.error("Booking failed", error);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <Navbar />

      {eventId ? (
        <div className="py-16 px-6 bg-gray-50 min-h-screen">
          {loadingSingle ? (
            <div className="p-6">Loading event details...</div>
          ) : eventError || !event ? (
            <div className="p-6 text-red-500">Error loading event details</div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h2>
              <img
                src={`/images/${event.image || "default-event.jpg"}`}
                alt={event.title}
                className="w-full h-60 object-cover rounded-md mb-4"
              />
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="space-y-2 text-gray-700 mb-6">
                <p><strong>Venue:</strong> Venue #{event.venueId}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Ticket Price:</strong> Ksh {event.ticketPrice}</p>
                <p><strong>Total Tickets:</strong> {event.ticketsTotal}</p>
                <p><strong>Tickets Sold:</strong> {event.ticketsSold}</p>
              </div>

              {/* Booking UI */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🎟️ Book Tickets</h3>
                <div className="flex items-center gap-4 mb-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Number of Tickets:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={event.ticketsTotal - event.ticketsSold}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded px-3 py-2 w-24"
                  />
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  Total: <span className="font-semibold">Ksh {event.ticketPrice * quantity}</span>
                </p>
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="btn btn-primary bg-green-700 text-white px-6 py-2 rounded"
                >
                  {bookingLoading ? "Processing..." : "Book Now"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <section className="py-16 px-6 bg-white min-h-screen">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-10 text-green-800">Browse Events</h1>

            <EventFilter />

            {loadingList ? (
              <p className="text-center">Loading events...</p>
            ) : eventsError ? (
              <p className="text-center text-red-500">Error loading events</p>
            ) : Array.isArray(events) && events.length === 0 ? (
              <p className="text-center text-gray-500 text-lg mt-10">
                🎟️ No events found for the selected filters.
              </p>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
                {events?.map((event: Event) => (
                  <EventCard
                    key={event.eventId}
                    eventId={event.eventId}
                    title={event.title}
                    date={event.date}
                    location={`Venue ID: ${event.venueId}`}
                    image={event.image || "default-event.jpg"}
                    ticketPrice={event.ticketPrice}
                    ticketsSold={event.ticketsSold}
                    ticketsTotal={event.ticketsTotal}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default Events;
