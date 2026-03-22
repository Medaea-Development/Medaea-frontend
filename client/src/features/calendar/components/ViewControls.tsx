import React from "react";
import Button from "../../../components/ui/Button";
import type { ViewType } from "../../../types/calendar.types";

interface ViewControlsProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  currentDateLabel: string;
  onNavigate: (direction: number) => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({
  currentView,
  onViewChange,
  currentDateLabel,
  onNavigate,
}) => {
  return (
    <div className="view-controls">
      <div className="btn-group view-type-buttons" role="group">
        {(["day", "week", "month", "year"] as ViewType[]).map((view) => (
          <button
            key={view}
            type="button"
            className={`btn btn-view ${currentView === view ? "active" : ""}`}
            onClick={() => onViewChange(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      <div className="calendar-navigation">
        <button className="btn btn-nav" onClick={() => onNavigate(-1)}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h5 className="current-date mb-0">{currentDateLabel}</h5>
        <button className="btn btn-nav" onClick={() => onNavigate(1)}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <Button
        className="btn btn-shv"
        onClick={() => alert("Schedule Visit functionality")}
      >
        Schedule a visit
      </Button>
    </div>
  );
};

export default ViewControls;
