import React from "react";

interface Props { detail: any; subTab: string; setSubTab: (s: string) => void; }

const SIDEBAR_ITEMS = [
  { key: "medical-files",  icon: "fa-folder-open",     label: "Medical Files" },
  { key: "medications",    icon: "fa-pills",            label: "Medications" },
  { key: "allergies",      icon: "fa-allergies",        label: "Allergies" },
  { key: "immunizations",  icon: "fa-syringe",          label: "Immunizations" },
  { key: "medical-history",icon: "fa-history",          label: "Medical History" },
  { key: "labs",           icon: "fa-flask",            label: "Lab Results" },
];

const LAB_ROWS = [
  { test: "Complete Blood Count (CBC)", orderDate: "05/15/2020", orderedBy: "Dr. Stephanie Branch", lab: "Quest Diagnostics", result: "Normal",         resultDate: "05/16/2020", status: "Completed" },
  { test: "Lipid Panel",                orderDate: "05/10/2020", orderedBy: "Dr. Stephanie Branch", lab: "LabCorp",           result: "Borderline High", resultDate: "05/11/2020", status: "Completed" },
  { test: "Hemoglobin A1C",             orderDate: "05/05/2020", orderedBy: "Dr. Melissa Meijer",   lab: "Quest Diagnostics", result: "5.8%",            resultDate: "05/06/2020", status: "Completed" },
  { test: "Thyroid Function Test",      orderDate: "04/28/2020", orderedBy: "Dr. Jimmy Sullivan",   lab: "LabCorp",           result: "Pending Review",  resultDate: "—",          status: "Pending" },
];

const MEDS = [
  { name: "Lisinopril 10mg",    freq: "Once daily",             route: "Oral", start: "01/01/2024", refills: 3, status: "Active" },
  { name: "Metformin 500mg",    freq: "Twice daily",            route: "Oral", start: "06/15/2023", refills: 5, status: "Active" },
  { name: "Atorvastatin 20mg",  freq: "Once daily at bedtime",  route: "Oral", start: "03/01/2023", refills: 2, status: "Active" },
];

const ALLERGIES_LIST = [
  { allergen: "Penicillin",      type: "Drug",  reaction: "Anaphylaxis",        severity: "Severe",   onset: "2005" },
  { allergen: "Latex",           type: "Environmental", reaction: "Hives, Itching", severity: "Moderate", onset: "2010" },
  { allergen: "Shellfish",       type: "Food",  reaction: "Gastrointestinal upset", severity: "Mild",  onset: "2015" },
];

const IMMUNIZATIONS = [
  { vaccine: "Influenza",   date: "10/01/2024", administered: "Dr. Sarah Mitchell", lot: "FLU2024A",  site: "Left deltoid",  status: "Current" },
  { vaccine: "COVID-19 Booster", date: "09/15/2024", administered: "Pharmacy", lot: "MOD-B245",  site: "Right deltoid", status: "Current" },
  { vaccine: "Tdap",        date: "04/20/2022", administered: "Dr. Sarah Mitchell", lot: "TDAP-881",  site: "Left deltoid",  status: "Current" },
  { vaccine: "Pneumovax",   date: "11/05/2020", administered: "Dr. Michael Chen",   lot: "PNV-2020",  site: "Right deltoid", status: "Current" },
];

const MEDICAL_FILES = [
  { name: "Annual Physical Report 2024.pdf",  type: "Report",      date: "01/15/2025", size: "2.4 MB",  provider: "Dr. Sarah Mitchell" },
  { name: "Echocardiogram Results.pdf",       type: "Imaging",     date: "12/05/2024", size: "5.8 MB",  provider: "Cardiology Dept." },
  { name: "Lab Results Jan 2025.pdf",         type: "Lab",         date: "01/10/2025", size: "0.8 MB",  provider: "Quest Diagnostics" },
  { name: "Referral - Orthopaedics.pdf",      type: "Referral",    date: "11/20/2024", size: "0.3 MB",  provider: "Dr. Sarah Mitchell" },
];

const MED_HISTORY = [
  { date: "01/15/2025", type: "Office Visit",       provider: "Dr. Sarah Mitchell", diagnosis: "Hypertension follow-up",     status: "Completed" },
  { date: "12/05/2024", type: "Cardiology Consult", provider: "Dr. Michael Chen",   diagnosis: "Chest pain evaluation",      status: "Completed" },
  { date: "11/10/2024", type: "Annual Physical",    provider: "Dr. Sarah Mitchell", diagnosis: "Preventive wellness exam",   status: "Completed" },
  { date: "09/22/2024", type: "Urgent Care",        provider: "Dr. Lisa Park",      diagnosis: "URI - viral pharyngitis",    status: "Completed" },
  { date: "06/15/2024", type: "Lab Review",         provider: "Dr. Sarah Mitchell", diagnosis: "HbA1c monitoring",          status: "Completed" },
];

/* ── Lab Results ── */
function LabResultsContent() {
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Lab Results</h2>
          <p className="pat-section-desc">Laboratory test results and reports</p>
        </div>
        <button className="add-btn" data-testid="btn-order-lab">
          <i className="fas fa-plus" /> Order Lab
        </button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Order Date</th>
              <th>Ordered By</th>
              <th>Lab</th>
              <th>Result</th>
              <th>Result Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {LAB_ROWS.map((l, i) => (
              <tr key={i} data-testid={`row-lab-${i}`}>
                <td style={{ fontWeight: 600, color: "#111827" }}>{l.test}</td>
                <td style={{ color: "#6b7280" }}>{l.orderDate}</td>
                <td style={{ color: "#374151" }}>{l.orderedBy}</td>
                <td style={{ color: "#6b7280" }}>{l.lab}</td>
                <td style={{ color: l.result === "Normal" ? "#16a34a" : l.result === "Pending Review" ? "#d97706" : "#dc2626", fontWeight: 500 }}>
                  {l.result}
                </td>
                <td style={{ color: "#6b7280" }}>{l.resultDate}</td>
                <td>
                  <span className={`status-badge ${l.status === "Completed" ? "sb-completed" : "sb-pending"}`}>
                    {l.status}
                  </span>
                </td>
                <td>
                  <button className="tbl-action-btn" title="View" data-testid={`btn-lab-view-${i}`}><i className="fas fa-eye" /></button>
                  <button className="tbl-action-btn" title="Download"><i className="fas fa-download" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Medical Files ── */
function MedicalFilesContent() {
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Medical Files</h2>
          <p className="pat-section-desc">{MEDICAL_FILES.length} documents on file</p>
        </div>
        <button className="add-btn"><i className="fas fa-upload" /> Upload File</button>
      </div>
      {MEDICAL_FILES.map((f, i) => (
        <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <i className="fas fa-file-pdf" style={{ color: "#dc2626", fontSize: 18 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: "#111827", fontSize: 13.5 }}>{f.name}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
              {f.type} · {f.provider} · {f.date} · {f.size}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="tbl-action-btn" title="View"><i className="fas fa-eye" /></button>
            <button className="tbl-action-btn" title="Download"><i className="fas fa-download" /></button>
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Medications ── */
function MedicationsContent() {
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Medications</h2>
          <p className="pat-section-desc">{MEDS.length} active medications</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Add Medication</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead><tr><th>Medication</th><th>Frequency</th><th>Route</th><th>Start Date</th><th>Refills</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {MEDS.map((m, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>{m.freq}</td>
                <td>{m.route}</td>
                <td>{m.start}</td>
                <td>{m.refills}</td>
                <td><span className="status-badge sb-completed">{m.status}</span></td>
                <td>
                  <button className="tbl-action-btn" title="Edit"><i className="fas fa-edit" /></button>
                  <button className="tbl-action-btn" title="Discontinue"><i className="fas fa-times" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Allergies ── */
function AllergiesContent() {
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Allergies</h2>
          <p className="pat-section-desc">{ALLERGIES_LIST.length} known allergies</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Add Allergy</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead><tr><th>Allergen</th><th>Type</th><th>Reaction</th><th>Severity</th><th>Onset Year</th><th>Actions</th></tr></thead>
          <tbody>
            {ALLERGIES_LIST.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{a.allergen}</td>
                <td>{a.type}</td>
                <td>{a.reaction}</td>
                <td>
                  <span className={`status-badge ${a.severity === "Severe" ? "sb-overdue" : a.severity === "Moderate" ? "sb-pending" : "sb-submitted"}`}>
                    {a.severity}
                  </span>
                </td>
                <td>{a.onset}</td>
                <td>
                  <button className="tbl-action-btn" title="Edit"><i className="fas fa-edit" /></button>
                  <button className="tbl-action-btn" title="Delete"><i className="fas fa-trash" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Immunizations ── */
function ImmunizationsContent() {
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Immunizations</h2>
          <p className="pat-section-desc">{IMMUNIZATIONS.length} immunizations on record</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Add Immunization</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead><tr><th>Vaccine</th><th>Date Given</th><th>Administered By</th><th>Lot Number</th><th>Site</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {IMMUNIZATIONS.map((v, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{v.vaccine}</td>
                <td>{v.date}</td>
                <td>{v.administered}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{v.lot}</td>
                <td>{v.site}</td>
                <td><span className="status-badge sb-completed">{v.status}</span></td>
                <td>
                  <button className="tbl-action-btn" title="View"><i className="fas fa-eye" /></button>
                  <button className="tbl-action-btn" title="Print"><i className="fas fa-print" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Medical History ── */
function MedicalHistoryContent() {
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Medical History</h2>
          <p className="pat-section-desc">Past visits and encounters</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Add Record</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead><tr><th>Date</th><th>Visit Type</th><th>Provider</th><th>Diagnosis / Reason</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {MED_HISTORY.map((h, i) => (
              <tr key={i}>
                <td style={{ color: "#6b7280" }}>{h.date}</td>
                <td style={{ fontWeight: 600 }}>{h.type}</td>
                <td>{h.provider}</td>
                <td>{h.diagnosis}</td>
                <td><span className="status-badge sb-completed">{h.status}</span></td>
                <td>
                  <button className="tbl-action-btn" title="View Chart"><i className="fas fa-eye" /></button>
                  <button className="tbl-action-btn" title="Download"><i className="fas fa-download" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Main ── */
const ClinicalsTab: React.FC<Props> = ({ subTab, setSubTab }) => {
  const renderContent = () => {
    switch (subTab) {
      case "medical-files":   return <MedicalFilesContent />;
      case "medications":     return <MedicationsContent />;
      case "allergies":       return <AllergiesContent />;
      case "immunizations":   return <ImmunizationsContent />;
      case "medical-history": return <MedicalHistoryContent />;
      case "labs":
      default:                return <LabResultsContent />;
    }
  };

  return (
    <>
      <div className="pat-left-sidebar">
        {SIDEBAR_ITEMS.map(item => (
          <div
            key={item.key}
            className={`pat-sidebar-item ${subTab === item.key ? "active" : ""}`}
            onClick={() => setSubTab(item.key)}
            data-testid={`clin-sidebar-${item.key}`}
          >
            <i className={`fas ${item.icon}`} />
            {item.label}
          </div>
        ))}
      </div>
      <div className="pat-main-content">{renderContent()}</div>
    </>
  );
};

export default ClinicalsTab;
