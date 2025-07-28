// src/pages/PaymentStep.tsx
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../component/common/Navbar";
import Footer from "../component/common/Footer";
import PaymentForm from "../component/payments/paymentForm";   
import { useGetBookingByIdQuery } from "../features/api/bookingApi";

const PaymentStep: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  const {
    data: booking,
    isLoading,
    error,
  } = useGetBookingByIdQuery(Number(bookingId));

  const eventName = booking?.event?.title || "your selected event";

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Complete Payment</h2>

          {isLoading && <p>Loading event details...</p>}
          {error && <p className="text-red-600">Failed to load booking details.</p>}

          {!isLoading && !error && booking && (
            <>
              <p className="text-gray-700 mb-6">
                Your booking for <strong>{eventName}</strong> was successful. <br />
                Please enter your phone number to confirm payment.
              </p>

              {/* ✅ Pass both bookingId and amount */}
              <PaymentForm
                bookingId={Number(bookingId)}
                amount={booking.totalAmount}
              />
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentStep;
