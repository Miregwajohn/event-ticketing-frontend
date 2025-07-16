import React from "react";
import { useGetPaymentsQuery, useDeletePaymentMutation, useUpdatePaymentMutation } from "../../features/api/paymentsApi";
import Swal from "sweetalert2";
import { Loader2, CreditCard } from "lucide-react";

const AllPayments: React.FC = () => {
  const { data: payments, isLoading, error, refetch } = useGetPaymentsQuery();
  const [deletePayment] = useDeletePaymentMutation();
  const [updatePayment] = useUpdatePaymentMutation();

  const handleConfirmPayment = async (paymentId: number) => {
    try {
      await updatePayment({ payment_id: paymentId, payload: { paymentStatus: "Confirmed" } }).unwrap();
      Swal.fire("Payment Confirmed", "", "success");
      refetch();
    } catch {
      Swal.fire("Error", "Could not confirm payment", "error");
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    const result = await Swal.fire({
      title: "Delete payment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await deletePayment(paymentId).unwrap();
        Swal.fire("Deleted", "Payment removed", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Could not delete payment", "error");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
          <CreditCard size={20} /> All Payments
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-center font-semibold p-4">
          Failed to fetch payments.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto border">
            <thead className="bg-purple-100 text-gray-700">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Event</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Method</th>
                <th className="p-2">Status</th>
                <th className="p-2">Transaction</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((p: any) => (
                <tr key={p.paymentId} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-gray-900 font-semibold">
                    {p.booking?.user?.firstname} {p.booking?.user?.lastname}
                    <br />
                    <span className="text-xs text-green-800 font-semibold">{p.booking?.user?.email}</span>
                  </td>
                  <td className="p-2 text-gray-900 font-semibold">
                    {p.booking?.event?.title}<br />
                    <span className="text-xs text-green-800 font-semibold">{p.booking?.event?.date}</span>
                  </td>
                  <td className="p-2 text-slate-800">Ksh {p.amount.toLocaleString()}</td>
                  <td className="p-2 text-xs text-blue-800 font-medium">{p.paymentMethod || "—"}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      p.paymentStatus === "Confirmed"
                        ? "bg-green-600"
                        : p.paymentStatus === "Failed"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}>
                      {p.paymentStatus}
                    </span>
                    {p.paymentStatus === "Pending" && (
                      <button
                        className="mt-1 btn btn-xs bg-green-700 text-white"
                        onClick={() => handleConfirmPayment(p.paymentId)}
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                  <td className="p-2 text-xs text-indigo-700 font-bold">{p.transactionId || "—"}</td>
                  <td className="p-2 space-y-1">
                    <button
                      className="btn btn-sm bg-red-600 text-white"
                      onClick={() => handleDeletePayment(p.paymentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllPayments;
