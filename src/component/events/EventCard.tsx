import React from "react";
import { Link } from "react-router-dom";

type EventCardProps = {
  eventId: number;
  title: string;
  date: string;
  location: string;
  image: string;
  ticketPrice: number;
  ticketsSold: number;
  ticketsTotal: number;
};

const EventCard: React.FC<EventCardProps> = ({
  eventId,
  title,
  date,
  location,
  image,
  ticketPrice,
  ticketsSold,
  ticketsTotal,
}) => {
  const ticketsAvailable = ticketsTotal - ticketsSold;
  const isSoldOut = ticketsAvailable <= 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
      <Link to={`/events/${eventId}`}>
       <img
  src={`/images/${image || "default-event.jpg"}`}
  alt={title}
  className="w-full h-40 object-cover rounded-md"
/>

      </Link>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-sm text-gray-600">
          Ticket Price: Ksh {ticketPrice} | Tickets Sold: {ticketsSold} / {ticketsTotal}
        </p>

        <Link to={`/events/${eventId}`}>
          <button
            className={`btn btn-primary mt-4 w-full ${isSoldOut ? "bg-gray-400 cursor-not-allowed" : ""}`}
            disabled={isSoldOut}
          >
            {isSoldOut ? "Sold Out" : "View & Book"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
