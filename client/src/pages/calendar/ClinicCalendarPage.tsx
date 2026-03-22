import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import "../../assets/css/calPages.css";

type Tab = "calendar" | "patient" | "staff";
type View = "day" | "week" | "month" | "year";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM – 9 PM

function fmtHour(h: number) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:00 ${ampm}`;
}

const STATUS_STYLE: Record<string, { bg: string; border: string; statusBg: string; statusColor: string }> = {
  exam:           { bg: "#dbeafe", border: "#3b82f6", statusBg: "#dbeafe", statusColor: "#1d4ed8" },
  ready_for_doctor:{bg: "#dcfce7", border: "#22c55e", statusBg: "#22c55e", statusColor: "#fff" },
  talking:        { bg: "#1f2937", border: "#374151", statusBg: "#374151", statusColor: "#fff" },
  intake:         { bg: "#fef9c3", border: "#ca8a04", statusBg: "#fef9c3", statusColor: "#92400e" },
  checked_in:     { bg: "#e0f2fe", border: "#0891b2", statusBg: "#0891b2", statusColor: "#fff" },
  scheduled:      { bg: "#f3f4f6", border: "#9ca3af", statusBg: "#f3f4f6", statusColor: "#374151" },
};

const ClinicCalendarPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("calendar");
  const [view, setView] = useState<View>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/calendar/clinic").then(r => r.data),
      api.get("/calendar/staff").then(r => r.data),
    ]).then(([appts, st]) => {
      setAppointments(appts);
      setStaff(st);
    }).finally(() => setLoading(false));
  }, []);

  const prevDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); };
  const nextDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); };

  const dayLabel = currentDate.toLocaleDateString("en-US", { weekday: "long" });
  const dateLabel = currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const getApptForHour = (h: number) =>
    appointments.filter(a => {
      const [ah] = a.startTime.split(":").map(Number);
      return ah === h;
    });

  if (loading) return <div style={{ padding: 32 }}><Loader /></div>;

  return (
    <div className="cal-page">
      {/* header */}
      <div className="cal-header">
        <div className="cal-header-row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Calendar</h2>
            <p style={{ margin: 0 }}>Manage appointments and schedules</p>
          </div>
        </div>
        <div className="cal-header-row">
          <div className="cal-tabs">
            <button className={`cal-tab primary ${tab === "calendar" ? "active" : ""}`} onClick={() => setTab("calendar")}>Calendar</button>
            <button className={`cal-tab ${tab === "patient" ? "active" : ""}`} onClick={() => setTab("patient")}>Patient Schedule</button>
            <button className={`cal-tab ${tab === "staff" ? "active" : ""}`} onClick={() => setTab("staff")}>Staff Schedule</button>
          </div>
        </div>
      </div>

      {/* Calendar tab */}
      {tab === "calendar" && (
        <>
          {/* date nav */}
          <div className="cal-nav-bar" style={{ position: "relative" }}>
            <button className="cal-nav-btn" onClick={prevDay}><i className="fa fa-chevron-left" /></button>
            <div className="cal-month-label">
              {dayLabel}
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 400 }}>{dateLabel}</div>
            </div>
            <button className="cal-nav-btn" onClick={nextDay}><i className="fa fa-chevron-right" /></button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <div className="cal-tabs">
                {(["day","week","month","year"] as View[]).map(v => (
                  <button key={v} className={`cal-tab ${view === v ? "active" : ""}`} onClick={() => setView(v)}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
              <button className="btn-teal" style={{ marginLeft: 4 }}>
                <i className="fa fa-plus" /> Schedule a visit
              </button>
            </div>
          </div>

          {/* Day view time grid */}
          {view === "day" && (
            <div className="clinic-time-grid">
              {/* current time header */}
              <div style={{ padding: "6px 12px 4px 80px", fontSize: 11, fontWeight: 700, color: "#374151", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {dateLabel}
                <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: 8 }}>
                  {currentDate.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              </div>

              {HOURS.map(h => {
                const appts = getApptForHour(h);
                return (
                  <div key={h} className="clinic-time-row">
                    <div className="clinic-time-label">{fmtHour(h)}</div>
                    <div className="clinic-time-slot">
                      {appts.map(a => {
                        const st = STATUS_STYLE[a.status] || STATUS_STYLE.scheduled;
                        const isPhone = a.room === "Phone";
                        return (
                          <div
                            key={a.id}
                            className="clinic-appt-block"
                            style={{ background: st.bg, borderLeftColor: st.border, color: a.status === "talking" ? "#fff" : "#1a1a1a" }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <div className="clinic-appt-time" style={{ color: a.status === "talking" ? "#d1d5db" : "#374151" }}>
                                  {a.startTime} – {a.endTime}
                                  {a.status === "talking" && <span style={{ marginLeft: 8, fontStyle: "italic" }}>Talking: {a.patientName}</span>}
                                </div>
                                {a.status !== "talking" && (
                                  <>
                                    <div className="clinic-appt-name">{a.patientName} – {a.type}</div>
                                    <div className="clinic-appt-doc">{a.doctor} • <span style={{ color: "#0891b2", cursor: "pointer" }}>Click to view encounter</span></div>
                                  </>
                                )}
                              </div>
                              <div className="clinic-appt-badges">
                                {!isPhone && (
                                  <span className="clinic-badge" style={{ background: "#e0f2fe", color: "#0369a1" }}>{a.room}</span>
                                )}
                                {a.status !== "scheduled" && a.status !== "talking" && (
                                  <span className="clinic-badge" style={{ background: st.statusBg, color: st.statusColor }}>
                                    {a.status === "ready_for_doctor" ? (
                                      <><i className="fa fa-check-circle" style={{ marginRight: 4 }} />READY FOR DOCTOR</>
                                    ) : a.statusLabel || a.status.replace(/_/g, " ").toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {view !== "day" && (
            <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>
              <i className="fa fa-calendar-alt" style={{ fontSize: 40, marginBottom: 12, display: "block" }} />
              Switch to Day view to see the time-based schedule
            </div>
          )}
        </>
      )}

      {/* Patient Schedule tab */}
      {tab === "patient" && (
        <div className="cal-list-scroll">
          <div style={{ padding: "20px 0", color: "#6b7280", textAlign: "center" }}>
            <i className="fa fa-user-injured" style={{ fontSize: 36, marginBottom: 12, display: "block", color: "#0891b2" }} />
            <h3 style={{ color: "#374151", marginBottom: 8 }}>Patient Schedule</h3>
            <p>View and manage per-patient appointment schedules</p>
          </div>
          {appointments.map(a => (
            <div key={a.id} className="cal-card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0891b2", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {a.patientName.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.patientName}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{a.type} • {a.doctor}</div>
              </div>
              <div style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{a.startTime} – {a.endTime}</div>
              <span style={{ background: "#f3f4f6", color: "#374151", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{a.room}</span>
            </div>
          ))}
        </div>
      )}

      {/* Staff Schedule tab */}
      {tab === "staff" && (
        <div style={{ background: "#f1f5f9", flex: 1, overflow: "auto", padding: "16px 0" }}>
          <div style={{ padding: "8px 20px 16px", background: "#f1f5f9" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>Staff Schedule</h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>View and manage provider schedules</p>
          </div>
          {staff.map((s: any) => (
            <div key={s.id} className="staff-card">
              <div className="staff-card-header">
                <div className="staff-av" style={{ background: s.color }}>{s.initials}</div>
                <div className="staff-card-info">
                  <div className="staff-card-name">{s.name}</div>
                  <div className="staff-card-role">{s.role} – {s.specialty}</div>
                  <div className="staff-card-contact"><i className="fa fa-phone" style={{ marginRight: 4 }} />{s.phone} · <i className="fa fa-envelope" style={{ marginRight: 4 }} />{s.email}</div>
                </div>
                <div style={{ display: "flex", gap: 16, marginLeft: "auto", alignItems: "flex-start" }}>
                  <div className="staff-card-stats">
                    <div className="staff-card-stat-val">{s.patientsToday}</div>
                    <div className="staff-card-stat-lbl">Patients Today</div>
                  </div>
                  <div className="staff-card-stats">
                    <div className="staff-card-stat-val">{s.totalAppts}</div>
                    <div className="staff-card-stat-lbl">Total Appointments</div>
                  </div>
                  <span className={`badge ${s.type === "Full Time" ? "green" : "blue"}`}>{s.type}</span>
                </div>
              </div>
              <div className="staff-week-grid">
                {["mon","tue","wed","thu","fri"].map(day => {
                  const d = s.schedule[day];
                  const off = !d?.start;
                  const pto = d?.duty === "PTO";
                  return (
                    <div key={day} className={`staff-day-cell ${off ? "off" : ""} ${pto ? "pto" : ""}`}>
                      <div className="staff-day-name">{day.charAt(0).toUpperCase()+day.slice(1)}</div>
                      {off ? (
                        <div className="staff-day-hours" style={{ color: "#9ca3af" }}>–</div>
                      ) : (
                        <>
                          <div className="staff-day-hours">{d.start} – {d.end}</div>
                          <div className="staff-day-loc">{d.loc}</div>
                          <div className={`staff-day-duty ${pto ? "pto" : ""}`}>{d.duty}</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClinicCalendarPage;
