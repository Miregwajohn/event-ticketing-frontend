import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import Navbar from "../component/common/Navbar";
import Footer from "../component/common/Footer";
import { useEffect, useState } from "react";

type PaymentForm = {
  phone: string;
};

const getBaseUrl = () =>
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://event-ticketing-backend-b2b9.onrender.com/api";

const PaymentStep = () => {
  const { register, handleSubmit, reset } = useForm<PaymentForm>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"Pending" | "Confirmed" | "Failed" | null>(null);

  const booking = state?.booking;

  useEffect(() => {
    if (!booking || !isAuthenticated) {
      navigate("/dashboard/me/bookings");
    }
  }, [booking, isAuthenticated, navigate]);

  const {
    bookingId,
    eventTitle,
    eventCategory,
    quantity,
    totalAmount,
    ticketPrice,
    location,
    eventDate,
    eventTime,
  } = booking || {};

  const onSubmit = async (data: PaymentForm) => {
    if (!bookingId || !totalAmount) {
      toast.error("Missing booking data — unable to initiate payment.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${getBaseUrl()}/mpesa/stkpush`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          amount: totalAmount,
          phone: data.phone,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("STK Push sent successfully! Check your phone.");
        reset();
        setPolling(true);
        setPaymentStatus("Pending");
      } else {
        toast.error(result.message || " Payment initiation failed.");
      }
    } catch (err) {
      console.error("STK push error:", err);
      toast.error(" Something went wrong while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  // Polling for payment confirmation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (polling && booking?.bookingId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(
            `${getBaseUrl()}/mpesa/status?bookingId=${booking.bookingId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const result = await res.json();

          if (result.status === "Success") {
            clearInterval(interval);
            toast.success("🎉 Payment confirmed!");
            setPaymentStatus("Confirmed");
            setPolling(false);
            setTimeout(() => navigate("/dashboard/me/bookings"), 3000);
          } else if (result.status === "Failed") {
            clearInterval(interval);
            toast.error(" Payment failed.");
            setPaymentStatus("Failed");
            setPolling(false);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [polling, booking?.bookingId, navigate, token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 py-10">
        <div className="max-w-4xl mx-auto bg-base-300 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-6">🎟️ Complete Your Payment</h1>

          {/* Event Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-base-content">
            <div>
              <p><strong>Event:</strong> {eventTitle}</p>
              <p><strong>Category:</strong> {eventCategory}</p>
              <p><strong>Location:</strong> {location}</p>
              <p><strong>Date & Time:</strong> {eventDate} at {eventTime}</p>
              <p><strong>Booking ID:</strong> #{bookingId}</p>
            </div>
            <div>
              <p><strong>Tickets:</strong> {quantity} × KES {ticketPrice}</p>
              <p className="text-xl font-bold text-success mt-2">Total: KES {totalAmount}</p>
              <p className="text-sm text-gray-500 mt-1">Your tickets will be confirmed after successful payment.</p>
            </div>
          </div>

          {/* M-Pesa Payment Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              M-Pesa Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="2547XXXXXXXX"
              className="input input-bordered w-full"
              required
            />
            <button type="submit" disabled={loading || polling} className="btn btn-primary w-full">
              {loading ? "Sending STK Push..." : "Pay with M-Pesa"}
            </button>
          </form>

          {/* Payment Status */}
          <div className="mt-6 text-sm text-gray-500">
            {paymentStatus === "Pending" && (
              <p className="text-info"> Waiting for M-Pesa confirmation…</p>
            )}
            {paymentStatus === "Confirmed" && (
              <p className="text-success"> Payment confirmed. Redirecting…</p>
            )}
            {paymentStatus === "Failed" && (
              <p className="text-error"> Payment failed. Try again or contact support.</p>
            )}
             Secure STK push via Safaricom. No extra charges. Enter your M-Pesa PIN when prompted.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentStep;
