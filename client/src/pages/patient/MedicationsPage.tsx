import React from "react";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const MEDICATIONS = [
  { id: "m1", patient: "Hemali Patel",       name: "Lisinopril 10mg",      freq: "Once daily",         route: "Oral", start: "01/01/2024", refills: 3, prescriber: "Dr. Sarah Mitchell",   status: "Active" },
  { id: "m2", patient: "Hemali Patel",       name: "Metformin 500mg",      freq: "Twice daily",        route: "Oral", start: "06/15/2023", refills: 5, prescriber: "Dr. Sarah Mitchell",   status: "Active" },
  { id: "m3", patient: "Hemali Patel",       name: "Atorvastatin 20mg",    freq: "Once daily (hs)",    route: "Oral", start: "03/01/2023", refills: 2, prescriber: "Dr. Sarah Mitchell",   status: "Active" },
  { id: "m4", patient: "Bette Christiansen", name: "Sertraline 50mg",      freq: "Once daily",         route: "Oral", start: "07/10/2022", refills: 4, prescriber: "Dr. Michael Chen",     status: "Active" },
  { id: "m5", patient: "Marcus Webb",        name: "Naproxen 500mg",       freq: "Twice daily (PRN)",  route: "Oral", start: "10/05/2018", refills: 0, prescriber: "Dr. David Lee",         status: "Active" },
  { id: "m6", patient: "Maria Garcia",       name: "Levothyroxine 50mcg",  freq: "Once daily",         route: "Oral", start: "03/28/2021", refills: 6, prescriber: "Dr. Emily Rodriguez",  status: "Active" },
  { id: "m7", patient: "Robert Johnson",     name: "Metoprolol Succinate 25mg", freq: "Once daily",    route: "Oral", start: "08/12/2015", refills: 2, prescriber: "Dr. Michael Chen",     status: "Active" },
  { id: "m8", patient: "Robert Johnson",     name: "Warfarin 5mg",         freq: "Once daily",         route: "Oral", start: "01/03/2019", refills: 1, prescriber: "Dr. Michael Chen",     status: "Active" },
];

const MedicationsPage: React.FC = () => (
  <div className="clin-page">
    <div className="clin-header">
      <div>
        <h2>Medications</h2>
        <p>Active medications across all patients</p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="export-btn" data-testid="btn-export-meds"><i className="fas fa-download" /> Export</button>
        <button className="add-btn" data-testid="btn-add-med"><i className="fas fa-plus" /> Add Medication</button>
      </div>
    </div>
    <div className="clin-content">
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Patient</th><th>Medication</th><th>Frequency</th><th>Route</th>
              <th>Start Date</th><th>Refills</th><th>Prescriber</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MEDICATIONS.map(m => (
              <tr key={m.id} data-testid={`row-med-${m.id}`}>
                <td style={{ fontWeight: 600 }}>{m.patient}</td>
                <td style={{ fontWeight: 500 }}>{m.name}</td>
                <td style={{ fontSize: 12 }}>{m.freq}</td>
                <td>{m.route}</td>
                <td>{m.start}</td>
                <td>{m.refills > 0 ? m.refills : <span style={{ color: "#dc2626", fontWeight: 600 }}>0</span>}</td>
                <td style={{ fontSize: 12 }}>{m.prescriber}</td>
                <td><span className="status-badge sb-completed">{m.status}</span></td>
                <td>
                  <button className="tbl-action-btn" title="Refill"><i className="fas fa-sync" /></button>
                  <button className="tbl-action-btn" title="Edit"><i className="fas fa-edit" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
  </div>
);

export default MedicationsPage;
