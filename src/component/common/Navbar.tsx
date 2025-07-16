import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-amber-400 shadow-md px-4 sm:px-10">
      {/* Left Side – Logo */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-fuchsia-600  ">
          TicketKenya
        </Link>
      </div>

      {/* Right Side – Links */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-sm font-medium text-gray-700 hover:bg-green-400 transition-colors">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/events" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>Events</NavLink>
          </li>
       
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>Contact</NavLink>
          </li>
          <li>
            <NavLink to="/register" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>Register</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? "text-fuchsia-600 font-semibold" : ""}>Login</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
