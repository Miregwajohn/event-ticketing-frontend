import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Error } from "./pages/Error";
import  UserDashboard  from "./pages/UserDashboard";
import UserLayout from "./component/dashboardLayout/UserLayout";
import MyBookings from "./component/userDashboard/MyBookings";
import MyPayments from "./component/userDashboard/MyPayments";
import SupportTickets from "./component/userDashboard/SupportTickets";
import UserProfile from "./component/userDashboard/UserProfile";
import BrowseEvents from "./component/userDashboard/BrowseEvents";
// import VenueBooking from "./component/userDashboard/VenueBooking"
import ProtectedRoute from "./component/common/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import EventsList from "./pages/EventsList";
import EventDetail from "./pages/EventDetail";
import AllUsers from "./component/adminDashboard/AllUsers";
import AllEvents from "./component/adminDashboard/AllEvents";
import AllVenues from "./component/adminDashboard/AllVenues";
import AllBookings from "./component/adminDashboard/AllBookings";
import AllPayments from "./component/adminDashboard/AllPayments";
import Analytics from "./component/adminDashboard/Analytics";
import AllSupportTickets from "./component/adminDashboard/AllSupportTickets";
import AdminUserProfile from "./component/adminDashboard/AdminUserProfile";
import AdminLayout from "./component/dashboardLayout/AdminLayout";
import PaymentStep from "./pages/PaymentStep";
import SalesReport from "./component/adminDashboard/SalesReport";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <Error />,
  },
 {
  path: "/dashboard/me",
  element: (
    <ProtectedRoute>
      <UserLayout />
    </ProtectedRoute>
  ),
  errorElement: <Error />,
  children: [
    { index: true, element: <UserDashboard /> },
    { path: "bookings", element: <MyBookings /> },
    { path: "payments", element: <MyPayments /> },
    { path: "support", element: <SupportTickets /> },
    { path: "profile", element: <UserProfile /> },
    { path: "browseevents", element: <BrowseEvents /> },
    // { path: "bookings", element: <VenueBooking /> },
  ],
},
{
  path: "/dashboard/admin",
  element: (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
  errorElement: <Error />,
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: "allusers", element: <AllUsers /> },
    { path: "allevents", element: <AllEvents /> },
    { path: "allvenues", element: <AllVenues /> },
    { path: "allbookings", element: <AllBookings /> },
    { path: "allpayments", element: <AllPayments /> },
    { path: "analytics", element: <Analytics /> },
    { path: "allsupport", element: <AllSupportTickets /> },
    { path: "adminprofile",element: <AdminUserProfile /> },
     { path: "sales-report", element: < SalesReport /> },
  ],
},

{
  path: "/events",
  element: <EventsList />,
  errorElement: <Error />,
},
 {
    path: "/about",
    element: <About />,
    errorElement: <Error />,
  },
   {
    path: "/contact",
    element: <Contact />,
    errorElement: <Error />,
  },
{
  path: "/events/:slug",
  element: <EventDetail />,
  errorElement: <Error />,
},
    {
    path: "/payment/:bookingId",
    element: < PaymentStep/>,
    errorElement: <Error />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
