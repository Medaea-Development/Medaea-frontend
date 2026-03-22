import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { searchPatients } from "../../api/patient";
import Loader from "../../components/ui/Loader";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const AV_COLORS = ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#d97706", "#db2777"];
const avColor = (name: string) => AV_COLORS[(name?.charCodeAt(0) ?? 0) % AV_COLORS.length];

const STATUS_STYLES: Record<string, string> = {
  "Waiting Room": "#fff7ed|#c2410c",
  "Checked In":   "#dcfce7|#15803d",
  "Scheduled":    "#dbeafe|#1d4ed8",
  "Completed":    "#f3f4f6|#374151",
};

const PatientSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    searchPatients()
      .then(setPatients)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      (p.mrn || "").toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q)
    );
  }, [patients, search]);

  return (
    <div className="patient-search-page">
      {/* Header */}
      <div className="patient-search-header">
        <div>
          <h2>Patient Search</h2>
          <p>{patients.length} patients total</p>
        </div>
        <button className="add-btn" data-testid="btn-add-patient">
          <i className="fas fa-plus" /> New Patient
        </button>
      </div>

      {/* Search bar */}
      <div className="patient-search-bar">
        <div className="patient-search-input">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search by name, MRN, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="input-patient-search"
          />
        </div>
        <button className="export-btn" data-testid="btn-filter">
          <i className="fas fa-filter" /> Filter
        </button>
        <button className="export-btn" data-testid="btn-export">
          <i className="fas fa-download" /> Export
        </button>
      </div>

      {/* Patient list */}
      <div className="patient-list">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Loader /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
            <i className="fas fa-search" style={{ fontSize: 40, marginBottom: 12, display: "block" }} />
            <p style={{ margin: 0, fontSize: 14 }}>No patients found matching "{search}"</p>
          </div>
        ) : filtered.map(p => {
          const initials = `${(p.firstName || "?")[0]}${(p.lastName || "?")[0]}`;
          const bg = avColor(p.lastName || "A");
          const stStyle = STATUS_STYLES[p.status] || "#f3f4f6|#374151";
          const [sbg, sc] = stStyle.split("|");
          return (
            <div
              key={p.id}
              className="patient-card"
              onClick={() => navigate(`/patient/${p.id}`)}
              data-testid={`card-patient-${p.id}`}
            >
              <div className="patient-av2" style={{ background: bg }}>{initials}</div>
              <div className="patient-card-info">
                <div className="patient-card-name">{p.firstName} {p.lastName}</div>
                <div className="patient-card-meta">
                  {p.age}yo · {p.gender} · {p.pronouns} · DOB: {p.dob} · MRN: {p.mrn}
                </div>
                <div className="patient-card-chips">
                  <span className="patient-chip teal">
                    <i className="fas fa-user-md" /> {p.provider}
                  </span>
                  <span className="patient-chip blue">
                    <i className="fas fa-shield-alt" /> {p.insurance}
                  </span>
                  {p.nextAppt && (
                    <span className="patient-chip green">
                      <i className="fas fa-calendar" /> {p.nextAppt}
                    </span>
                  )}
                </div>
              </div>
              <div className="patient-card-right">
                <span className="status-badge" style={{ background: sbg, color: sc }}>{p.status}</span>
                <div style={{ marginTop: 8 }}>
                  <i className="fas fa-chevron-right patient-card-arrow" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default PatientSearchPage;
