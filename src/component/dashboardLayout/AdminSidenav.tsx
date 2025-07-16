import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Ticket,
  BarChart3,
  MapPin,
  LifeBuoy,
  CreditCard,
} from "lucide-react";

const AdminSidenav: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-6 hidden md:block h-screen">
      <h2 className="text-xl font-bold mb-6 text-green-700">Admin Panel</h2>
      <nav className="space-y-4">
        <NavLink to="/dashboard/admin/allusers" className="flex items-center gap-2 text-gray-700 hover:text-green-700">
          <Users size={18} /> Users
        </NavLink>
        <NavLink to="/dashboard/admin/allevents" className="flex items-center gap-2 text-gray-700 hover:text-green-700">
          <Ticket size={18} /> Events
        </NavLink>
        <NavLink to="/dashboard/admin/allvenues" className="flex items-center gap-2 text-gray-700 hover:text-green-700">
          <MapPin size={18} /> Venues
        </NavLink>
        <NavLink to="/dashboard/admin/allbookings" className="flex items-center gap-2 text-gray-700 hover:text-green-700">
          <ShieldCheck size={18} /> Bookings
        </NavLink>
        <NavLink to="/dashboard/admin/allpayments" className="flex items-center gap-2 text-gray-700 hover:text-green-700">
          <CreditCard size={18} /> Payments
        </NavLink>
        <NavLink to="/dashboard/admin/analytics" className="flex items-center gap-2 text-gray-700 hover:text-green-700">
          <BarChart3 size={18} /> Analytics
        </NavLink>
        <NavLink to="/dashboard/admin/allsupport" className="flex items-center gap-2 text-gray-700 hover:text-green-700">
          <LifeBuoy size={18} /> Support
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidenav;
