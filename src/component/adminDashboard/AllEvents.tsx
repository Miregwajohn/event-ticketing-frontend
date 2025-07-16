import React, { useState } from "react";
import {
  useGetEventsQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "../../features/api/eventsApi";
import { ShieldCheck, Pencil, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AllEvents: React.FC = () => {
  const { data: events, isLoading, error, refetch } = useGetEventsQuery({});
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingEvent(null);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (eventId: number) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(eventId).unwrap();
        Swal.fire("Deleted", "Event has been removed", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Failed to delete event", "error");
      }
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    const {
      eventId,
      title,
      description,
      category,
      venueId,
      date,
      time,
      ticketPrice,
      ticketsTotal,
      ticketsSold,
    } = editingEvent;

    try {
      await updateEvent({
        event_id: eventId,
        payload: {
          title,
          description,
          category,
          venueId,
          date,
          time,
          ticketPrice,
          ticketsTotal,
          ticketsSold,
        },
      }).unwrap();
      Swal.fire("Success", "Event updated successfully", "success");
      closeModal();
      refetch();
    } catch {
      Swal.fire("Error", "Failed to update event", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
          <ShieldCheck size={20} /> All Events
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="animate-spin text-green-500" />
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">Failed to load events.</p>
      ) : (
        <table className="table text-sm border border-gray-200">
          <thead className="bg-green-100 text-gray-700">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event: any) => (
              <tr
                key={event.eventId}
                className="border-b bg-white hover:bg-gray-50 transition-colors"
              >
                <td className="p-2 text-gray-900 font-semibold">{event.title}</td>
                <td className="p-2 text-green-800 font-medium">{event.category}</td>
                <td className="p-2 text-slate-800">
                  {event.date} @ {event.time}
                </td>
                <td className="p-2 text-blue-800 font-medium">
                  Venue #{event.venueId}
                </td>
                <td className="p-2 text-indigo-700 font-bold">
                  ${event.ticketPrice}
                </td>
                <td className="p-2 flex gap-2 items-center">
                  <button
                    type="button"
                    title="Edit event"
                    className="btn btn-sm bg-yellow-500 text-white focus:outline-none"
                    onClick={() => openEditModal(event)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    title="Delete event"
                    className="btn btn-sm bg-red-600 text-white focus:outline-none"
                    onClick={() => handleDeleteEvent(event.eventId)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-lg shadow-lg max-w-lg mx-auto p-6 mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold mb-4 text-green-700">Edit Event</h3>
        {editingEvent && (
          <form className="grid grid-cols-1 gap-3">
            <input
              className="input input-bordered w-full"
              placeholder="Title"
              value={editingEvent.title}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, title: e.target.value })
              }
            />
            <textarea
              className="textarea textarea-bordered text-gray-900 font-medium"
              placeholder="Description"
              value={editingEvent.description}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, description: e.target.value })
              }
            />
            <input
              className="input input-bordered"
              placeholder="Date"
              value={editingEvent.date}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, date: e.target.value })
              }
            />
            <input
              className="input input-bordered"
              placeholder="Time"
              value={editingEvent.time}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, time: e.target.value })
              }
            />
            <input
              type="number"
              className="input input-bordered"
              placeholder="Price"
              value={editingEvent.ticketPrice}
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  ticketPrice: parseInt(e.target.value),
                })
              }
            />
            <input
              type="number"
              className="input input-bordered"
              placeholder="Tickets Total"
              value={editingEvent.ticketsTotal}
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  ticketsTotal: parseInt(e.target.value),
                })
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn bg-green-600 text-white"
                onClick={handleUpdateEvent}
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AllEvents;
