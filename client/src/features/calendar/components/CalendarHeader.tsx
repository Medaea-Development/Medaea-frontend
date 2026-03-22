import React from "react";

const CalendarHeader: React.FC = () => {
  return (
    <div className="calendar-header">
      <div>
        <h1 className="mb-1">Calendar</h1>
        <p className="text-muted-custom mb-0">
          Manage appointments and schedules
        </p>
      </div>
    </div>
  );
};

export default CalendarHeader;
