import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import "../../assets/css/calPages.css";

const OnCallSchedulePage: React.FC = () => {
  const [data, setData] = useState<{ stats: any; entries: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    api.get("/calendar/on-call").then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const prevMonth = () => { const d = new Date(currentDate); d.setMonth(d.getMonth() - 1); setCurrentDate(d); };
  const nextMonth = () => { const d = new Date(currentDate); d.setMonth(d.getMonth() + 1); setCurrentDate(d); };
  const monthLabel = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  if (loading) return <div style={{ padding: 32 }}><Loader /></div>;
  const { stats, entries } = data!;

  return (
    <div className="cal-page">
      {/* nav bar */}
      <div className="cal-nav-bar" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="cal-nav-btn" onClick={prevMonth}><i className="fa fa-chevron-left" /></button>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>On-Call Schedule</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{monthLabel}</div>
          </div>
          <button className="cal-nav-btn" onClick={nextMonth}><i className="fa fa-chevron-right" /></button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-teal"><i className="fa fa-plus" /> Add On-Call</button>
          <button className="btn-outline"><i className="fa fa-download" /> Export</button>
        </div>
      </div>

      {/* stats */}
      <div className="cal-stats">
        <div className="cal-stat teal"><div className="cal-stat-val">{stats.active}</div><div className="cal-stat-lbl">Currently On-Call</div></div>
        <div className="cal-stat"><div className="cal-stat-val">{stats.upcoming}</div><div className="cal-stat-lbl">Upcoming</div></div>
        <div className="cal-stat orange"><div className="cal-stat-val">{stats.totalCalls}</div><div className="cal-stat-lbl">Total Calls</div></div>
        <div className="cal-stat red"><div className="cal-stat-val">{stats.emergencies}</div><div className="cal-stat-lbl">Emergencies</div></div>
        <div className="cal-stat purple"><div className="cal-stat-val">{stats.physicians}</div><div className="cal-stat-lbl">Physicians On-Call</div></div>
      </div>

      {/* entries */}
      <div className="cal-list-scroll">
        {entries.map(e => (
          <div key={e.id} className="oc-card">
            <div className="oc-card-header">
              <div className="staff-av" style={{ background: e.color, width: 44, height: 44, fontSize: 14 }}>{e.initials}</div>
              <div className="oc-info">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span className="oc-name">{e.name}</span>
                  <span className={`badge ${e.status === "active" ? "green" : "blue"}`}>{e.status.toUpperCase()}</span>
                </div>
                <div className="oc-specialty">Physician · {e.specialty}</div>
                <div className="oc-phone"><i className="fa fa-phone" style={{ marginRight: 4 }} />{e.phone}</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                <button className="btn-outline btn-sm"><i className="fa fa-phone" /> Call Now</button>
                <button className="btn-outline btn-sm"><i className="fa fa-edit" /></button>
              </div>
            </div>

            <div className="oc-grid">
              <div className="oc-field">
                <div className="oc-field-lbl">On-Call Period</div>
                <div className="oc-field-val">{e.period}</div>
              </div>
              <div className="oc-field">
                <div className="oc-field-lbl">Backup Provider</div>
                <div className="oc-field-val">{e.backup}</div>
                <div className="oc-field-sub">{e.backupPhone}</div>
              </div>
              <div className="oc-field calls">
                <div className="oc-field-lbl">Total Calls</div>
                <div className="oc-field-val" style={{ fontSize: 22, color: "#16a34a" }}>{e.totalCalls}</div>
              </div>
              <div className="oc-field emerg">
                <div className="oc-field-lbl">Emergencies</div>
                <div className="oc-field-val" style={{ fontSize: 22, color: "#dc2626" }}>{e.emergencies}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnCallSchedulePage;
