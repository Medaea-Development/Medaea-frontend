import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/css/sidebar.css";
import SidebarIcon from "../../assets/img/icons/ic-sidebar.svg";
import StarIcon from "../../assets/img/icons/ic-saved.svg";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

interface SubItem { label: string; path: string; icon: string; }
interface NavSection { id: string; label: string; icon: string; children: SubItem[]; }

const NAV: NavSection[] = [
  {
    id: "calendar", label: "Calendar", icon: "fa-calendar-alt",
    children: [
      { label: "My Schedule",            path: "/calendar",              icon: "fa-calendar-check" },
      { label: "Clinic Calendar",        path: "/calendar/clinic",       icon: "fa-hospital" },
      { label: "Staff Schedule",         path: "/calendar/staff",        icon: "fa-users" },
      { label: "On-Call Schedule",       path: "/calendar/on-call",      icon: "fa-phone" },
      { label: "Room / Resource Schedule", path: "/calendar/rooms",      icon: "fa-door-open" },
      { label: "Blocked Time / PTO",     path: "/calendar/pto",          icon: "fa-ban" },
      { label: "Schedule Templates",     path: "/calendar/templates",    icon: "fa-copy" },
      { label: "Availability Rules",     path: "/calendar/availability", icon: "fa-sliders-h" },
    ],
  },
  {
    id: "patient", label: "Patient", icon: "fa-user-injured",
    children: [
      { label: "Patient Search",      path: "/patient",                  icon: "fa-search" },
      { label: "My Patients",         path: "/patient/mine",             icon: "fa-user-check" },
      { label: "Recent Patients",     path: "/patient/recent",           icon: "fa-history" },
      { label: "Patient Demographics",path: "/patient/demographics",     icon: "fa-id-card" },
      { label: "Care Team",           path: "/patient/care-team",        icon: "fa-user-md" },
      { label: "Problem List",        path: "/patient/problem-list",     icon: "fa-list-alt" },
      { label: "Allergies",           path: "/patient/allergies",        icon: "fa-exclamation-triangle" },
      { label: "Medications",         path: "/patient/medications",      icon: "fa-pills" },
      { label: "Immunizations",       path: "/patient/immunizations",    icon: "fa-syringe" },
    ],
  },
  {
    id: "billing", label: "Billing", icon: "fa-file-invoice-dollar",
    children: [
      { label: "Overview",    path: "/billing",           icon: "fa-chart-pie" },
      { label: "Claims",      path: "/billing/claims",    icon: "fa-clipboard-list" },
      { label: "Payments",    path: "/billing/payments",  icon: "fa-credit-card" },
      { label: "Statements",  path: "/billing/statements",icon: "fa-file-alt" },
    ],
  },
  {
    id: "claims", label: "Claims", icon: "fa-clipboard-list",
    children: [
      { label: "All Claims",     path: "/claims",         icon: "fa-list" },
      { label: "Denied Claims",  path: "/claims/denied",  icon: "fa-times-circle" },
      { label: "Pending",        path: "/claims/pending", icon: "fa-clock" },
    ],
  },
  {
    id: "reports", label: "Reports", icon: "fa-chart-bar",
    children: [
      { label: "Productivity",  path: "/reports/productivity", icon: "fa-tachometer-alt" },
      { label: "Financial",     path: "/reports/financial",    icon: "fa-dollar-sign" },
      { label: "Clinical",      path: "/reports/clinical",     icon: "fa-stethoscope" },
    ],
  },
  {
    id: "ehr", label: "EHR", icon: "fa-notes-medical",
    children: [
      { label: "Chart",    path: "/ehr/chart",   icon: "fa-file-medical" },
      { label: "Orders",   path: "/ehr/orders",  icon: "fa-prescription" },
      { label: "Results",  path: "/ehr/results", icon: "fa-flask" },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  const activeSection = useMemo(() => {
    if (location.pathname.startsWith("/calendar")) return "calendar";
    if (location.pathname.startsWith("/patient"))  return "patient";
    if (location.pathname.startsWith("/billing"))  return "billing";
    if (location.pathname.startsWith("/claims"))   return "claims";
    if (location.pathname.startsWith("/reports"))  return "reports";
    if (location.pathname.startsWith("/ehr"))      return "ehr";
    return null;
  }, [location.pathname]);

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const init = new Set<string>();
    if (location.pathname.startsWith("/calendar")) init.add("calendar");
    if (location.pathname.startsWith("/patient"))  init.add("patient");
    return init;
  });

  const [starred, setStarred] = useState<Set<string>>(new Set(["/calendar"]));

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleStar = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    e.preventDefault();
    setStarred(prev => {
      const n = new Set(prev);
      n.has(path) ? n.delete(path) : n.add(path);
      return n;
    });
  };

  const isActive  = (path: string) => location.pathname === path;
  const isOpen    = (id: string)   => openSections.has(id);

  const starredItems = NAV.flatMap(s => s.children).filter(c => starred.has(c.path));

  return (
    <div id="sidebar" className={isCollapsed ? "collapsed" : ""}>
      <div className="sb-logo">
        <div className="sb-logo-icon">M</div>
        <span className="sb-logo-text">Navigation</span>
        <button className="sb-toggle" onClick={toggleSidebar}>
          <i className="fa">
            <img src={SidebarIcon} alt="Toggle" />
          </i>
        </button>
      </div>

      <nav className="sb-nav">
        {/* Favorites */}
        <div>
          <button className="sbn-item" onClick={() => toggleSection("fav")}>
            <span className="sbn-icon">
              <img src={StarIcon} alt="Favorites" />
            </span>
            <span className="sbn-label">Favorites</span>
            <i className={`fa fa-chevron-right sbn-arrow ${isOpen("fav") ? "rotate-90" : ""}`} />
          </button>
          {isOpen("fav") && !isCollapsed && (
            <div className="sb-subnav" style={{ display: "block" }}>
              {starredItems.length === 0 ? (
                <span className="sbn-item" style={{ fontSize: 11, opacity: 0.5, cursor: "default" }}>
                  No favorites yet
                </span>
              ) : (
                starredItems.map(item => (
                  <Link key={item.path} to={item.path} className={`sbn-item ${isActive(item.path) ? "active" : ""}`}>
                    <span className="sbn-label"><i className={`fas ${item.icon}`} style={{ marginRight: 6, width: 14 }} />{item.label}</span>
                    <i className="fas fa-star" style={{ marginLeft: "auto", color: "#f59e0b", cursor: "pointer" }} onClick={e => toggleStar(e, item.path)} />
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Main nav sections */}
        {NAV.map(sec => {
          const sActive = activeSection === sec.id;
          const open    = isOpen(sec.id);
          return (
            <div key={sec.id}>
              <button
                className={`sbn-item ${sActive ? "active" : ""}`}
                onClick={() => toggleSection(sec.id)}
              >
                <span className={`sbn-icon ${sActive ? "active-icon" : ""}`}>
                  <i className={`fas ${sec.icon}`} />
                </span>
                <span className="sbn-label">{sec.label}</span>
                <i className={`fa fa-chevron-right sbn-arrow ${open ? "rotate-90" : ""}`} />
              </button>

              {open && !isCollapsed && (
                <div className="sb-subnav" style={{ display: "block" }}>
                  {sec.children.map(child => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`sbn-item ${isActive(child.path) ? "active" : ""}`}
                    >
                      <span className="sbn-label">
                        <i className={`fas ${child.icon}`} style={{ marginRight: 6, width: 14, opacity: 0.7 }} />
                        {child.label}
                      </span>
                      <i
                        className={`${starred.has(child.path) ? "fas" : "far"} fa-star`}
                        style={{ marginLeft: "auto", cursor: "pointer", color: starred.has(child.path) ? "#f59e0b" : "#cbd5e1" }}
                        onClick={e => toggleStar(e, child.path)}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
