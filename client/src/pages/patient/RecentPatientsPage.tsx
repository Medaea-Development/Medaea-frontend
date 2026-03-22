import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentPatients } from "../../api/patient";
import Loader from "../../components/ui/Loader";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const AV_COLORS = ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#d97706", "#db2777"];
const avColor = (name: string) => AV_COLORS[(name?.charCodeAt(0) ?? 0) % AV_COLORS.length];

const RecentPatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentPatients().then(setPatients).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="patient-search-page">
      <div className="patient-search-header">
        <div>
          <h2>Recent Patients</h2>
          <p>Patients recently viewed or treated</p>
        </div>
      </div>

      <div className="patient-list">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Loader /></div>
        ) : patients.map((p, idx) => {
          const initials = `${(p.firstName || "?")[0]}${(p.lastName || "?")[0]}`;
          const timeLabels = ["Just now", "2 hours ago", "4 hours ago", "Yesterday", "2 days ago"];
          return (
            <div
              key={p.id}
              className="patient-card"
              onClick={() => navigate(`/patient/${p.id}`)}
              data-testid={`card-recent-${p.id}`}
            >
              <div className="patient-av2" style={{ background: avColor(p.lastName || "A") }}>{initials}</div>
              <div className="patient-card-info">
                <div className="patient-card-name">{p.firstName} {p.lastName}</div>
                <div className="patient-card-meta">
                  {p.age}yo · {p.gender} · MRN: {p.mrn}
                </div>
                <div className="patient-card-chips">
                  <span className="patient-chip"><i className="fas fa-clock" /> Viewed: {timeLabels[idx] || "Recently"}</span>
                  {p.nextAppt && <span className="patient-chip green"><i className="fas fa-calendar" /> Next: {p.nextAppt}</span>}
                </div>
              </div>
              <div className="patient-card-right">
                <span className={`status-badge ${p.status === "Completed" ? "sb-completed" : "sb-pending"}`}>{p.status}</span>
                <div style={{ marginTop: 8 }}><i className="fas fa-chevron-right patient-card-arrow" /></div>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default RecentPatientsPage;
