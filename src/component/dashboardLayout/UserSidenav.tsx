import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Ticket,
  ShieldCheck,
  CreditCard,
  LifeBuoy,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSidenav: React.FC<Props> = ({ sidebarOpen, setSidebarOpen }) => {
  const [accountOpen, setAccountOpen] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
     <aside
  className={`fixed md:static top-0 left-0 z-40 bg-white shadow-md w-64 p-6 transition-transform duration-300 
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  md:translate-x-0 h-full md:h-auto md:min-h-full overflow-y-auto`}
>

        <h2 className="text-xl font-bold mb-6 text-purple-700">
          <NavLink to="/dashboard/me" className="hover:text-purple-700">
            My Dashboard
          </NavLink>
        </h2>

        {/* Section: My Account */}
        <div>
          <button
            onClick={() => setAccountOpen(!accountOpen)}
            className="flex justify-between w-full items-center text-sm font-semibold text-gray-600 mb-2"
          >
            My Account {accountOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {accountOpen && (
            <nav className="space-y-3 pl-2 mb-4">
              <NavLink
                to="/dashboard/me/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-700"
              >
                <User size={18} /> My Profile
              </NavLink>
              <NavLink
                to="/dashboard/me/payments"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-700"
              >
                <CreditCard size={18} /> My Payments
              </NavLink>
            </nav>
          )}
        </div>

        {/* Section: Event Tools */}
        <div>
          <button
            onClick={() => setEventsOpen(!eventsOpen)}
            className="flex justify-between w-full items-center text-sm font-semibold text-gray-600 mb-2"
          >
            Event Tools {eventsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {eventsOpen && (
            <nav className="space-y-3 pl-2 mb-4">
              <NavLink
                to="/dashboard/me/bookings"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-700"
              >
                <ShieldCheck size={18} /> My Bookings
              </NavLink>
              <NavLink
                to="/dashboard/me/browseevents"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-700"
              >
                <Ticket size={18} /> Browse Events
              </NavLink>
            </nav>
          )}
        </div>

        {/* Section: Support */}
        <div>
          <button
            onClick={() => setSupportOpen(!supportOpen)}
            className="flex justify-between w-full items-center text-sm font-semibold text-gray-600 mb-2"
          >
            Support {supportOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {supportOpen && (
            <nav className="space-y-3 pl-2 mb-4">
              <NavLink
                to="/dashboard/me/support"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-700"
              >
                <LifeBuoy size={18} /> Support Tickets
              </NavLink>
            </nav>
          )}
        </div>
      </aside>
    </>
  );
};

export default UserSidenav;
