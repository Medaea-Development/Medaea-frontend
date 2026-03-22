import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import "../../assets/css/calPages.css";

const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAY_KEYS = ["sun","mon","tue","wed","thu","fri","sat"];

function getWeekRange(d: Date) {
  const sun = new Date(d); sun.setDate(d.getDate() - d.getDay());
  const sat = new Date(sun); sat.setDate(sun.getDate() + 6);
  const fmt = (x: Date) => x.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(sun)} – ${fmt(sat)}`;
}

function getWeekDates(d: Date): Date[] {
  const sun = new Date(d); sun.setDate(d.getDate() - d.getDay());
  return Array.from({ length: 7 }, (_, i) => { const x = new Date(sun); x.setDate(sun.getDate() + i); return x; });
}

const StaffSchedulePage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"week"|"day"|"month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    api.get("/calendar/staff").then(r => setStaff(r.data)).finally(() => setLoading(false));
  }, []);

  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };

  const filteredStaff = staff.filter(s =>
    (search === "" || s.name.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === "all" || s.role.toLowerCase().includes(roleFilter.toLowerCase()))
  );

  const roles = [...new Set(staff.map(s => s.role))];
  const totalStaff = staff.length;
  const onDuty = staff.filter(s => s.status === "active").length;
  const pto = staff.filter(s => s.status === "pto").length;
  const physicians = staff.filter(s => s.role === "Physician").length;
  const totalPatients = staff.reduce((sum, s) => sum + s.totalAppts, 0);

  const weekDates = getWeekDates(currentDate);

  const getShift = (member: any, dayIdx: number) => {
    const key = DAY_KEYS[dayIdx];
    if (key === "sun" || key === "sat") return null;
    return member.schedule[key] || null;
  };

  if (loading) return <div style={{ padding: 32 }}><Loader /></div>;

  return (
    <div className="cal-page">
      {/* week nav */}
      <div className="ss-week-nav">
        <button className="cal-nav-btn" onClick={prevWeek}><i className="fa fa-chevron-left" /></button>
        <div>
          <div className="ss-week-label">Week View</div>
          <div className="ss-week-range">{getWeekRange(currentDate)}</div>
        </div>
        <button className="cal-nav-btn" onClick={nextWeek}><i className="fa fa-chevron-right" /></button>

        <button className="btn-teal" style={{ marginLeft: 8 }}><i className="fa fa-user-plus" /> Add Staff</button>

        <div className="cal-tabs" style={{ marginLeft: 8 }}>
          {(["day","week","month"] as const).map(v => (
            <button key={v} className={`cal-tab ${view === v ? "active" : ""}`} onClick={() => setView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn-outline" onClick={() => setCurrentDate(new Date())} style={{ marginLeft: 4 }}>Today</button>

        <div className="search-input-wrap" style={{ maxWidth: 200, marginLeft: 8 }}>
          <i className="fa fa-search" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, background: "#fff" }}>
          <option value="all">All Roles</option>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* stats */}
      <div className="cal-stats">
        <div className="cal-stat"><div className="cal-stat-val">{totalStaff}</div><div className="cal-stat-lbl">Total Staff</div></div>
        <div className="cal-stat teal"><div className="cal-stat-val">{onDuty}</div><div className="cal-stat-lbl">On Duty</div></div>
        <div className="cal-stat orange"><div className="cal-stat-val">{pto}</div><div className="cal-stat-lbl">PTO</div></div>
        <div className="cal-stat"><div className="cal-stat-val">{physicians}</div><div className="cal-stat-lbl">Physicians</div></div>
        <div className="cal-stat purple"><div className="cal-stat-val">{totalPatients}</div><div className="cal-stat-lbl">Total Patients</div></div>
      </div>

      {/* grid */}
      <div className="ss-grid-wrap">
        <div className="ss-grid">
          {/* header */}
          <div className="ss-grid-header">
            <div className="ss-grid-hcell">STAFF MEMBER</div>
            {weekDates.map((d, i) => (
              <div key={i} className="ss-grid-hcell">
                {DAYS[i]}
                <span style={{ display: "block", fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{d.getDate()}</span>
              </div>
            ))}
          </div>

          {/* rows */}
          {filteredStaff.map(member => (
            <div key={member.id} className="ss-grid-row">
              <div className="ss-member-cell">
                <div className="staff-av" style={{ background: member.color }}>{member.initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a1a" }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{member.role}</div>
                  <span className={`badge ${member.status === "active" ? "green" : member.status === "pto" ? "orange" : "gray"}`} style={{ marginTop: 4 }}>
                    {member.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {weekDates.map((_, dayIdx) => {
                const shift = getShift(member, dayIdx);
                const isWeekend = dayIdx === 0 || dayIdx === 6;
                if (isWeekend && !shift) {
                  return <div key={dayIdx} className="ss-day-cell" style={{ background: "#fafafa" }} />;
                }
                if (!shift || !shift.start) {
                  return (
                    <div key={dayIdx} className="ss-day-cell">
                      <div className="ss-shift-off">–</div>
                    </div>
                  );
                }
                const isPto = shift.duty === "PTO";
                return (
                  <div key={dayIdx} className="ss-day-cell">
                    <div className={`ss-shift-block ${isPto ? "ss-shift-pto" : ""}`}>
                      <div className="ss-shift-time">{shift.start} AM – {shift.end} PM</div>
                      <div className="ss-shift-loc"><i className="fa fa-map-marker-alt" style={{ marginRight: 3, fontSize: 9 }} />{shift.loc}</div>
                      <div className="ss-shift-pts">{member.patientsToday > 0 ? `${member.patientsToday} patients` : ""}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffSchedulePage;
