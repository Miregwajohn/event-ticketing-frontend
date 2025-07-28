import { FaUsers, FaDollarSign } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ShieldCheck, Ticket } from "lucide-react";
import { PuffLoader } from "react-spinners";

import { useGetBookingsQuery } from "../../features/api/bookingApi";
import { useGetPaymentsQuery } from "../../features/api/paymentsApi";
import { useGetEventsQuery } from "../../features/api/eventsApi";

//  Motion variants with correct typing
const cardVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
  tap: {
    scale: 0.95,
  },
};

//  Pie chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//  Optional: Type definitions
type Booking = {
  bookingStatus: string;
  user?: { email?: string };
};

type Payment = {
  paymentStatus: string;
  amount: number;
};

export const Analytics = () => {
  const { data: bookings = [], isLoading: bookingsLoading } = useGetBookingsQuery();
  const { data: payments = [], isLoading: paymentsLoading } = useGetPaymentsQuery();
  const { data: events = [], isLoading: eventsLoading } = useGetEventsQuery({});

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b: Booking) => b.bookingStatus === "Confirmed").length;

  const confirmedPayments = payments.filter((p: Payment) => p.paymentStatus === "Confirmed");
  const pendingPayments = payments.filter((p: Payment) => p.paymentStatus === "Pending");
  const failedPayments = payments.filter((p: Payment) => p.paymentStatus === "Failed");

  const totalRevenue = confirmedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const pieData = [
    { name: "Confirmed", value: confirmedPayments.length },
    { name: "Pending", value: pendingPayments.length },
    { name: "Failed", value: failedPayments.length },
  ];

  const lineData = [
    { name: "Jan", value: 5200 },
    { name: "Feb", value: 6700 },
    { name: "Mar", value: 8300 },
    { name: "Apr", value: 4100 },
    { name: "May", value: 7500 },
  ];

  const uniqueEmails = bookings
    .map((b: Booking) => b.user?.email)
    .filter((email): email is string => Boolean(email));
  const userCount = new Set(uniqueEmails).size;

  return (
    <>
      <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Bookings */}
        <motion.div
          className="card bg-green-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center"
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {bookingsLoading ? (
            <PuffLoader color="#fff" />
          ) : (
            <>
              <ShieldCheck size={40} />
              <h2 className="text-2xl font-bold mt-4">Bookings</h2>
              <p className="text-lg mt-2">{totalBookings}</p>
              <p className="text-xs mt-1">Confirmed: {confirmedBookings}</p>
            </>
          )}
        </motion.div>

        {/* Events */}
        <motion.div
          className="card bg-blue-600 text-white p-6 rounded-lg shadow-lg flex flex-col items-center"
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {eventsLoading ? (
            <PuffLoader color="#fff" />
          ) : (
            <>
              <Ticket size={40} />
              <h2 className="text-2xl font-bold mt-4">Events</h2>
              <p className="text-lg mt-2">{events.length}</p>
            </>
          )}
        </motion.div>

        {/* Users */}
        <motion.div
          className="card bg-orange-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center"
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {bookingsLoading ? (
            <PuffLoader color="#fff" />
          ) : (
            <>
              <FaUsers size={40} />
              <h2 className="text-2xl font-bold mt-4">Users</h2>
              <p className="text-lg mt-2">{userCount}</p>
            </>
          )}
        </motion.div>

        {/* Revenue */}
        <motion.div
          className="card bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center"
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {paymentsLoading ? (
            <PuffLoader color="#fff" />
          ) : (
            <>
              <FaDollarSign size={40} />
              <h2 className="text-2xl font-bold mt-4">Revenue</h2>
              <p className="text-lg mt-2">Ksh {totalRevenue.toLocaleString()}</p>
            </>
          )}
        </motion.div>
      </div>

      {/* Charts */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Analytics Charts</h2>
        <div className="flex flex-col lg:flex-row items-center justify-around gap-6">
          {/* Pie Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Payment Status Breakdown</h3>
            {paymentsLoading ? (
              <div className="flex justify-center">
                <PuffLoader color="#8884d8" />
              </div>
            ) : (
              <PieChart width={400} height={400}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </div>

          {/* Line Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Monthly Revenue</h3>
            <LineChart
              width={500}
              height={300}
              data={lineData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;

