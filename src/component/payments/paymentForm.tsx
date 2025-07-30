// import React, { useState } from "react";
// import { useInitiateStkPushMutation } from "../../features/api/paymentsApi";

// interface Props {
//   bookingId: number;
//   amount: number;
// }

// const PaymentForm: React.FC<Props> = ({ bookingId, amount }) => {
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");
//   const [initiateStkPush, { isLoading }] = useInitiateStkPushMutation();

//   // This function is only called when user submits the form
//   const handlePayment = async (e: React.FormEvent) => {
//     e.preventDefault(); // prevent page reload
//     setMessage(""); // clear previous message

//     try {
//       const response = await initiateStkPush({
//         phone,
//         bookingId,
//         amount,
//       }).unwrap();

//       if (response?.CustomerMessage) {
//         setMessage(response.CustomerMessage);
//       } else {
//         setMessage("✅ STK push initiated. Check your phone.");
//       }
//     } catch (error: any) {
//       console.error("STK push failed:", error);
//       setMessage("❌ Payment failed. Try again.");
//     }
//   };

//   return (
//     <form onSubmit={handlePayment} className="space-y-4 text-left">
//       <div>
//         <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
//           M-Pesa Phone Number
//         </label>
//         <input
//           id="phone"
//           type="tel"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           placeholder="2547XXXXXXXX"
//           className="w-full border border-gray-300 px-4 py-2 rounded"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading || phone.trim() === ""}
//         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
//       >
//         {isLoading ? "Processing..." : "Pay with M-PESA"}
//       </button>

//       {message && (
//         <p className="mt-2 text-sm text-center text-blue-700">{message}</p>
//       )}
//     </form>
//   );
// };

// export default PaymentForm;
