import { useState } from "react";
import {
  useGetUserSupportTicketsQuery,
  useCreateSupportTicketMutation,
} from "../../features/api/supportTicketApi";
import { LifeBuoy } from "lucide-react";
import { Dialog } from "@headlessui/react";
import Swal from "sweetalert2";

export default function SupportTickets() {
  const { data, isLoading, isError, refetch } = useGetUserSupportTicketsQuery();
  const [createTicket, { isLoading: sending }] = useCreateSupportTicketMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!subject.trim() || !message.trim()) {
    Swal.fire("Missing Fields", "Please fill in both subject and message", "warning");
    return;
  }

  try {
    await createTicket({ subject, description: message }).unwrap();
    Swal.fire("Ticket Submitted", "Your support ticket has been sent successfully", "success");
    setSubject(""); setMessage("");
    setIsOpen(false);
    refetch();
  } catch (err) {
    Swal.fire("Submission Failed", "Something went wrong. Please try again.", "error");
  }
};


  return (
    <section className="max-w-4xl mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <LifeBuoy size={20} /> Support Tickets
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and submit support requests
          </p>
        </div>
        <button onClick={() => setIsOpen(true)} className="btn btn-primary">
          Create New Ticket
        </button>
      </header>

      {/* Modal Form */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded max-w-md w-full shadow-lg space-y-4">
          <Dialog.Title className="text-lg font-bold">Submit a Support Ticket</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Subject"
              className="input input-bordered w-full"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="textarea textarea-bordered w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn btn-outline" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={sending}>
                {sending ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>

      {/* Ticket List */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading your support tickets...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load support tickets.</p>
      ) : !data || data.length === 0 ? (
        <p className="text-center text-gray-500">No support tickets submitted yet.</p>
      ) : (
        data.map((ticket) => (
          <div
            key={ticket.ticketId}
            className="border rounded-md p-4 bg-white dark:bg-gray-900 shadow-sm dark:border-gray-700 space-y-2"
          >
            <h3 className="text-lg font-semibold text-purple-600">{ticket.subject}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{ticket.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Status: <span className="font-medium">{ticket.status}</span></span>
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>

            {/* 👇 Show admin response if available */}
            {ticket.response && (
              <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p className="text-sm font-medium text-blue-600">Admin Response:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{ticket.response}</p>
              </div>
            )}
          </div>
        ))
      )}
    </section>
  );
}
