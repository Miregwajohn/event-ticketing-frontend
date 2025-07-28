import { useSelector } from "react-redux";
import {
  useGetEventsQuery,
  useGetUpcomingEventsQuery,
} from "../features/api/eventsApi";
import EventCard from "../component/events/EventCard";
import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";
import EventFilter from "../component/events/EventFilters";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { RootState } from "../app/store";

// ✅ Cloudinary illustration image instead of local asset
const CLOUDINARY_ILLUSTRATION =
  "https://res.cloudinary.com/dtuiikffe/image/upload/v1753579935/EventIllustration_kp4jr0.jpg";

const Home = () => {
  const { category, date, location } = useSelector(
    (state: RootState) => state.events.filters
  );

  const { data: events, isLoading, error } = useGetEventsQuery({
    category,
    date,
    location,
  });

  const {
    data: upcomingEvents,
    isLoading: loadingUpcoming,
    error: errorUpcoming,
  } = useGetUpcomingEventsQuery();

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-amber-50 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left space-y-6">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl font-bold text-green-800"
            >
              Discover and <span className="text-amber-300">Book Events</span> Easily
            </motion.h1>
            <p className="text-lg text-gray-600">
              Find upcoming concerts, conferences, and local meetups at your fingertips.
            </p>
            <Link
              to="/events"
              className="btn btn-primary bg-fuchsia-600 border-none text-white px-6"
            >
              Browse Events
            </Link>
          </div>

          <div className="flex justify-center md:justify-end">
            <motion.img
              src={CLOUDINARY_ILLUSTRATION}
              alt="Event illustration"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-lg object-contain rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="pt-16 pb-6 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-600 mb-6 text-center">
            Filter Events
          </h2>
          <EventFilter />
        </div>
      </section>

      {/* Featured Events */}
      <section className="pt-8 pb-12 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-600 mb-8 text-center">
            Featured Events
          </h2>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading events...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error loading filtered events.</p>
          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {events?.map((event) => (
                <EventCard
                  key={event.eventId}
                  eventId={event.eventId}
                  slug={event.slug}
                  title={event.title}
                  date={event.date}
                  location={event.venue?.address || `Venue ID: ${event.venueId}`}
                  image={event.image} // ✅ Must be a Cloudinary URL in backend
                  ticketPrice={event.ticketPrice}
                  ticketsSold={event.ticketsSold}
                  ticketsTotal={event.ticketsTotal}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="pt-8 pb-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            📅 Upcoming Events
          </h2>
          {loadingUpcoming ? (
            <p className="text-center text-gray-500">Loading upcoming events...</p>
          ) : errorUpcoming ? (
            <p className="text-center text-red-500">Error loading upcoming events.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {upcomingEvents?.map((event) => (
                <EventCard
                  key={event.eventId}
                  eventId={event.eventId}
                  slug={event.slug}
                  title={event.title}
                  date={event.date}
                  location={event.venue?.address || "TBA"}
                  image={event.image} // ✅ Must be a Cloudinary URL in backend
                  ticketPrice={event.ticketPrice}
                  ticketsSold={event.ticketsSold}
                  ticketsTotal={event.ticketsTotal}
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

export default Home;
