import { useGetUserPaymentsQuery } from "../../features/api/paymentsApi";
import { CreditCard } from "lucide-react";


export default function MyPayments() {
  const { data, isLoading, isError, error } = useGetUserPaymentsQuery();

  if (isLoading)
    return <p className="py-6 text-center text-gray-500">Loading your payments...</p>;
if (isError) {
  let errorMessage = "Something went wrong while fetching your payments.";

  if ("status" in error && error.status === 404) {
    errorMessage = "No payments found for your bookings.";
  }

  return <p className="py-6 text-center text-red-500">{errorMessage}</p>;
}


  if (!data || data.length === 0)
    return (
      <p className="py-6 text-center text-gray-500">
        You haven’t made any payments yet. Once you book and pay, they’ll show up here!
      </p>
    );

  return (
    <section className="max-w-4xl mx-auto space-y-6 px-4 py-6">
    <header className="text-center sm:text-left">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
           <CreditCard size={18}/> My Payment History
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Track your transactions
      </p>
    </header>
      {data.map((payment) => (
        <div
          key={payment.paymentId}
          className="border rounded-md p-4 sm:p-6 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-300 dark:border-gray-700"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-purple-600">
            {payment.event?.title?? "Unknown Event"}
          </h3>

          <p className="text-sm sm:text-base text-gray-600 mt-1 dark:text-gray-300">
            Amount: <span className="font-medium">KES {payment.amount}</span>
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 text-sm text-gray-500 dark:text-gray-400 gap-1 sm:gap-0">
  <span>
    Status: <span className="font-medium">{payment.paymentStatus}</span>
  </span>

  <span>
    {new Date(payment.paymentDate).toLocaleString("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    })}
  </span>
</div>


          <div className="text-xs sm:text-sm text-gray-400 mt-1">
            Method: {payment.paymentMethod ?? "N/A"} — TX:{" "}
            {payment.transactionId ?? "—"}
          </div>
        </div>
      ))}
    </section>
  );
}
