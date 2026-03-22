import React, { useState, useEffect } from "react";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import "../../assets/css/calPages.css";

const TYPE_BADGE: Record<string, string> = {
  Buffer: "teal", Advance: "blue", "Double Booking": "purple",
  Break: "amber", Conflict: "red",
};

const RuleCard: React.FC<{ rule: any; onToggle: () => void; onDelete: () => void }> = ({ rule, onToggle, onDelete }) => (
  <div className="rule-card">
    <div className="rule-header">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span className="rule-title">{rule.name}</span>
          <span className={`badge ${TYPE_BADGE[rule.type] || "gray"}`}>{rule.type.toUpperCase()}</span>
          <span className="priority-badge">Priority: {rule.priority}</span>
        </div>
        <div className="rule-desc">{rule.description}</div>
      </div>
    </div>

    <div className="rule-body">
      <div>
        <div className="rule-field-lbl"><i className="fa fa-users" /> Applies to</div>
        <div className="rule-field-val">{rule.appliesTo}</div>
      </div>
      <div>
        <div className="rule-field-lbl"><i className="fa fa-sliders-h" /> Conditions</div>
        <div className="rule-field-val" style={{ whiteSpace: "pre-line" }}>{rule.conditions}</div>
      </div>
    </div>

    <div className="rule-footer">
      <button className="btn-outline btn-sm"><i className="fa fa-edit" /> Edit Rule</button>
      <button className="btn-outline btn-sm"><i className="fa fa-eye" /> View Conflicts</button>
      <button
        onClick={onDelete}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "4px 8px", borderRadius: 6, fontSize: 14 }}
        title="Delete rule"
      >
        <i className="fa fa-trash" />
      </button>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        <label className="rule-toggle" onClick={onToggle} title={rule.enabled ? "Disable rule" : "Enable rule"}>
          <div className={`rule-toggle-track ${rule.enabled ? "on" : ""}`} />
          <div className="rule-toggle-thumb" style={rule.enabled ? { transform: "translateX(18px)" } : {}} />
        </label>
        <span className="rule-toggle-label" style={{ color: rule.enabled ? "#0891b2" : "#9ca3af" }}>
          {rule.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  </div>
);

const AvailabilityRulesPage: React.FC = () => {
  const [data, setData] = useState<{ stats: any; rules: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Buffer");
  const [newDesc, setNewDesc] = useState("");
  const [newApplies, setNewApplies] = useState("All Providers");

  const load = () => {
    setLoading(true);
    api.get("/calendar/rules").then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id: string) => {
    await api.patch(`/calendar/rules/${id}/toggle`);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this rule?")) return;
    await api.delete(`/calendar/rules/${id}`);
    load();
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await api.post("/calendar/rules", { name: newName, type: newType, description: newDesc, appliesTo: newApplies });
    setShowCreate(false); setNewName(""); setNewDesc("");
    load();
  };

  if (loading) return <div style={{ padding: 32 }}><Loader /></div>;
  const { stats, rules } = data!;

  return (
    <div className="cal-page">
      {/* header */}
      <div className="cal-header">
        <div className="cal-header-row" style={{ justifyContent: "space-between" }}>
          <div>
            <h2>Availability Rules</h2>
            <p>Configure automated scheduling rules and constraints</p>
          </div>
          <button className="btn-teal" onClick={() => setShowCreate(true)}><i className="fa fa-plus" /> Create Rule</button>
        </div>
      </div>

      {/* stats */}
      <div className="cal-stats">
        <div className="cal-stat"><div className="cal-stat-val">{stats.total}</div><div className="cal-stat-lbl">Total Rules</div></div>
        <div className="cal-stat teal"><div className="cal-stat-val">{stats.active}</div><div className="cal-stat-lbl">Active</div></div>
        <div className="cal-stat blue" style={{ color: "#1d4ed8" }}><div className="cal-stat-val" style={{ color: "#1d4ed8" }}>{stats.buffer}</div><div className="cal-stat-lbl">Buffer Rules</div></div>
        <div className="cal-stat red"><div className="cal-stat-val">{stats.conflict}</div><div className="cal-stat-lbl">Conflict Rules</div></div>
        <div className="cal-stat amber"><div className="cal-stat-val">{stats.break}</div><div className="cal-stat-lbl">Break Rules</div></div>
      </div>

      {/* rules list */}
      <div className="cal-list-scroll">
        {rules.map(rule => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onToggle={() => handleToggle(rule.id)}
            onDelete={() => handleDelete(rule.id)}
          />
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Create Availability Rule</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Rule Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="e.g. Lunch Break Block" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Rule Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value)} style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }}>
                    <option>Buffer</option><option>Advance</option><option>Break</option><option>Conflict</option><option>Double Booking</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Priority</label>
                  <input type="number" defaultValue={1} min={1} max={10} style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Applies To</label>
                <input value={newApplies} onChange={e => setNewApplies(e.target.value)} type="text" style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>Description</label>
                <textarea rows={2} value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Rule description..." style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, resize: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                <button className="btn-teal" onClick={handleCreate}>Create Rule</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityRulesPage;
