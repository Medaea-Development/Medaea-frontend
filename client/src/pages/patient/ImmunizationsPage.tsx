import React from "react";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const IMMUNIZATIONS = [
  { id: "i1", patient: "Hemali Patel",       vaccine: "COVID-19 (Moderna)",    date: "09/15/2023", dose: "Booster", site: "Left Deltoid", lot: "MN4567", provider: "Dr. Sarah Mitchell",   status: "Complete" },
  { id: "i2", patient: "Hemali Patel",       vaccine: "Influenza (Seasonal)",  date: "10/01/2024", dose: "Annual",  site: "Right Deltoid",lot: "FL2024", provider: "RN. Kelly Thompson", status: "Complete" },
  { id: "i3", patient: "Bette Christiansen", vaccine: "Tdap",                  date: "05/20/2022", dose: "1 of 1",  site: "Left Deltoid", lot: "TD8901", provider: "Dr. Michael Chen",     status: "Complete" },
  { id: "i4", patient: "Bette Christiansen", vaccine: "HPV (Gardasil 9)",      date: "03/15/2020", dose: "3 of 3",  site: "Right Deltoid",lot: "HP3456", provider: "Dr. Michael Chen",     status: "Complete" },
  { id: "i5", patient: "Marcus Webb",        vaccine: "Pneumococcal (PPSV23)", date: "02/10/2022", dose: "1 of 1",  site: "Left Deltoid", lot: "PP7890", provider: "Dr. David Lee",         status: "Complete" },
  { id: "i6", patient: "Marcus Webb",        vaccine: "Influenza (Seasonal)",  date: "10/05/2024", dose: "Annual",  site: "Right Deltoid",lot: "FL2024", provider: "Dr. David Lee",         status: "Complete" },
  { id: "i7", patient: "Robert Johnson",     vaccine: "Shingrix (RZV)",        date: "06/01/2023", dose: "2 of 2",  site: "Left Deltoid", lot: "SH5678", provider: "Dr. Michael Chen",     status: "Complete" },
  { id: "i8", patient: "Maria Garcia",       vaccine: "Hepatitis B",           date: "01/12/2023", dose: "3 of 3",  site: "Right Deltoid",lot: "HB2345", provider: "Dr. Emily Rodriguez",  status: "Complete" },
];

const ImmunizationsPage: React.FC = () => (
  <div className="clin-page">
    <div className="clin-header">
      <div>
        <h2>Immunizations</h2>
        <p>Vaccination records across all patients</p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="export-btn" data-testid="btn-export-immun"><i className="fas fa-download" /> Export</button>
        <button className="add-btn" data-testid="btn-add-immun"><i className="fas fa-plus" /> Record Immunization</button>
      </div>
    </div>
    <div className="clin-content">
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Patient</th><th>Vaccine</th><th>Date</th><th>Dose</th>
              <th>Site</th><th>Lot #</th><th>Provider</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {IMMUNIZATIONS.map(im => (
              <tr key={im.id} data-testid={`row-immun-${im.id}`}>
                <td style={{ fontWeight: 600 }}>{im.patient}</td>
                <td style={{ fontWeight: 500 }}>{im.vaccine}</td>
                <td>{im.date}</td>
                <td>{im.dose}</td>
                <td>{im.site}</td>
                <td style={{ fontSize: 12, fontFamily: "monospace" }}>{im.lot}</td>
                <td style={{ fontSize: 12 }}>{im.provider}</td>
                <td><span className="status-badge sb-completed">{im.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
  </div>
);

export default ImmunizationsPage;
