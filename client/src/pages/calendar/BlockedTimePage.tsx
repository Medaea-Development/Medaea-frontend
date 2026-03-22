import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import "../../assets/css/calPages.css";

const TYPE_BADGE: Record<string, string> = { PTO: "green", Sick: "red", Conference: "indigo", Blocked: "purple" };
const STATUS_BADGE: Record<string, string> = { approved: "green", pending: "amber", denied: "red" };

const BlockedTimePage: React.FC = () => {
  const [data, setData] = useState<{ stats: any; entries: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.get("/calendar/pto").then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const prevMonth = () => { const d = new Date(currentDate); d.setMonth(d.getMonth() - 1); setCurrentDate(d); };
  const nextMonth = () => { const d = new Date(currentDate); d.setMonth(d.getMonth() + 1); setCurrentDate(d); };
  const monthLabel = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleApprove = async (id: string) => {
    setActionLoading(id + "_approve");
    await api.patch(`/calendar/pto/${id}/approve`);
    setActionLoading(null);
    load();
  };
  const handleDeny = async (id: string) => {
    setActionLoading(id + "_deny");
    await api.patch(`/calendar/pto/${id}/deny`);
    setActionLoading(null);
    load();
  };

  if (loading) return <div style={{ padding: 32 }}><Loader /></div>;
  const { stats, entries } = data!;

  return (
    <div className="cal-page">
      {/* nav */}
      <div className="cal-nav-bar" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="cal-nav-btn" onClick={prevMonth}><i className="fa fa-chevron-left" /></button>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>PTO & Blocked Time</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{monthLabel}</div>
          </div>
          <button className="cal-nav-btn" onClick={nextMonth}><i className="fa fa-chevron-right" /></button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-teal" onClick={() => setShowModal(true)}><i className="fa fa-plus" /> Request Time Off</button>
          <button className="btn-outline"><i className="fa fa-download" /> Export</button>
        </div>
      </div>

      {/* stats */}
      <div className="cal-stats">
        <div className="cal-stat teal"><div className="cal-stat-val">{stats.pto}</div><div className="cal-stat-lbl">PTO Requests</div></div>
        <div className="cal-stat red"><div className="cal-stat-val">{stats.sick}</div><div className="cal-stat-lbl">Sick Leave</div></div>
        <div className="cal-stat"><div className="cal-stat-val">{stats.conference}</div><div className="cal-stat-lbl">Conferences</div></div>
        <div className="cal-stat orange"><div className="cal-stat-val">{stats.blocked}</div><div className="cal-stat-lbl">Blocked Time</div></div>
        <div className="cal-stat amber"><div className="cal-stat-val">{stats.pending}</div><div className="cal-stat-lbl">Pending</div></div>
      </div>

      {/* list */}
      <div className="cal-list-scroll">
        {entries.map(e => (
          <div key={e.id} className="pto-card">
            <div className="pto-header">
              <div className="staff-av" style={{ background: e.color }}>{e.initials}</div>
              <div className="pto-info">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span className="pto-name">{e.name}</span>
                  <span className="badge gray" style={{ fontSize: 10 }}>{e.role}</span>
                  <span className={`badge ${TYPE_BADGE[e.type] || "gray"}`}>{e.type.toUpperCase()}</span>
                  <span className={`badge ${STATUS_BADGE[e.status] || "gray"}`}>{e.status.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <button className="btn-outline btn-sm"><i className="fa fa-edit" /></button>
              </div>
            </div>

            <div className="pto-grid">
              <div>
                <div className="pto-field-lbl">Date Range</div>
                <div className="pto-field-val">{e.dateFrom} – {e.dateTo}</div>
              </div>
              <div>
                <div className="pto-field-lbl">Duration</div>
                <div className="pto-field-val">{e.duration}</div>
              </div>
              {e.coverage && (
                <div>
                  <div className="pto-field-lbl">Coverage</div>
                  <div className="pto-field-val" style={{ color: "#0891b2" }}>{e.coverage}</div>
                </div>
              )}
            </div>
            {e.reason && <div className="pto-reason">{e.reason}</div>}

            {e.status === "pending" && (
              <div className="pto-actions">
                <button
                  className="btn-approve"
                  disabled={actionLoading === e.id + "_approve"}
                  onClick={() => handleApprove(e.id)}
                >
                  {actionLoading === e.id + "_approve" ? "..." : "Approve"}
                </button>
                <button
                  className="btn-deny"
                  disabled={actionLoading === e.id + "_deny"}
                  onClick={() => handleDeny(e.id)}
                >
                  {actionLoading === e.id + "_deny" ? "..." : "Deny"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Request Time Off</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Type</label>
                <select style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }}>
                  <option>PTO</option><option>Sick Leave</option><option>Conference</option><option>Blocked Time</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>From</label>
                  <input type="date" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>To</label>
                  <input type="date" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Coverage Provider</label>
                <input type="text" placeholder="Coverage provider name" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Reason</label>
                <textarea rows={3} placeholder="Reason for time off..." style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, resize: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-teal" onClick={async () => {
                  await api.post("/calendar/pto", { type: "PTO", status: "pending" });
                  setShowModal(false); load();
                }}>Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedTimePage;
