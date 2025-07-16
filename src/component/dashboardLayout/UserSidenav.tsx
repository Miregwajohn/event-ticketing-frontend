import React from "react";
import { NavLink } from "react-router-dom";
import {
  Ticket,
  ShieldCheck,
  CreditCard,
  LifeBuoy,
  User,
} from "lucide-react";

const UserSidenav: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-6 hidden md:block h-screen">
      <h2 className="text-xl font-bold mb-6 text-purple-700">My Dashboard</h2>
      <nav className="space-y-4">
        <NavLink to="/dashboard/me/bookings" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
          <ShieldCheck size={18} /> My Bookings
        </NavLink>
        <NavLink to="/dashboard/me/payments" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
          <CreditCard size={18} /> Payments
        </NavLink>
        <NavLink to="/dashboard/me/support" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
          <LifeBuoy size={18} /> Support Tickets
        </NavLink>
        <NavLink to="/dashboard/me/profile" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
          <User size={18} /> My Profile
        </NavLink>
        <NavLink to="/events" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
          <Ticket size={18} /> Browse Events
        </NavLink>
      </nav>
    </aside>
  );
};

export default UserSidenav;
