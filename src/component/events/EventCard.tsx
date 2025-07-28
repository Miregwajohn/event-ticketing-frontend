import React from "react";
import { useNavigate } from "react-router-dom";

type EventCardProps = {
  eventId: number;
  slug: string;
  title: string;
  date: string;
  location: string;
  image?: string; // Make image optional
  ticketPrice: number;
  ticketsSold: number;
  ticketsTotal: number;
};

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dtuiikffe/image/upload/v1753581001/default-event_wgl3yu.jpg";

const EventCard: React.FC<EventCardProps> = ({
  slug,
  title,
  date,
  location,
  image,
  ticketPrice,
  ticketsSold,
  ticketsTotal,
}) => {
  const navigate = useNavigate();
  const ticketsAvailable = ticketsTotal - ticketsSold;
  const isSoldOut = ticketsAvailable <= 0;

  const handleClick = () => {
    if (!isSoldOut) {
      navigate(`/events/${slug}`);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
      <div onClick={handleClick} className="cursor-pointer">
        <img
          src={image || DEFAULT_IMAGE}
          alt={title}
          className="w-full h-40 object-cover rounded-md"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-sm text-gray-600">
          Ticket Price: Ksh {ticketPrice} | Tickets Sold: {ticketsSold} / {ticketsTotal}
        </p>

        <button
          onClick={handleClick}
          disabled={isSoldOut}
          className={`btn btn-primary mt-4 w-full ${
            isSoldOut ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
        >
          {isSoldOut ? "Sold Out" : "Book Ticket"}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
