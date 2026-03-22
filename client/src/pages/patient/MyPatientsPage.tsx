import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPatients } from "../../api/patient";
import Loader from "../../components/ui/Loader";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const AV_COLORS = ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#d97706", "#db2777"];
const avColor = (name: string) => AV_COLORS[(name?.charCodeAt(0) ?? 0) % AV_COLORS.length];

const MyPatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPatients().then(setPatients).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="patient-search-page">
      <div className="patient-search-header">
        <div>
          <h2>My Patients</h2>
          <p>Patients assigned to your care</p>
        </div>
        <button className="add-btn" data-testid="btn-add-patient">
          <i className="fas fa-plus" /> New Patient
        </button>
      </div>

      <div className="patient-list">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Loader /></div>
        ) : patients.map(p => {
          const initials = `${(p.firstName || "?")[0]}${(p.lastName || "?")[0]}`;
          return (
            <div
              key={p.id}
              className="patient-card"
              onClick={() => navigate(`/patient/${p.id}`)}
              data-testid={`card-mypatient-${p.id}`}
            >
              <div className="patient-av2" style={{ background: avColor(p.lastName || "A") }}>{initials}</div>
              <div className="patient-card-info">
                <div className="patient-card-name">{p.firstName} {p.lastName}</div>
                <div className="patient-card-meta">
                  {p.age}yo · {p.gender} · DOB: {p.dob} · MRN: {p.mrn}
                </div>
                <div className="patient-card-chips">
                  <span className="patient-chip blue"><i className="fas fa-shield-alt" /> {p.insurance}</span>
                  {p.nextAppt && <span className="patient-chip green"><i className="fas fa-calendar" /> Next: {p.nextAppt}</span>}
                </div>
              </div>
              <div className="patient-card-right">
                <span className={`status-badge ${p.status === "Completed" ? "sb-completed" : p.status === "Waiting Room" ? "sb-unconfirmed" : "sb-pending"}`}>{p.status}</span>
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

export default MyPatientsPage;
