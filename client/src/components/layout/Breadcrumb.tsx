import React from "react";
import { useLocation } from "react-router-dom";

import "../../assets/css/breadcrumb.css";

const Breadcrumb: React.FC<{ isSidebarCollapsed: boolean }> = ({
  isSidebarCollapsed,
}) => {
  const location = useLocation();
  const path = location.pathname.split("/").filter((x) => x);
  const pageName =
    path.length > 0
      ? path[0].charAt(0).toUpperCase() + path[0].slice(1)
      : "Dashboard";

  return (
    <div id="breadcrumb-bar" className={isSidebarCollapsed ? "sb-col" : ""}>
      <span className="bc-a">
        <span className="bc-icon">
          <i className="fa fa-home"></i>
        </span>
        &nbsp;Medaea
      </span>
      <span className="bc-sep">
        <i className="fa fa-chevron-right"></i>
      </span>
      <span className="bc-cur">{pageName}</span>
    </div>
  );
};

export default Breadcrumb;
