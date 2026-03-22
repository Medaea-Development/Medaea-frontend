import React from "react";
import { formatDateKey } from "../../../utils/dateUtils";
import type { AppointmentRead } from "../../../types/appointment.type";

interface YearViewProps {
  currentDate: Date;
  onMonthClick: (monthIndex: number) => void;
  onDayClick: (date: Date) => void;
  // FIX: Add the real data prop
  appointmentsByDate: Record<string, AppointmentRead[]>;
}

const YearView: React.FC<YearViewProps> = ({
  currentDate,
  onDayClick,
  appointmentsByDate,
}) => {
  const year = currentDate.getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderMiniCalendar = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    // Adjust start day: 0 (Sun) -> 6, 1 (Mon) -> 0
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const cells = [];
    const today = new Date();

    // Empty cells for the start of the month
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="year-day"></div>);
    }

    // Days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, monthIndex, day);
      const dateKey = formatDateKey(date);

      // FIX: Check real appointments instead of mock data
      const dayAppointments = appointmentsByDate[dateKey] || [];
      const hasEvents = dayAppointments.length > 0;

      const isToday = date.toDateString() === today.toDateString();

      cells.push(
        <div
          key={`day-${day}`}
          className={`year-day ${isToday ? "today" : ""} ${hasEvents ? "has-events" : ""}`}
          onClick={() => onDayClick(date)}
        >
          {day}
        </div>,
      );
    }

    return cells;
  };

  return (
    <div className="calendar-view active">
      <div className="year-calendar">
        {months.map((monthName, index) => (
          <div key={index} className="year-month">
            <div className="year-month-header">{monthName}</div>
            <div className="year-month-weekdays">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="year-month-weekday">
                  {d}
                </div>
              ))}
            </div>
            <div className="year-month-days">{renderMiniCalendar(index)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearView;
