import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import "../../assets/css/calPages.css";

const BADGE_MAP: Record<string, string> = { Provider: "blue", Department: "purple", Clinic: "teal" };

const ScheduleTemplatesPage: React.FC = () => {
  const [data, setData] = useState<{ stats: any; templates: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.get("/calendar/templates").then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this template?")) return;
    await api.delete(`/calendar/templates/${id}`);
    load();
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await api.post("/calendar/templates", { name: newName, description: newDesc });
    setShowCreate(false); setNewName(""); setNewDesc("");
    load();
  };

  if (loading) return <div style={{ padding: 32 }}><Loader /></div>;
  const { stats, templates } = data!;

  return (
    <div className="cal-page">
      {/* header */}
      <div className="cal-header">
        <div className="cal-header-row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2>Schedule Templates</h2>
            <p>Create and manage reusable scheduling templates</p>
          </div>
          <button className="btn-teal" onClick={() => setShowCreate(true)}><i className="fa fa-plus" /> Create Template</button>
        </div>
      </div>

      {/* stats */}
      <div className="cal-stats">
        <div className="cal-stat"><div className="cal-stat-val">{stats.total}</div><div className="cal-stat-lbl">Total Templates</div></div>
        <div className="cal-stat teal"><div className="cal-stat-val">{stats.active}</div><div className="cal-stat-lbl">Active</div></div>
        <div className="cal-stat blue" style={{ color: "#1d4ed8" }}><div className="cal-stat-val" style={{ color: "#1d4ed8" }}>{stats.provider}</div><div className="cal-stat-lbl">Provider Templates</div></div>
        <div className="cal-stat purple"><div className="cal-stat-val">{stats.inUse}</div><div className="cal-stat-lbl">In Use</div></div>
      </div>

      {/* template cards */}
      <div className="cal-content" style={{ overflow: "auto" }}>
        <div className="tmpl-grid">
          {templates.map(t => (
            <div key={t.id} className="tmpl-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span className="tmpl-card-title">{t.name}</span>
                <span className={`badge ${BADGE_MAP[t.badge] || "gray"}`}>{t.badge.toUpperCase()}</span>
                <span className={`badge ${t.status === "active" ? "green" : "gray"}`}>{t.status.toUpperCase()}</span>
              </div>
              <div className="tmpl-card-desc">{t.description}</div>

              <div className="tmpl-detail-row">
                <i className="fa fa-calendar tmpl-detail-icon" />
                <span><b>Days:</b> {t.days}</span>
              </div>
              <div className="tmpl-detail-row">
                <i className="fa fa-clock tmpl-detail-icon" />
                <span style={{ whiteSpace: "pre-line" }}><b>Hours:</b> {t.hours}</span>
              </div>
              <div className="tmpl-detail-row">
                <i className="fa fa-file-medical tmpl-detail-icon" />
                <span><b>Types:</b> {t.types}</span>
              </div>
              <div className="tmpl-detail-row">
                <i className="fa fa-user tmpl-detail-icon" />
                <span><b>Applied to:</b> {t.appliedTo}</span>
              </div>

              <div className="tmpl-card-footer">
                <button className="btn-dup"><i className="fa fa-copy" /> Duplicate</button>
                <button className="btn-edit"><i className="fa fa-edit" /> Edit</button>
                <button className="btn-del" onClick={() => handleDelete(t.id)} title="Delete"><i className="fa fa-trash" /></button>
                <span className="tmpl-usage">
                  Usage Count: <b style={{ color: "#0891b2" }}>{t.usageCount} {t.usageCount === 1 ? "provider" : "providers"}</b>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Create Schedule Template</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Template Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="e.g. Morning Physician Schedule" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Type</label>
                <select style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }}>
                  <option>Provider</option><option>Department</option><option>Clinic</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Working Days</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                    <label key={d} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked={!["Sat","Sun"].includes(d)} style={{ accentColor: "#0891b2" }} />{d}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Start Time</label>
                  <input type="time" defaultValue="08:00" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>End Time</label>
                  <input type="time" defaultValue="17:00" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Description</label>
                <textarea rows={2} value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Template description..." style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, resize: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                <button className="btn-teal" onClick={handleCreate}>Create Template</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTemplatesPage;
