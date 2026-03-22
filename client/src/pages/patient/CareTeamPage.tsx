import React from "react";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const CARE_TEAM = [
  { id: "ct1", name: "Dr. Sarah Mitchell",    role: "Primary Care Physician",    dept: "Internal Medicine",  phone: "(415) 555-1001", patients: 142, status: "Active" },
  { id: "ct2", name: "Dr. Michael Chen",      role: "Cardiologist",             dept: "Cardiology",         phone: "(415) 555-1002", patients: 98,  status: "Active" },
  { id: "ct3", name: "RN. Kelly Thompson",    role: "Registered Nurse",         dept: "Internal Medicine",  phone: "(415) 555-1003", patients: 67,  status: "Active" },
  { id: "ct4", name: "Dr. Emily Rodriguez",   role: "Specialist",               dept: "Dermatology",        phone: "(415) 555-1004", patients: 84,  status: "Active" },
  { id: "ct5", name: "PA. James Wilson",      role: "Physician Assistant",      dept: "Family Medicine",    phone: "(415) 555-1005", patients: 53,  status: "On Leave" },
  { id: "ct6", name: "Dr. David Lee",         role: "Radiologist",              dept: "Radiology",          phone: "(415) 555-1006", patients: 0,   status: "Active" },
];

const AV_COLORS = ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#d97706", "#db2777"];

const CareTeamPage: React.FC = () => (
  <div className="clin-page">
    <div className="clin-header">
      <div>
        <h2>Care Team</h2>
        <p>Healthcare providers and staff members</p>
      </div>
      <button className="add-btn" data-testid="btn-add-member">
        <i className="fas fa-plus" /> Add Member
      </button>
    </div>
    <div className="clin-content">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {CARE_TEAM.map((m, i) => (
          <div key={m.id} className="clin-card" data-testid={`card-careteam-${m.id}`}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: AV_COLORS[i % AV_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="clin-card-title">{m.name}</div>
                <div className="clin-card-meta">{m.role}</div>
              </div>
            </div>
            <div className="clin-card-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div><div className="clin-field-lbl">Department</div><div className="clin-field-val">{m.dept}</div></div>
              <div><div className="clin-field-lbl">Phone</div><div className="clin-field-val">{m.phone}</div></div>
              <div><div className="clin-field-lbl">Patients</div><div className="clin-field-val">{m.patients}</div></div>
              <div>
                <div className="clin-field-lbl">Status</div>
                <span className={`status-badge ${m.status === "Active" ? "sb-completed" : "sb-unconfirmed"}`}>{m.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default CareTeamPage;
