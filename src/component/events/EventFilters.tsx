import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilters } from "../../features/events/eventsSlice";

const EventFilter: React.FC = () => {
  const dispatch = useDispatch();

  // Local form state
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // Apply filters only when button is clicked
  const handleApplyFilters = () => {
    dispatch(setFilters({ category, date }));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 mb-6 gap-4">
      {/* Category Filter */}
      <div className="flex flex-col">
           <label
    htmlFor="category"
    className="
      mb-1 text-sm font-medium
      bg-gradient-to-r from-green-700 via-yellow-700 to-amber-700
      bg-clip-text text-transparent
    "
  >
    Category
  </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-pink-400  rounded-md p-2"
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Conference">Conference</option>
          <option value="Art">Art</option>
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col">
        <label
    htmlFor="eventDate"
    className="
      mb-1 text-sm font-medium
      bg-gradient-to-r from-green-700 via-yellow-700 to-amber-500
      bg-clip-text text-transparent
    "
  >
    Event Date
  </label>
        <input
          id="eventDate"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-pink-400 rounded-md p-2"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={handleApplyFilters}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
      >
        Apply Filters
      </button>
{/* Clear Filters Button */}
<button
  onClick={() => {
    setCategory("");
    setDate("");
    dispatch(setFilters({ category: "", date: "" }));
  }}
  className="bg-amber-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
>
  Clear Filters
</button>

    </div>
  );
};

export default EventFilter;
