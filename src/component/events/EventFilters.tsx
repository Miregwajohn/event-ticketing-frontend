import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilters } from "../../features/events/eventsSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// 🔹 Kenyan counties (used as locations)
const counties: string[] = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya",
  "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot"
];

// 🔹 Event categories
const categories: string[] = [
  "Music", "Festival", "Concert", "Conference", "Workshop", "Seminar", "Exhibition",
  "Cultural", "Religious", "Sports", "Comedy", "Theatre", "Tech", "Startup", "Education",
  "Health", "Business", "Networking", "Charity", "Food & Drink", "Fashion", "Art", "Dance"
];

const EventFilter: React.FC = () => {
  const dispatch = useDispatch();

  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleApplyFilters = () => {
    dispatch(setFilters({ category, date, location }));
  };

  const handleClearFilters = () => {
    setCategory("");
    setDate("");
    setLocation("");
    dispatch(setFilters({ category: "", date: "", location: "" }));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 gap-4 mb-6">
      {/* Category */}
      <div className="flex flex-col flex-1">
        <label htmlFor="category" className="mb-1 text-sm font-medium text-green-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-pink-400 text-green-800 rounded-md p-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="flex flex-col flex-1">
        <label htmlFor="eventDate" className="mb-1 text-sm font-medium text-green-700">
          Event Date
        </label>
        <DatePicker
          selected={date ? new Date(date) : null}
          onChange={(selectedDate: Date | null) => {
            const parsedDate = selectedDate?.toISOString().split("T")[0] || "";
            setDate(parsedDate);
          }}
          placeholderText="Pick Event Date"
          className="border border-pink-400 rounded-md bg-white shadow-sm px-3 py-2 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Location */}
      <div className="flex flex-col flex-1">
        <label htmlFor="location" className="mb-1 text-sm font-medium text-green-700">
          Location
        </label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-pink-400 text-green-800 rounded-md p-2"
        >
          <option value="">All Locations</option>
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4 sm:mt-0">
        <button
          onClick={handleApplyFilters}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="bg-amber-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default EventFilter;
