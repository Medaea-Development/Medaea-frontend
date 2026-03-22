import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../../config/constants";
import { useLogout } from "../../hooks/useLogout";

import "../../assets/css/navbar.css";
import { useAuth } from "../../hooks/useAuth";
import { COLORS } from "../../config/colors";
import {
  formatFullName,
  formatRole,
  getInitials,
} from "../../utils/stringUtils";
import { getAssetUrl } from "../../api/client";

interface NavbarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isSidebarCollapsed,
  toggleSidebar,
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const { logoutUser } = useLogout();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = formatFullName(user?.first_name, user?.last_name);
  const initials = getInitials(user?.first_name, user?.last_name);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDD = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div
      id="topbar"
      className={isSidebarCollapsed ? "sb-col" : ""}
      ref={dropdownRef}
    >
      <button id="sb-open-btn" onClick={toggleSidebar}>
        <i className="fa fa-bars"></i>
      </button>

      <div className="tb-brand">
        <div className="tb-brand-icon">M</div>
        <span className="tb-brand-name">Medaea</span>
        <span className="ai-badge ms-1">AI</span>
      </div>

      <div className="tb-nav">
        <div className="dd-wrap">
          <button
            className={`tb-nav-item ${location.pathname.includes("calendar") ? "active" : ""}`}
            onClick={() => toggleDD("cal")}
          >
            Calendar{" "}
            <i className="fa fa-chevron-down" style={{ fontSize: "9px" }}></i>
          </button>

          <div className={`dd-menu ${activeDropdown === "cal" ? "open" : ""}`}>
            <Link to={APP_ROUTES.CALENDAR} className="dd-item active">
              <i className="fa fa-calendar-check dd-icon"></i>My Schedule
            </Link>
            <a className="dd-item">
              <i className="fa fa-hospital dd-icon"></i>Clinic Calendar
            </a>
            <div className="dd-div"></div>
            <a className="dd-item">
              <i className="fa fa-layer-group dd-icon"></i>Schedule Templates
            </a>
          </div>
        </div>

        <Link to="#" className="tb-nav-item">
          Patient
        </Link>
        <Link to="#" className="tb-nav-item">
          Billing
        </Link>
      </div>

      <div className="tb-search">
        <i
          className="fa fa-search"
          style={{ color: COLORS.textMuted, fontSize: "12px" }}
        ></i>
        <input
          type="text"
          placeholder="Search for patient, Charts, Reports or an..."
        />
      </div>

      <div className="dd-wrap">
        <div className="user-menu" onClick={() => toggleDD("user")}>
          <div className="user-av" style={{ overflow: "hidden" }}>
            {user?.avatar_url ? (
              <img
                src={getAssetUrl(user.avatar_url)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              initials
            )}
          </div>
          <div className="d-none d-md-block">
            <div className="user-name-txt">{displayName}</div>
            <div className="user-role-txt">{formatRole(user?.role)}</div>
          </div>
          <i
            className="fa fa-chevron-down ms-1"
            style={{ color: COLORS.textMuted, fontSize: "9px" }}
          ></i>
        </div>

        <div
          className={`dd-menu right ${activeDropdown === "user" ? "open" : ""}`}
        >
          <Link to="/profile" className="dd-item">
            <i className="fa fa-user dd-icon"></i>My Profile
          </Link>
          <Link to="/settings" className="dd-item">
            <i className="fa fa-cog dd-icon"></i>Settings
          </Link>
          <div className="dd-div"></div>
          <a
            onClick={logoutUser}
            className="dd-item"
            style={{ color: COLORS.danger }}
          >
            <i
              className="fa fa-sign-out-alt dd-icon"
              style={{ color: COLORS.danger }}
            ></i>
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
