import React, { useEffect, useMemo, useState } from "react";
import CalendarHeader from "./components/CalendarHeader";
import ViewControls from "./components/ViewControls";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";
import DayView from "./components/DayView";
import YearView from "./components/YearView";
import { formatDate, formatDateKey, getWeekStart } from "../../utils/dateUtils";
import type { ViewType } from "../../types/calendar.types";
import { getMyAppointments } from "../../api/appointment";
import type { AppointmentRead } from "../../types/appointment.type";

import "../../assets/css/calendar.css";

const CalendarPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentRead[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentView, setCurrentView] = useState<ViewType>("month");

  // Set default date to TODAY so you can actually navigate to your data
  const [currentDate, setCurrentDate] = useState(new Date());

  const [activeTab, setActiveTab] = useState<"calendar" | "patient" | "staff">(
    "calendar",
  );

  // Memoize grouped appointments so Month/Year views can show badges
  const appointmentsByDate = useMemo(() => {
    return appointments.reduce(
      (acc, appt) => {
        const key = formatDateKey(new Date(appt.start_time));
        if (!acc[key]) acc[key] = [];
        acc[key].push(appt);
        return acc;
      },
      {} as Record<string, AppointmentRead[]>,
    );
  }, [appointments]);

  const handleNavigate = (direction: number) => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case "day":
        newDate.setDate(newDate.getDate() + direction);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + direction * 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
    }
    setCurrentDate(newDate);
  };

  const getDateLabel = () => {
    switch (currentView) {
      case "day":
        return formatDate(currentDate, "long");
      case "week": {
        const start = getWeekStart(currentDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${formatDate(start, "short")} - ${formatDate(end, "short")}`;
      }
      case "month":
        return formatDate(currentDate, "month-year");
      case "year":
        return currentDate.getFullYear().toString();
      default:
        return "";
    }
  };

  const switchToDayView = (date: Date) => {
    setCurrentDate(date);
    setCurrentView("day");
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getMyAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="container-fluid main-content">
      <div className="calendar-container">
        <CalendarHeader />

        <div className="calendar-tabs">
          <ul className="nav nav-tabs border-0" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "calendar" ? "active" : ""}`}
                onClick={() => setActiveTab("calendar")}
              >
                Calendar
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "patient" ? "active" : ""}`}
                onClick={() => setActiveTab("patient")}
              >
                Patient Schedule
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "staff" ? "active" : ""}`}
                onClick={() => setActiveTab("staff")}
              >
                Staff Schedule
              </button>
            </li>
          </ul>

          <div className="tab-content mt-3">
            {activeTab === "calendar" ? (
              <>
                <ViewControls
                  currentView={currentView}
                  onViewChange={setCurrentView}
                  currentDateLabel={getDateLabel()}
                  onNavigate={handleNavigate}
                />

                <div className="calendar-views">
                  {loading ? (
                    <div className="text-center p-5">
                      Loading appointments...
                    </div>
                  ) : (
                    <>
                      {currentView === "month" && (
                        <MonthView
                          currentDate={currentDate}
                          onDayClick={switchToDayView}
                          appointmentsByDate={appointmentsByDate}
                        />
                      )}
                      {currentView === "week" && (
                        <WeekView
                          currentDate={currentDate}
                          appointments={appointments}
                        />
                      )}
                      {currentView === "day" && (
                        <DayView
                          currentDate={currentDate}
                          appointments={appointments.filter(
                            (a) =>
                              formatDateKey(new Date(a.start_time)) ===
                              formatDateKey(currentDate),
                          )}
                        />
                      )}
                      {currentView === "year" && (
                        <YearView
                          currentDate={currentDate}
                          onMonthClick={() => {}}
                          onDayClick={switchToDayView}
                          appointmentsByDate={appointmentsByDate}
                        />
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="tab-pane active fade show">
                <div className="empty-state">
                  <i
                    className={`fas ${activeTab === "patient" ? "fa-calendar-alt" : "fa-users"}`}
                  ></i>
                  <h5>
                    {activeTab === "patient"
                      ? "Patient Schedule"
                      : "Staff Schedule"}
                  </h5>
                  <p>
                    {activeTab === "patient" ? "Patient" : "Staff"} scheduling
                    view will be displayed here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="cld-box">
        <div className="text-center">
          <span>
            Access to health information is logged and monitored in accordance
            with
            <a href="#" className="link-primary mx-1">
              HIPAA Privacy Notice
            </a>
            <a href="#" className="link-primary mx-1">
              Patient Rights
            </a>
            <a href="#" className="link-primary mx-1">
              Accessibility
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
