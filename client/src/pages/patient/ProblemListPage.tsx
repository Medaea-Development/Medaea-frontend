import React from "react";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const PROBLEMS = [
  { id: "prb001", patient: "Hemali Patel",       problem: "Type 2 Diabetes Mellitus",        icd: "E11.9",  onset: "01/15/2020", severity: "Moderate", status: "Active",   provider: "Dr. Sarah Mitchell" },
  { id: "prb002", patient: "Hemali Patel",       problem: "Essential Hypertension",          icd: "I10",    onset: "03/20/2019", severity: "Mild",     status: "Active",   provider: "Dr. Sarah Mitchell" },
  { id: "prb003", patient: "Bette Christiansen", problem: "Major Depressive Disorder",       icd: "F32.1",  onset: "06/10/2022", severity: "Moderate", status: "Active",   provider: "Dr. Michael Chen" },
  { id: "prb004", patient: "Marcus Webb",        problem: "Chronic Lower Back Pain",         icd: "M54.5",  onset: "09/05/2018", severity: "Severe",   status: "Chronic",  provider: "Dr. David Lee" },
  { id: "prb005", patient: "Maria Garcia",       problem: "Hypothyroidism, Unspecified",     icd: "E03.9",  onset: "02/28/2021", severity: "Mild",     status: "Active",   provider: "Dr. Emily Rodriguez" },
  { id: "prb006", patient: "Robert Johnson",     problem: "Coronary Artery Disease",         icd: "I25.10", onset: "07/12/2015", severity: "Severe",   status: "Chronic",  provider: "Dr. Michael Chen" },
  { id: "prb007", patient: "Robert Johnson",     problem: "Atrial Fibrillation",             icd: "I48.91", onset: "11/03/2018", severity: "Moderate", status: "Active",   provider: "Dr. Michael Chen" },
];

const ProblemListPage: React.FC = () => (
  <div className="clin-page">
    <div className="clin-header">
      <div>
        <h2>Problem List</h2>
        <p>Active and chronic conditions across all patients</p>
      </div>
      <button className="add-btn" data-testid="btn-add-problem">
        <i className="fas fa-plus" /> Add Problem
      </button>
    </div>
    <div className="clin-content">
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Patient</th><th>Problem / Diagnosis</th><th>ICD-10</th>
              <th>Onset</th><th>Severity</th><th>Status</th><th>Provider</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {PROBLEMS.map(p => (
              <tr key={p.id} data-testid={`row-problem-${p.id}`}>
                <td style={{ fontWeight: 600 }}>{p.patient}</td>
                <td>{p.problem}</td>
                <td style={{ fontSize: 12, fontFamily: "monospace" }}>{p.icd}</td>
                <td>{p.onset}</td>
                <td><span className={p.severity === "Severe" ? "severity-high" : p.severity === "Moderate" ? "severity-med" : "severity-low"}>{p.severity}</span></td>
                <td><span className={`status-badge ${p.status === "Active" ? "sb-pending" : "sb-normal"}`}>{p.status}</span></td>
                <td style={{ fontSize: 12 }}>{p.provider}</td>
                <td>
                  <button className="tbl-action-btn" title="Edit"><i className="fas fa-edit" /></button>
                  <button className="tbl-action-btn" title="Resolve"><i className="fas fa-check" /></button>
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

export default ProblemListPage;
