import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import { clearCredentials } from "../../features/auth/authSlice";
import { FaBell, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar bg-amber-400 shadow-md px-4 sm:px-10 sticky top-0 z-50">
      {/* Left – Logo */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-fuchsia-600">
          TicketKenya
        </Link>
      </div>

      {/* Center – Navigation Links */}
      <div className="hidden md:flex flex-1 justify-center">
        <ul className="menu menu-horizontal px-1 text-sm font-medium text-gray-700">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/events" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>
              Events
            </NavLink>
          </li>
           <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>
            About            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right – Auth and Actions */}
      <div className="flex items-center gap-4">
        {/* 🔒 Not logged in */}
        {!isAuthenticated ? (
          <ul className="menu menu-horizontal px-1 text-sm font-medium text-gray-700">
            <li>
              <NavLink to="/register" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>
                Register
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>
                Login
              </NavLink>
            </li>
          </ul>
        ) : (
          <div className="relative flex items-center gap-4">
            {/*  Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="btn btn-ghost text-xl text-green-800 hover:text-fuchsia-600"
            >
              <FaBell />
            </button>

            {/*  User Dropdown */}
            <div className="dropdown dropdown-end">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-sm bg-white px-3 rounded-md text-green-800 font-semibold hover:bg-fuchsia-100"
              >
                Hey, {user?.firstname}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md z-[999] text-sm text-gray-800 py-2">
                  <li>
                    <Link
                      to={user?.role === "admin" ? "/dashboard/admin" : "/dashboard/me"}
                      className="block px-4 py-2 hover:bg-fuchsia-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 flex items-center gap-2"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
