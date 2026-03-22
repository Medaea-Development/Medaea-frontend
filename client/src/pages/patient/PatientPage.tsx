import React, { useState, useEffect, useMemo } from "react";
import { getAllPatients } from "../../api/patient";
import { useToast } from "../../hooks/useToast";
import Footer from "../../components/layout/Footer";
import type { PatientProfile } from "../../types/patient.type";
import { calculateAge } from "../../utils/dateUtils";
import "../../assets/css/patient.css";

const AVATAR_COLORS = ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#d97706", "#db2777"];

const getAvatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const PatientPage: React.FC = () => {
  const { showToast } = useToast();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllPatients()
      .then(setPatients)
      .catch(() => showToast("Failed to load patients.", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.includes(q)
    );
  }, [patients, search]);

  return (
    <div>
      <div className="dash-hd">
        <div className="dash-left">
          <div className="dash-hd-icon" style={{ background: "#e0f2fe" }}>
            <i className="fa fa-user-injured" style={{ color: "#0891b2" }} />
          </div>
          <div>
            <div className="dash-title">Patient Search</div>
            <div className="dash-sub">{patients.length} patients in the system</div>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div className="tbl-hd">
          <div className="tbl-title">All Patients</div>
          <div className="tbl-actions">
            <div className="search-box">
              <i className="fa fa-search" style={{ color: "#9ca3af", fontSize: "12px" }} />
              <input type="text" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "48px", color: "#9ca3af" }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: "24px", marginBottom: "8px", display: "block" }} />
              Loading patients...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <i className="fa fa-users" />
              <h5>{search ? "No patients match your search" : "No patients yet"}</h5>
              <p style={{ fontSize: "13px" }}>Patients will appear here once added to the system.</p>
            </div>
          ) : (
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const name = `${p.first_name} ${p.last_name}`;
                  const initials = `${p.first_name?.[0] || ""}${p.last_name?.[0] || ""}`.toUpperCase();
                  const avatarColor = getAvatarColor(name);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="pat-cell">
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                            {initials}
                          </div>
                          <div>
                            <div className="pats-name">{name}</div>
                            {p.email && <div className="pat-email">{p.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        {p.date_of_birth
                          ? <>{new Date(p.date_of_birth).toLocaleDateString()}<br /><span style={{ fontSize: "11px", color: "#9ca3af" }}>{calculateAge(p.date_of_birth)} yrs</span></>
                          : "—"}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>{p.gender || "—"}</td>
                      <td>{p.phone || "—"}</td>
                      <td>
                        <span className={p.status === "active" ? "badge-active" : "badge-scheduled"}>
                          {p.status || "active"}
                        </span>
                      </td>
                      <td>
                        <button className="btn-view-details">View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientPage;
