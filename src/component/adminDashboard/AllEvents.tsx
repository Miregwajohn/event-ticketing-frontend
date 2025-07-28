import React, { useState } from "react";
import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "../../features/api/eventsApi";
import { ShieldCheck, Pencil, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import axios from "axios";


Modal.setAppElement("#root");

const AllEvents: React.FC = () => {
  const { data: events, isLoading, error, refetch } = useGetEventsQuery({});
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
const cloud_name = "dtuiikffe";
const preset_key = "event_images"; // Make sure this matches your Cloudinary preset


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    ticketPrice: 0,
    ticketsTotal: 0,
    image: "",
    venueId: "",
  });

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
      image,
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
          image,
        },
      }).unwrap();
      Swal.fire("Success", "Event updated successfully", "success");
      closeModal();
      refetch();
    } catch {
      Swal.fire("Error", "Failed to update event", "error");
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        ...newEvent,
        venueId: parseInt(newEvent.venueId),
        ticketPrice: Number(newEvent.ticketPrice),
        ticketsTotal: Number(newEvent.ticketsTotal),
      }).unwrap();
      Swal.fire("Success", "Event created successfully", "success");
      setIsCreateModalOpen(false);
      refetch();
    } catch {
      Swal.fire("Error", "Failed to create event", "error");
    }
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset_key);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData,
      {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          setUploadProgress(percent);
        },
      }
    );

    setNewEvent((prev) => ({ ...prev, image: res.data.secure_url }));
  } catch (error) {
    console.error("Image upload failed", error);
    alert("Image upload failed. Please try again.");
  }
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
          <ShieldCheck size={20} /> All Events
        </h2>
        <button
          className="btn btn-sm bg-green-600 text-white"
          onClick={() => {
            setIsCreateModalOpen(true);
            setNewEvent({
              title: "",
              description: "",
              category: "",
              date: "",
              time: "",
              ticketPrice: 0,
              ticketsTotal: 0,
              image: "",
              venueId: "",
            });
          }}
        >
          + Create Event
        </button>
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
                    className="btn btn-sm bg-yellow-500 text-white"
                    onClick={() => openEditModal(event)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    title="Delete event"
                    className="btn btn-sm bg-red-600 text-white"
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

      {/* Edit Event Modal */}
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
              className="input input-bordered"
              placeholder="Title"
              value={editingEvent.title}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, title: e.target.value })
              }
            />
            <textarea
              className="textarea textarea-bordered"
              placeholder="Description"
              value={editingEvent.description}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, description: e.target.value })
              }
            />
            <input
              className="input input-bordered"
              placeholder="Category"
              value={editingEvent.category}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, category: e.target.value })
              }
            />
            <input
              className="input input-bordered"
              type="date"
              placeholder="Select Date"
              title="Select event date"
              value={editingEvent.date}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, date: e.target.value })
              }
            />

            <input
              className="input input-bordered"
              type="time"
              placeholder="Select Time"
              title="Select event time"
              value={editingEvent.time}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, time: e.target.value })
              }
            />

            <input
              className="input input-bordered"
              placeholder="Image URL"
              value={editingEvent.image}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, image: e.target.value })
              }
            />
            <input
              className="input input-bordered"
              placeholder="Venue ID"
              value={editingEvent.venueId}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, venueId: e.target.value })
              }
            />
                    {/* Ticket Price Field */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-gray-700">Ticket Price</span>
            </div>
            <input
              type="number"
              className="input input-bordered"
              placeholder="Enter ticket price"
              value={newEvent.ticketPrice}
              onChange={(e) =>
                setNewEvent({ ...newEvent, ticketPrice: parseInt(e.target.value) || 0 })
              }
            />
          </label>

          {/* Tickets Total Field */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-gray-700">Tickets Total</span>
            </div>
            <input
              type="number"
              className="input input-bordered"
              placeholder="Enter total number of tickets"
              value={newEvent.ticketsTotal}
              onChange={(e) =>
                setNewEvent({ ...newEvent, ticketsTotal: parseInt(e.target.value) || 0 })
              }
            />
          </label>


            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn bg-green-600 text-white"
                onClick={handleUpdateEvent}
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
       className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-6 mt-20 outline-none overflow-y-auto max-h-[90vh]"
  overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
>
        <h3 className="text-lg font-bold mb-4 text-green-700">Create Event</h3>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleCreateEvent}
        >
          <input
            className="input input-bordered"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <input
            className="input input-bordered"
            placeholder="Category"
            value={newEvent.category}
            onChange={(e) =>
              setNewEvent({ ...newEvent, category: e.target.value })
            }
          />
                      <input
              className="input input-bordered"
              type="date"
              placeholder="Select Date"
              title="Select event date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />

            <input
              className="input input-bordered"
              type="time"
              placeholder="Select Time"
              title="Select event time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            />

          <input
            className="input input-bordered"
            type="number"
            placeholder="Ticket Price"
            value={newEvent.ticketPrice}
            onChange={(e) =>
              setNewEvent({ ...newEvent, ticketPrice: +e.target.value })
            }
          />
          <input
            className="input input-bordered"
            type="number"
            placeholder="Tickets Total"
            value={newEvent.ticketsTotal}
            onChange={(e) =>
              setNewEvent({ ...newEvent, ticketsTotal: +e.target.value })
            }
          />
         <div className="md:col-span-2">
  <label htmlFor="eventImage" className="block text-sm font-medium text-gray-700">
    Event Image
  </label>
  <input
    id="eventImage"
    type="file"
    accept="image/*"
    className="file-input w-full mt-1"
    onChange={handleImageUpload}
    title="Upload event image"
  />
  {uploadProgress > 0 && uploadProgress < 100 && (
    <p className="text-xs text-gray-600 mt-1">{uploadProgress}% uploading...</p>
  )}
  {newEvent.image && (
    <img
      src={newEvent.image}
      alt="Event Preview"
      className="w-full max-w-xs h-auto mt-2 rounded shadow object-contain"
    />
  )}
</div>


          <input
            className="input input-bordered md:col-span-2"
            placeholder="Venue ID"
            value={newEvent.venueId}
            onChange={(e) => setNewEvent({ ...newEvent, venueId: e.target.value })}
          />
          <textarea
            className="textarea textarea-bordered md:col-span-2"
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <div className="md:col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn bg-green-600 text-white">
              Save Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllEvents;
