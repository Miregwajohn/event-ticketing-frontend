import { useSelector } from "react-redux";
import { useGetEventsQuery } from "../features/api/eventsApi";
import EventCard from "../component/events/EventCard";
import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";
import type {Event} from "../types/types"; 
import type { RootState } from "../app/store";
import EventFilter from "../component/events/EventFilters"; 
import { Link } from "react-router-dom";
import EventIllustration from "../assets/EventIllustration.jpg";
import { motion } from "framer-motion";

const Home = () => {
  const { category, date } = useSelector((state: RootState) => state.events.filters);

  const { data: events, isLoading, error } = useGetEventsQuery({ category, date });

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events</div>;

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
    src={EventIllustration}
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
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-600 mb-8 text-center">
            Filter Events
          </h2>
          {/* ✅ Use reusable filter component */}
          <EventFilter />
        </div>
      </section>

      {/* Events Display */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-600 mb-8 text-center">
            Featured Events
          </h2>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {events?.map((event: Event) => (
              <EventCard
                key={event.eventId}
                eventId={event.eventId}
                title={event.title}
                date={event.date}
                location={`Venue ID: ${event.venueId}`} //  Replace with venue name after join
                image={event.image || "/assets/default-event-image.jpg"}
                ticketPrice={event.ticketPrice}
                ticketsSold={event.ticketsSold}
                ticketsTotal={event.ticketsTotal}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
