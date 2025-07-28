import React from "react";
import { Outlet } from "react-router-dom";
import UserSidenav from "../dashboardLayout/UserSidenav";
import Footer from "../common/Footer";
import Navbar from "../common/Navbar";

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col"> {/* Full page height layout */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <UserSidenav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UserLayout;
