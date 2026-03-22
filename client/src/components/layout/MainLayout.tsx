import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";

import "../../assets/css/mainLayout.css";

const MainLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="app-wrapper">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <Navbar isSidebarCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* The Breadcrumb Bar stays fixed below the Navbar */}
      <Breadcrumb isSidebarCollapsed={isCollapsed} />

      {/* Main content renders the child routes (Calendar, Settings, etc.) */}
      <main id="main-content" className={isCollapsed ? "sb-col" : ""}>
        <div className="cw">
          <Outlet />
        </div>
      </main>

      {!isCollapsed && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 150,
          }}
        />
      )}
    </div>
  );
};

export default MainLayout;
