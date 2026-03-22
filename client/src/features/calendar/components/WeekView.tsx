import React from "react";
import {
  getWeekStart,
  formatDate,
  formatDateKey,
} from "../../../utils/dateUtils";
import type { AppointmentRead } from "../../../types/appointment.type";

interface WeekViewProps {
  currentDate: Date;
  appointments: AppointmentRead[];
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, appointments }) => {
  const weekStart = getWeekStart(currentDate);
  const today = new Date();

  // Stable helper to categorize appointments based on ID (Matches Day/Month views)
  const getAppointmentType = (id: string): "visit" | "call" | "task" => {
    const types: ("visit" | "call" | "task")[] = ["visit", "call", "task"];
    const charCode = id.charCodeAt(id.length - 1);
    return types[charCode % types.length];
  };

  const renderHeader = () => {
    const headers = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const isToday = date.toDateString() === today.toDateString();

      headers.push(
        <div key={i} className={`week-day-header ${isToday ? "today" : ""}`}>
          <div className="week-day-name">{formatDate(date, "short-day")}</div>
          <div className="week-day-date">{date.getDate()}</div>
        </div>,
      );
    }
    return headers;
  };

  const renderColumns = () => {
    const columns = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateKey = formatDateKey(date);

      // Filter appointments for this specific day in the week
      const dayAppointments = appointments.filter(
        (appt) => formatDateKey(new Date(appt.start_time)) === dateKey,
      );

      columns.push(
        <div key={i} className="week-day-column">
          {dayAppointments.map((event) => {
            const startDate = new Date(event.start_time);
            const startHour = startDate.getHours();
            const startMinutes = startDate.getMinutes();

            // Positioning: 60px per hour, starting at 8:00 AM baseline
            const topPos = (startHour - 8) * 60 + startMinutes;
            const apptType = getAppointmentType(event.id);

            return (
              <div
                key={event.id}
                className={`week-event ${apptType}`}
                style={{
                  top: `${topPos}px`,
                  height: "28px",
                  position: "absolute",
                  width: "95%",
                }}
              >
                <div className="event-time">
                  {startDate.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
                <div className="event-title">
                  {event.patient_first_name?.charAt(0)}.{" "}
                  {event.patient_last_name}
                </div>
                <div className="event-doctor">{event.condition_type}</div>
              </div>
            );
          })}
        </div>,
      );
    }
    return columns;
  };

  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  return (
    <div className="calendar-view active">
      <div className="week-calendar">
        <div className="week-header">
          <div className="week-day-header border-0"></div> {/* Corner spacer */}
          {renderHeader()}
        </div>
        <div className="week-body">
          <div className="time-column">
            {timeSlots.map((time, i) => (
              <div key={i} className="time-slot">
                {time}
              </div>
            ))}
          </div>
          <div className="week-days-grid" style={{ position: "relative" }}>
            {renderColumns()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
