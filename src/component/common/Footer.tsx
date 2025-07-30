import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content px-4 sm:px-6 py-10 space-y-8">
      {/* Top Section: 3 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* LEFT: Brand */}
        <div>
          <h2 className="text-2xl font-bold text-fuchsia-600 mb-2">TicketKenya.com</h2>
          <p className="text-sm text-gray-500">Your trusted ticketing partner.</p>
        </div>

        {/* CENTER: Main Links */}
        <div>
          <h3 className="footer-title mb-2 text-base font-semibold text-gray-700">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="link link-hover">Home</Link></li>
            <li><Link to="/events" className="link link-hover">Events</Link></li>
            <li><Link to="/about" className="link link-hover">About</Link></li>
            <li><Link to="/contact" className="link link-hover">Contact</Link></li>
          </ul>
        </div>

        {/* RIGHT: Socials */}
        <div>
          <h3 className="footer-title mb-2 text-base font-semibold text-gray-700">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-6 text-fuchsia-600">
            <a
              aria-label="Twitter"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter size={24} />
            </a>
            <a
              aria-label="YouTube"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube size={24} />
            </a>
            <a
              aria-label="Facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <p className="text-xs sm:text-sm text-center pt-6 border-t border-base-300 text-gray-600">
        © {new Date().getFullYear()} — All rights reserved by{" "}
        <span className="text-fuchsia-600 font-semibold">TicketKenya</span>
      </p>
    </footer>
  );
};

export default Footer;
