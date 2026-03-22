import React from "react";
import { formatDateKey } from "../../../utils/dateUtils";
import Badge, { type BadgeVariant } from "../../../components/ui/Badge";
import type { AppointmentRead } from "../../../types/appointment.type";

interface MonthViewProps {
  currentDate: Date;
  onDayClick: (date: Date) => void;
  appointmentsByDate: Record<string, AppointmentRead[]>;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  onDayClick,
  appointmentsByDate,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  let startDay = firstDay.getDay() - 1;
  if (startDay === -1) startDay = 6;

  // Stable helper to categorize appointments based on ID
  const getAppointmentType = (id: string): "visits" | "calls" | "tasks" => {
    const types: ("visits" | "calls" | "tasks")[] = [
      "visits",
      "calls",
      "tasks",
    ];
    const charCode = id.charCodeAt(id.length - 1);
    return types[charCode % types.length];
  };

  const cells = [];

  // Previous month filler
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push(
      <div key={`prev-${i}`} className="day-cell other-month">
        <div className="day-number">{prevMonthLastDay - i}</div>
      </div>,
    );
  }

  // Current month days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    const dayAppointments = appointmentsByDate[dateKey] || [];
    const isToday = new Date().toDateString() === date.toDateString();

    // Grouping logic for categories
    const counts = dayAppointments.reduce(
      (acc, appt) => {
        const type = getAppointmentType(appt.id);
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    cells.push(
      <div
        key={`curr-${day}`}
        className={`day-cell ${isToday ? "today" : ""}`}
        onClick={() => onDayClick(date)}
      >
        <div className="day-number">{day}</div>
        <div className="day-events">
          {/* Render individual badges for each category present on this day */}
          {(Object.entries(counts) as [BadgeVariant, number][]).map(
            ([type, count]) => (
              <Badge
                key={type}
                variant={type}
                label={type.charAt(0).toUpperCase() + type.slice(1, -1)} // 'visits' -> 'Visit'
                count={count}
              />
            ),
          )}
        </div>
      </div>,
    );
  }

  // Next month filler
  const totalCells = cells.length;
  const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    cells.push(
      <div key={`next-${i}`} className="day-cell other-month">
        <div className="day-number">{i}</div>
      </div>,
    );
  }

  return (
    <div className="calendar-view active">
      <div className="month-calendar">
        <div className="weekdays">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
            <div key={d} className="weekday">
              {d}
            </div>
          ))}
        </div>
        <div className="days-grid">{cells}</div>
      </div>
    </div>
  );
};

export default MonthView;
