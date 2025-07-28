import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content px-6 py-10 space-y-4">
      {/* Top Section: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* LEFT: Brand */}
        <div>
          <h2 className="text-2xl font-bold text-fuchsia-600 mb-2">TicketKenya.com</h2>
              </div>

        {/* CENTER: Main Links */}
        <div>
          <h3 className="footer-title mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="link link-hover">Home</Link></li>
            <li><Link to="/events" className="link link-hover">Events</Link></li>
             <li><Link to="/about" className="link link-hover">About</Link></li>
                        <li><Link to="/contact" className="link link-hover">Contact</Link></li>
          </ul>
        </div>

        {/* RIGHT: Socials */}
        <div>
          <h3 className="footer-title mb-2">Follow Us</h3>
          

<div className="grid grid-flow-col gap-4 justify-center md:justify-start text-fuchsia-600">
  <a aria-label="Twitter" href="https://twitter.com">
    <FaTwitter size={24} />
  </a>
  <a aria-label="YouTube" href="https://youtube.com">
    <FaYoutube size={24} />
  </a>
  <a aria-label="Facebook" href="https://facebook.com">
    <FaFacebook size={24} />
  </a>
</div>

        </div>
      </div>

      {/* Bottom Text: Copyright only */}
      <p className="text-sm text-center pt-4 border-t border-base-300">
        © {new Date().getFullYear()} — All rights reserved by <span className="text-fuchsia-600 font-semibold">TicketKenya</span>
      </p>
    </footer>
  );
};

export default Footer;
