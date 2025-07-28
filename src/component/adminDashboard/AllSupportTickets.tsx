import React, { useState } from "react";
import {
  useGetSupportTicketsQuery,
  useUpdateSupportTicketMutation,
  useDeleteSupportTicketMutation,
} from "../../features/api/supportTicketApi";
import Swal from "sweetalert2";
import { ShieldQuestion, Loader2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const DescriptionModal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
        <h3 className="text-lg font-bold mb-4 text-green-700">Full Description</h3>
        <p className="text-gray-800">{content}</p>
        <div className="flex justify-end mt-4">
          <button className="btn btn-sm btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AllSupportTickets: React.FC = () => {
  const { data: tickets, isLoading, error, refetch } = useGetSupportTicketsQuery();
  const [updateTicket] = useUpdateSupportTicketMutation();
  const [deleteTicket] = useDeleteSupportTicketMutation();
  const [activeDescription, setActiveDescription] = useState<string | null>(null);

  const handleMarkAsResolved = async (ticketId: number) => {
    try {
      await updateTicket({ ticket_id: ticketId, payload: { status: "Resolved" } }).unwrap();
      Swal.fire("Marked as Resolved", "Ticket has been resolved", "success");
      refetch();
    } catch {
      Swal.fire("Error", "Failed to update ticket status", "error");
    }
  };

  const handleDeleteTicket = async (ticketId: number) => {
    const result = await Swal.fire({
      title: "Delete ticket?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteTicket(ticketId).unwrap();
        Swal.fire("Deleted", "Ticket removed successfully", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Failed to delete ticket", "error");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
          <ShieldQuestion size={20} /> Support Tickets
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4">
          <p className="font-semibold">Failed to load support tickets.</p>
        </div>
      ) : (
        <>
          <table className="w-full table-auto text-sm border">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="p-2">Subject</th>
                <th className="p-2">Status</th>
                <th className="p-2">Description</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets?.map((ticket: any) => (
                <tr key={ticket.ticketId} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-bold text-gray-800">{ticket.subject}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      ticket.status === "Resolved" ? "bg-gray-600" : "bg-yellow-500"
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-2 text-gray-700">
                    {ticket.description.length > 40 ? (
                      <>
                        {ticket.description.substring(0, 40)}...
                        <button
                          className="text-blue-600 ml-1 underline text-xs"
                          onClick={() => setActiveDescription(ticket.description)}
                        >
                          View more
                        </button>
                      </>
                    ) : ticket.description}
                  </td>
                  <td className="p-2 space-x-2">
                    {ticket.status === "Open" && (
                      <button
                        className="btn btn-sm bg-yellow-600 text-white"
                        onClick={() => handleMarkAsResolved(ticket.ticketId)}
                      >
                        Mark as Resolved
                      </button>
                    )}
                    <button
                      className="btn btn-sm bg-red-600 text-white"
                      onClick={() => handleDeleteTicket(ticket.ticketId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <DescriptionModal
            isOpen={!!activeDescription}
            onClose={() => setActiveDescription(null)}
            content={activeDescription || ""}
          />
        </>
      )}
    </div>
  );
};

export default AllSupportTickets;
