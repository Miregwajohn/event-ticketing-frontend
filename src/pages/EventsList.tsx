import React from "react";
import { useSelector } from "react-redux";
import { useGetEventsQuery } from "../features/api/eventsApi";
import EventCard from "../component/events/EventCard";
import EventFilter from "../component/events/EventFilters";
import Navbar from "../component/common/Navbar";
import Footer from "../component/common/Footer";
import type { RootState } from "../app/store";
import type { Event } from "../types/types";

const EventsList: React.FC = () => {
  const { category, date, location } = useSelector(
    (state: RootState) => state.events.filters
  );

  const { data: events, error, isLoading } = useGetEventsQuery({
    category,
    date,
    location,
  });

  return (
    <>
      <Navbar />
      <section className="py-16 px-6 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-green-800">
            Browse Events
          </h1>

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
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
              {events?.map((event: Event) => (
                <EventCard
                  key={event.eventId}
                  eventId={event.eventId}
                  slug={event.slug}
                  title={event.title}
                  date={event.date}
                  location={event.venue?.address || `Venue ID: ${event.venueId}`}
                  ticketPrice={event.ticketPrice}
                  ticketsSold={event.ticketsSold}
                  ticketsTotal={event.ticketsTotal}
                  image={event.image ?? ""}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default EventsList;
