import React from "react";
import { useSelector } from "react-redux";
import { useGetEventsQuery } from "../../features/api/eventsApi";
import EventCard from "../events/EventCard";
import EventFilter from "../events/EventFilters";
import type { RootState } from "../../app/store";
import type { Event } from "../../types/types";

const BrowseEvents: React.FC = () => {
  const { category, date, location } = useSelector((state: RootState) => state.events.filters);

  const {
    data: events,
    error,
    isLoading,
  } = useGetEventsQuery({ category, date, location });

  return (
    <section className="py-6 px-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">🎟️ Browse Events</h1>

      <EventFilter />

      {isLoading ? (
        <p className="text-center">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error loading events</p>
      ) : Array.isArray(events) && events.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No events found for the selected filters.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
          {events?.map((event: Event) => (
            <EventCard
              key={event.eventId}
              eventId={event.eventId}
              slug={event.slug} // ✅ Add this
              title={event.title}
              date={event.date}
              location={event.venue?.address || `Venue ID: ${event.venueId}`}
              image={event.image || "default-event.jpg"}
              ticketPrice={event.ticketPrice}
              ticketsSold={event.ticketsSold}
              ticketsTotal={event.ticketsTotal}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BrowseEvents;
