import React, { useState } from "react";
import {
  useGetVenuesQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
} from "../../features/api/venueApi";
import { Building2, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import type { Venue } from "../../types/types";

Modal.setAppElement("#root");

const AllVenues: React.FC = () => {
  const { data: venues, isLoading, error, refetch } = useGetVenuesQuery();
  const [createVenue] = useCreateVenueMutation();
  const [updateVenue] = useUpdateVenueMutation();
  const [deleteVenue] = useDeleteVenueMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // align newVenue fields with Venue type
  const [newVenue, setNewVenue] = useState<{
    name: string;
    address: string;
    capacity: number;
  }>({ name: "", address: "", capacity: 0 });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // use Partial<Venue> so fields can be edited before save
  const [editingVenue, setEditingVenue] = useState<Partial<Venue> | null>(null);

  // Open/close handlers
  const openCreateModal = () => {
    setNewVenue({ name: "", address: "", capacity: 0 });
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (venue: Venue) => {
    setEditingVenue(venue);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditingVenue(null);
    setIsEditModalOpen(false);
  };

  // Create venue
  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newVenue.name.trim();
    const trimmedAddress = newVenue.address.trim();
    const validCapacity = Number(newVenue.capacity);

    if (!trimmedName || !trimmedAddress || validCapacity <= 0) {
      Swal.fire("Validation", "All fields are required", "warning");
      return;
    }

    try {
      await createVenue({
        name: trimmedName,
        address: trimmedAddress,
        capacity: validCapacity,
      }).unwrap();
      Swal.fire("Success", "Venue created successfully", "success");
      closeCreateModal();
      refetch();
    } catch {
      Swal.fire("Error", "Failed to create venue", "error");
    }
  };

  // Update venue
  const handleUpdateVenue = async () => {
    if (!editingVenue || !editingVenue.venueId) return; 
    const { venueId, name, address, capacity } = editingVenue;
    try {
      await updateVenue({
          venue_id: venueId, 
        payload: { name, address, capacity },
      }).unwrap();
      Swal.fire("Updated", "Venue updated successfully", "success");
      closeEditModal();
      refetch();
    } catch {
      Swal.fire("Error", "Failed to update venue", "error");
    }
  };

  // Delete venue
  const handleDeleteVenue = async (venueId: number) => {
    const result = await Swal.fire({
      title: "Delete Venue?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      try {
        await deleteVenue(venueId).unwrap();
        Swal.fire("Deleted", "Venue has been removed", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Failed to delete venue", "error");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header with Create button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
          <Building2 size={20} /> All Venues
        </h2>
        <button
          type="button"
          className="btn btn-sm bg-blue-600 text-white flex items-center gap-1"
          onClick={openCreateModal}
        >
          <Plus size={16} /> Create Venue
        </button>
      </div>

      {/* Table or loading/error */}
      {isLoading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">Failed to load venues.</p>
      ) : (
        <table className="table text-sm border border-gray-200">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues?.map((venue: Venue) => (
              <tr
                key={venue.venueId}
                className="border-b bg-white hover:bg-gray-50 transition-colors"
              >
                <td className="p-2 text-gray-900 font-semibold">{venue.name}</td>
                <td className="p-2 text-slate-800">{venue.address}</td>
                <td className="p-2 text-indigo-700 font-bold">{venue.capacity}</td>
                <td className="p-2 flex gap-2 items-center">
                  <button
                    type="button"
                    className="btn btn-sm bg-yellow-500 text-white focus:outline-none"
                    title="Edit venue"
                    onClick={() => openEditModal(venue)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm bg-red-600 text-white focus:outline-none"
                    title="Delete venue"
                   onClick={() => handleDeleteVenue(Number(venue.venueId))}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create Venue Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={closeCreateModal}
        className="bg-white rounded-lg shadow-lg max-w-lg mx-auto p-6 mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold mb-4 text-blue-700">Add New Venue</h3>
        <form className="grid grid-cols-1 gap-3" onSubmit={handleCreateVenue}>
          {/* Name Field */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-gray-700">Name</span>
            </div>
            <input
              autoFocus
              className="input input-bordered w-full"
              placeholder="Enter venue name"
              value={newVenue.name}
              onChange={(e) =>
                setNewVenue({ ...newVenue, name: e.target.value })
              }
            />
          </label>

          {/* Location Field */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-gray-700">
                Address
              </span>
            </div>
            <textarea
              className="textarea text-black-900 font-medium"
              placeholder="Enter venue address"
              rows={3}
              value={newVenue.address}
              onChange={(e) =>
                setNewVenue({ ...newVenue, address: e.target.value })
              }
            />
          </label>

          {/* Capacity Field */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-gray-700">
                Capacity
              </span>
            </div>
            <input
              type="number"
              className="input input-bordered"
              placeholder="Enter venue capacity"
              value={newVenue.capacity}
              onChange={(e) =>
                setNewVenue({
                  ...newVenue,
                  capacity: parseInt(e.target.value) || 0,
                })
              }
            />
          </label>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={closeCreateModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn bg-blue-600 text-white">
              Save Venue
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Venue Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        className="bg-white rounded-lg shadow-lg max-w-lg mx-auto p-6 mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <h3 className="text-lg font-bold mb-4 text-blue-700">Edit Venue</h3>
        {editingVenue && (
          <form className="grid grid-cols-1 gap-3">
            {/* Name Field */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold text-gray-700">
                  Name
                </span>
              </div>
              <input
                className="input input-bordered w-full"
                placeholder="Enter venue name"
                value={editingVenue.name || ""}
                onChange={(e) =>
                  setEditingVenue({
                    ...editingVenue,
                    name: e.target.value,
                  })
                }
              />
            </label>

            {/* Location Field */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold text-gray-700">
                  Address
                </span>
              </div>
              <textarea
                className="textarea textarea-bordered text-black-200 font-medium"
                placeholder="Enter venue address"
                rows={3}
                value={editingVenue.address || ""}
                onChange={(e) =>
                  setEditingVenue({
                    ...editingVenue,
                    address: e.target.value,
                  })
                }
              />
            </label>

            {/* Capacity Field */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-semibold text-gray-700">
                  Capacity
                </span>
              </div>
              <input
                type="number"
                className="input input-bordered"
                placeholder="Enter venue capacity"
                value={editingVenue.capacity ?? ""}
                onChange={(e) =>
                  setEditingVenue({
                    ...editingVenue,
                    capacity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </label>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn bg-blue-600 text-white"
                onClick={handleUpdateVenue}
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

export default AllVenues;
