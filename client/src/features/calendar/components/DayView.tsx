import React from "react";
import { formatDate } from "../../../utils/dateUtils";
import type { AppointmentRead } from "../../../types/appointment.type";

interface DayViewProps {
  currentDate: Date;
  appointments: AppointmentRead[];
}

const DayView: React.FC<DayViewProps> = ({ currentDate, appointments }) => {
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

  // Helper to assign a stable "type" based on ID since DB field is missing
  const getAppointmentType = (id: string): "visit" | "call" | "task" => {
    const types: ("visit" | "call" | "task")[] = ["visit", "call", "task"];
    // Use the last character of the UUID to pick a stable index
    const charCode = id.charCodeAt(id.length - 1);
    return types[charCode % types.length];
  };

  return (
    <div className="calendar-view active">
      <div className="day-calendar">
        <div className="day-header">
          <h6 className="mb-0">{formatDate(currentDate, "long")}</h6>
          <p className="text-muted-custom mb-0">
            {formatDate(currentDate, "day")}
          </p>
        </div>
        <div className="day-body">
          <div className="time-column">
            {timeSlots.map((time, i) => (
              <div key={i} className="time-slot">
                {time}
              </div>
            ))}
          </div>
          <div className="day-events" id="dayEventsGrid">
            {appointments.map((event) => {
              const startDate = new Date(event.start_time);
              const startHour = startDate.getHours();
              const startMinutes = startDate.getMinutes();

              // Calculate vertical position (60px per hour, baseline 8:00 AM)
              const topPos = (startHour - 8) * 60 + startMinutes;

              const displayTime = startDate.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              });

              // Randomly but stably pick between visit, call, task
              const apptType = getAppointmentType(event.id);

              return (
                <div
                  key={event.id}
                  // We use the apptType for the class name (day-event visit, day-event call, etc)
                  className={`day-event ${apptType}`}
                  style={{
                    top: `${topPos}px`,
                    position: "absolute",
                    width: "90%",
                  }}
                >
                  <div className="event-time">{displayTime}</div>
                  <div className="event-title">
                    {event.patient_first_name} {event.patient_last_name}
                  </div>
                  <div className="event-doctor">{event.condition_type}</div>
                  {event.reason && (
                    <span className="event-room">{event.reason}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
