import React from "react";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const DEMO_PATIENTS = [
  { id: "p001", name: "Hemali Patel",       age: 37, gender: "Male",   race: "Asian",                   ethnicity: "Not Hispanic or Latino", lang: "English",   mrn: "P20251923334" },
  { id: "p002", name: "Bette Christiansen", age: 29, gender: "Female", race: "White",                   ethnicity: "Not Hispanic or Latino", lang: "English",   mrn: "P20251834521" },
  { id: "p003", name: "Marcus Webb",        age: 54, gender: "Male",   race: "Black or African American",ethnicity: "Not Hispanic or Latino", lang: "English",   mrn: "P20251745663" },
  { id: "p004", name: "Maria Garcia",       age: 42, gender: "Female", race: "White",                   ethnicity: "Hispanic or Latino",     lang: "Spanish",   mrn: "P20251612847" },
  { id: "p005", name: "Robert Johnson",     age: 68, gender: "Male",   race: "White",                   ethnicity: "Not Hispanic or Latino", lang: "English",   mrn: "P20251489230" },
];

const PatientDemographicsPage: React.FC = () => (
  <div className="clin-page">
    <div className="clin-header">
      <div>
        <h2>Patient Demographics</h2>
        <p>Demographic data for all patients in the system</p>
      </div>
      <button className="export-btn" data-testid="btn-export-demo">
        <i className="fas fa-download" /> Export
      </button>
    </div>
    <div className="clin-content">
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Patient Name</th><th>MRN</th><th>Age</th><th>Gender</th>
              <th>Race</th><th>Ethnicity</th><th>Primary Language</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_PATIENTS.map(p => (
              <tr key={p.id} data-testid={`row-demo-${p.id}`}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ fontSize: 12, fontFamily: "monospace" }}>{p.mrn}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.race}</td>
                <td>{p.ethnicity}</td>
                <td>{p.lang}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
  </div>
);

export default PatientDemographicsPage;
