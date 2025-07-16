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
import AdminDashboard from "./pages/AdminDashboard";
import Events from "./pages/Event";
import AllUsers from "./component/adminDashboard/AllUsers";
import AllEvents from "./component/adminDashboard/AllEvents";
import AllVenues from "./component/adminDashboard/AllVenues";
import AllBookings from "./component/adminDashboard/AllBookings";
import AllPayments from "./component/adminDashboard/AllPayments";
// import Analytics from "./component/adminDashboard/Analytics";
import AllSupportTickets from "./component/adminDashboard/AllSupportTickets";
import AdminLayout from "./component/dashboardLayout/AdminLayout";

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
  element: <UserLayout />, 
  errorElement: <Error />,
  children: [
    { index: true, element: <UserDashboard /> },
    { path: "bookings", element: <MyBookings /> },
    { path: "payments", element: <MyPayments /> },
    { path: "support", element: <SupportTickets /> },
    { path: "profile", element: <UserProfile /> },
  ],
},
  {
    path: "/dashboard/admin",
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <AdminDashboard /> }, 
      { path: "allusers", element: <AllUsers /> },
      { path: "allevents", element: <AllEvents /> },
      { path: "allvenues", element: <AllVenues /> },
      { path: "allbookings", element: <AllBookings /> },
      { path: "allpayments", element: <AllPayments /> },
      // { path: "analytics", element: <Analytics /> },
      { path: "allsupport", element: <AllSupportTickets /> },
    ],
  },

  {
    path: "/events",
    element: <Events />,
    errorElement: <Error />,
  },
  {
    path: "/events/:eventId",
    element: <Events />,
    errorElement: <Error />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
