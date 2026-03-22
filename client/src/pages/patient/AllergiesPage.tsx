import React from "react";
import Footer from "../../components/layout/Footer";
import "../../assets/css/patient.css";

const ALLERGIES = [
  { id: "a1", patient: "Hemali Patel",       allergen: "Penicillin",       type: "Drug",  reaction: "Anaphylaxis",       severity: "Severe",   onset: "2010",    status: "Active" },
  { id: "a2", patient: "Hemali Patel",       allergen: "Shellfish",        type: "Food",  reaction: "Hives, Swelling",   severity: "Moderate", onset: "2015",    status: "Active" },
  { id: "a3", patient: "Bette Christiansen", allergen: "Sulfa Drugs",      type: "Drug",  reaction: "Rash",              severity: "Mild",     onset: "2018",    status: "Active" },
  { id: "a4", patient: "Bette Christiansen", allergen: "Pollen",           type: "Environmental", reaction: "Rhinitis", severity: "Mild",     onset: "Childhood", status: "Active" },
  { id: "a5", patient: "Marcus Webb",        allergen: "Codeine",          type: "Drug",  reaction: "Nausea, Vomiting",  severity: "Moderate", onset: "2005",    status: "Active" },
  { id: "a6", patient: "Maria Garcia",       allergen: "Latex",            type: "Contact", reaction: "Contact Dermatitis", severity: "Moderate", onset: "2012", status: "Active" },
  { id: "a7", patient: "Robert Johnson",     allergen: "Aspirin",          type: "Drug",  reaction: "Bronchospasm",      severity: "Severe",   onset: "2001",    status: "Active" },
];

const AllergiesPage: React.FC = () => (
  <div className="clin-page">
    <div className="clin-header">
      <div>
        <h2>Allergies</h2>
        <p>Documented allergies and adverse reactions</p>
      </div>
      <button className="add-btn" data-testid="btn-add-allergy">
        <i className="fas fa-plus" /> Add Allergy
      </button>
    </div>
    <div className="clin-content">
      {ALLERGIES.map(a => (
        <div key={a.id} className="clin-card" data-testid={`card-allergy-${a.id}`}>
          <div className="clin-card-header">
            <div>
              <div className="clin-card-title">{a.allergen}</div>
              <div className="clin-card-meta">{a.patient}</div>
            </div>
            <span className={`status-badge ${a.severity === "Severe" ? "sb-urgent" : a.severity === "Moderate" ? "sb-unconfirmed" : "sb-normal"}`}>{a.severity}</span>
            <button className="tbl-action-btn" title="Edit"><i className="fas fa-edit" /></button>
          </div>
          <div className="clin-card-grid">
            <div><div className="clin-field-lbl">Type</div><div className="clin-field-val">{a.type}</div></div>
            <div><div className="clin-field-lbl">Reaction</div><div className="clin-field-val">{a.reaction}</div></div>
            <div><div className="clin-field-lbl">Onset</div><div className="clin-field-val">{a.onset}</div></div>
            <div><div className="clin-field-lbl">Status</div><span className="status-badge sb-completed">{a.status}</span></div>
          </div>
        </div>
      ))}
    </div>
    <Footer />
  </div>
);

export default AllergiesPage;
