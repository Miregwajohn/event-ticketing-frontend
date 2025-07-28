import  Navbar  from '../component/common/Navbar'
import  Footer  from '../component/common/Footer'

export const About = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-100 via-white to-pink-100 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto bg-base-300 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">About Us</h1>
          <p className="text-base-content mb-6">
            Welcome to our Event Ticketing and Venue Booking Platform — your one-stop solution for discovering, booking, and managing event experiences.
          </p>

          <h2 className="text-2xl font-semibold text-secondary mb-3">Our Mission</h2>
          <p className="text-base-content mb-6">
            Our mission is to simplify and digitize the event management space by offering a seamless, secure, and modern platform for both event organizers and attendees. 
            We believe in empowering communities to connect, celebrate, and collaborate through events — without the hassle of manual ticketing and venue coordination.
          </p>

          <h2 className="text-2xl font-semibold text-secondary mb-3">What We Offer</h2>
          <ul className="list-disc list-inside text-base-content mb-6 space-y-2">
            <li> Easy browsing and filtering of upcoming events</li>
            <li> Secure ticket booking and digital payments</li>
            <li> Dedicated dashboards for users and event administrators</li>
            <li> Venue management, support tickets, and reporting tools</li>
            <li> A responsive design for both mobile and desktop users</li>
          </ul>

          <h2 className="text-2xl font-semibold text-secondary mb-3">Why It Matters</h2>
          <p className="text-base-content mb-6">
            In an increasingly digital world, events remain one of the most powerful ways to bring people together. 
            Our platform bridges the gap between event organizers and the audience by removing friction — no more physical lines, manual entries, or lost tickets.
            Whether it's a concert, conference, or community meet-up, we make the process smooth from discovery to check-in.
          </p>

          <h2 className="text-2xl font-semibold text-secondary mb-3">Built With Passion</h2>
          <p className="text-base-content">
            This platform is the result of months of design, development, and testing — using modern technologies like React, Express, PostgreSQL, and Drizzle ORM. 
            It is part of a larger vision to support digital transformation for events in local and global communities.
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
