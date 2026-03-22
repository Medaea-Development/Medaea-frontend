import React, { useState, useEffect, useRef } from "react";

interface Props {
  patient: any;
  encounterData: any;
  started: boolean;
  onStart: () => void;
  onBack: () => void;
}

const ENC_SUBTABS = [
  { key: "overview",   icon: "fa-th-large",      label: "Overview" },
  { key: "scribe",     icon: "fa-microphone",     label: "Scribe AI" },
  { key: "recordings", icon: "fa-history",        label: "Recording History" },
  { key: "review",     icon: "fa-clipboard-list", label: "Review" },
  { key: "patientDetails", icon: "fa-user",       label: "Patient Details" },
  { key: "intake",     icon: "fa-file-medical",   label: "Intake Form" },
  { key: "vitals",     icon: "fa-heartbeat",      label: "Vitals" },
  { key: "labs",       icon: "fa-vial",           label: "Labs" },
  { key: "allergies",  icon: "fa-allergies",      label: "Allergies" },
];

/* ── Overview ── */
function OverviewContent({ patient, enc }: { patient: any; enc: any }) {
  const firstName = patient?.first_name || "Patient";
  const lastName  = patient?.last_name || "";
  const dob       = patient?.date_of_birth || "—";
  const age       = patient?.age || (dob !== "—" ? calcAge(dob) : "—");
  const phone     = patient?.phone || "—";
  const email     = patient?.email || "—";
  const provider  = patient?.provider || "—";
  const insurance = patient?.insurance || "—";
  const id_number = patient?.id_number || "—";

  const allergies  = enc?.allergies || [];
  const meds       = enc?.medications || [];
  const conditions = enc?.conditions || [];

  return (
    <div className="enc-overview">
      <div className="enc-compliance-banner">
        <div className="enc-compliance-left">
          <div className="enc-compliance-icon"><i className="fas fa-shield-alt" /></div>
          <div>
            <div className="enc-compliance-title">ONC-Certified EHR Compliant</div>
            <div className="enc-compliance-sub">2015 Edition Cures Update | USCDI v3</div>
          </div>
        </div>
        <div className="enc-dq-score">
          <div className="enc-dq-label">Data Quality Score</div>
          <div className="enc-dq-value">
            <i className="fas fa-check-circle" style={{ color: "#10b981", marginRight: 6 }} />
            {enc?.dataQualityScore || 98}%
          </div>
        </div>
      </div>

      <div className="enc-patient-card">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div className="enc-patient-avatar">
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#6b7280" }}>
              <i className="fas fa-user" />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span className="enc-onc-chip">ONC REQUIRED</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>170.315(a)(5) · Demographics</span>
            </div>
            <div className="enc-pat-name">{firstName} {lastName}</div>
            <div className="enc-pat-meta">
              <span><i className="fas fa-user" style={{ marginRight: 4 }} />{age} years, {patient?.gender || "—"}</span>
              <span><i className="fas fa-calendar-alt" style={{ marginRight: 4 }} />DOB: {dob}</span>
              <span><i className="fas fa-phone" style={{ marginRight: 4 }} />{phone}</span>
              <span><i className="fas fa-envelope" style={{ marginRight: 4 }} />{email}</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="enc-ins-badge"><i className="fas fa-circle" style={{ fontSize: 7, color: "#10b981", marginRight: 5 }} />{insurance} · Active</span>
            </div>
          </div>
          <button className="enc-mrn-btn">MRN</button>
        </div>
      </div>

      <div className="enc-cards-row">
        <div className="enc-summary-card enc-allergy-card">
          <div className="enc-summary-header">
            <div className="enc-summary-icon enc-icon-red"><i className="fas fa-allergies" /></div>
            <div className="enc-summary-title">ALLERGIES</div>
            <span className="enc-required-chip">REQUIRED</span>
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>170.315(a) · Drug-Allergy List</div>
          {allergies.slice(0, 2).map((a: any, i: number) => (
            <div key={i} className={`enc-allergy-item ${a.severity.toLowerCase()}`}>
              <div className="enc-allergy-name">{a.name}</div>
              <div className="enc-allergy-note">{a.severity} · {a.reaction.split(",")[0]}</div>
            </div>
          ))}
          <button className="enc-view-all-btn">View All ({allergies.length})</button>
        </div>

        <div className="enc-summary-card enc-med-card">
          <div className="enc-summary-header">
            <div className="enc-summary-icon enc-icon-blue"><i className="fas fa-pills" /></div>
            <div className="enc-summary-title">MEDICATIONS</div>
            <span className="enc-required-chip">REQUIRED</span>
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>170.315(a)(7) · Medication List</div>
          {meds.slice(0, 2).map((m: any, i: number) => (
            <div key={i} className="enc-med-item">
              <div className="enc-med-name">{m.name}</div>
              <div className="enc-med-note">{m.sig} · {m.status}</div>
            </div>
          ))}
          <button className="enc-view-all-btn">View All ({meds.length})</button>
        </div>

        <div className="enc-summary-card enc-cond-card">
          <div className="enc-summary-header">
            <div className="enc-summary-icon enc-icon-purple"><i className="fas fa-stethoscope" /></div>
            <div className="enc-summary-title">CONDITIONS</div>
            <span className="enc-required-chip">REQUIRED</span>
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>170.315(a)(5) · Problem List</div>
          {conditions.slice(0, 2).map((c: any, i: number) => (
            <div key={i} className="enc-cond-item">
              <div className="enc-cond-name">{c.name}</div>
              <div className="enc-cond-note">{c.note}</div>
            </div>
          ))}
          <button className="enc-view-all-btn">View All ({conditions.length})</button>
        </div>
      </div>
    </div>
  );
}

/* ── Scribe AI ── */
function ScribeContent({ enc }: { enc: any }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const totalRecordings = enc?.recordingHistory?.length || 4;

  return (
    <div className="enc-scribe">
      <h2 className="enc-scribe-title">AI Scribe - Voice Recording</h2>
      <p className="enc-scribe-sub">Start the conversation to automatically generate transcript and SOAP notes</p>
      <div className="enc-timer-box">
        <i className="fas fa-clock" style={{ color: "#0891b2", marginRight: 8 }} />
        {mm}:{ss}
      </div>
      <button
        className={`enc-mic-btn ${recording ? "recording" : ""}`}
        onClick={() => setRecording(r => !r)}
        data-testid="btn-mic"
      >
        <i className="fas fa-microphone" />
      </button>
      <button
        className={`enc-record-btn ${recording ? "stop" : ""}`}
        onClick={() => setRecording(r => !r)}
        data-testid="btn-record"
      >
        <i className={`fas ${recording ? "fa-stop-circle" : "fa-circle"}`} style={{ marginRight: 8 }} />
        {recording ? "Stop Recording" : "Click to Start Recording"}
      </button>
      <div className="enc-ready-card">
        <div className="enc-ready-icon"><i className="fas fa-microphone-alt" /></div>
        <div>
          <div className="enc-ready-title">{recording ? "Recording in Progress..." : "Ready to Record"}</div>
          <div className="enc-ready-desc">
            {recording
              ? "AI is transcribing the conversation and will generate SOAP notes automatically."
              : "Click the microphone button to start recording the patient encounter. The AI will automatically transcribe and generate SOAP notes."}
          </div>
        </div>
      </div>
      <button className="enc-history-link" data-testid="btn-view-history">
        <i className="fas fa-history" style={{ marginRight: 8, color: "#0891b2" }} />
        View Recording History ({totalRecordings} visits)
      </button>
    </div>
  );
}

/* ── Recording History ── */
function RecordingsContent({ enc }: { enc: any }) {
  const recordings = enc?.recordingHistory || [];
  return (
    <div className="enc-recordings">
      <div className="enc-recordings-banner">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="enc-rec-banner-icon"><i className="fas fa-history" /></div>
          <div>
            <div className="enc-rec-banner-title">Recording History</div>
            <div className="enc-rec-banner-sub">AI Scribe visit recordings and clinical documentation</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="enc-rec-count">{recordings.length}</div>
          <div className="enc-rec-count-label">Total Recordings</div>
        </div>
      </div>
      <div className="enc-rec-toolbar">
        <div className="enc-rec-search">
          <i className="fas fa-search" style={{ color: "#9ca3af", marginRight: 8 }} />
          <input placeholder="Search by visit type, diagnosis, or date..." />
        </div>
        <button className="add-btn"><i className="fas fa-upload" style={{ marginRight: 6 }} />Export All</button>
      </div>
      {recordings.map((r: any) => (
        <div key={r.id} className="enc-rec-card">
          <div className="enc-rec-card-header">
            <div>
              <div className="enc-rec-visit-type">
                {r.visitType}
                <span className={`enc-rec-status ${r.status.toLowerCase()}`}>{r.status}</span>
              </div>
              <div className="enc-rec-desc">{r.description}</div>
              <div className="enc-rec-meta">
                <span><i className="fas fa-calendar-alt" /> {r.date}</span>
                <span><i className="fas fa-clock" /> {r.time}</span>
                <span><i className="fas fa-play-circle" /> {r.duration}</span>
                <span><i className="fas fa-user-md" /> {r.provider}</span>
              </div>
            </div>
            <button className="add-btn" style={{ flexShrink: 0 }}>
              <i className="fas fa-eye" style={{ marginRight: 6 }} />View Details
            </button>
          </div>
          <div className="enc-rec-stats">
            <div className="enc-rec-stat">
              <div className="enc-rec-stat-val">{r.stats.transcript.toLocaleString()}</div>
              <div className="enc-rec-stat-label">Transcript<br />words</div>
            </div>
            <div className="enc-rec-stat enc-rec-stat-blue">
              <div className="enc-rec-stat-val">{r.stats.clinicalNotes}</div>
              <div className="enc-rec-stat-label">Clinical Notes<br />notes</div>
            </div>
            <div className="enc-rec-stat enc-rec-stat-yellow">
              <div className="enc-rec-stat-val">{r.stats.actionItems}</div>
              <div className="enc-rec-stat-label">Action Items<br />tasks</div>
            </div>
            <div className="enc-rec-stat enc-rec-stat-green">
              <div className="enc-rec-stat-val">{r.stats.soapNotes}%</div>
              <div className="enc-rec-stat-label">SOAP Notes<br />complete</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Clinical Review ── */
function ReviewContent({ enc }: { enc: any }) {
  const diagnoses = enc?.clinicalReview?.diagnoses || [];
  return (
    <div className="enc-review">
      <div className="enc-review-banner">
        <div className="enc-review-banner-icon"><i className="fas fa-clipboard-list" /></div>
        <div>
          <div className="enc-review-banner-title">Clinical Review</div>
          <div className="enc-review-banner-sub">Comprehensive documentation and billing overview</div>
        </div>
      </div>
      <div className="enc-review-section">
        <div className="enc-review-section-header">
          <div className="enc-review-section-icon"><i className="fas fa-file-medical" /></div>
          <div>
            <div className="enc-review-section-title">Diagnosis Codes</div>
            <div className="enc-review-section-sub">ICD-10 codes and clinical diagnoses</div>
          </div>
          <button className="add-btn" style={{ marginLeft: "auto" }}>
            <i className="fas fa-plus" style={{ marginRight: 6 }} />Add Diagnosis
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
          Diagnosis Codes (ICD-10 &amp; CPT) · Total: {diagnoses.length} diagnoses
        </div>
        <div className="enc-review-table-wrap">
          <table className="enc-review-table">
            <thead>
              <tr>
                <th>DIAGNOSIS *</th><th>ICD-10 *</th><th>CPT CODE</th>
                <th>SEVERITY</th><th>STATUS *</th><th>ERRORS</th><th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {diagnoses.map((d: any, i: number) => (
                <tr key={i} data-testid={`row-dx-${i}`}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <select className="enc-diag-select" defaultValue={d.name}>
                        <option>{d.name}</option>
                      </select>
                      <button className="enc-info-btn"><i className="fas fa-info-circle" /></button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <select className="enc-code-select" defaultValue={d.icd10}><option>{d.icd10}</option></select>
                      <i className="fas fa-chevron-down" style={{ fontSize: 10, color: "#9ca3af" }} />
                    </div>
                  </td>
                  <td>
                    <select className="enc-code-select" defaultValue={d.cptCode}><option>{d.cptCode}</option></select>
                  </td>
                  <td>
                    <span className={`enc-severity-badge ${d.severity.toLowerCase()}`}>
                      + {d.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`enc-status-badge ${d.status.toLowerCase()}`}>
                      + {d.status}
                    </span>
                  </td>
                  <td>
                    <span className="enc-error-none">{d.errors}</span>
                  </td>
                  <td>
                    <select className="enc-code-select"><option>Select Action</option><option>Edit</option><option>Delete</option></select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="enc-review-pagination">
          <span style={{ fontSize: 12, color: "#6b7280" }}>Showing 1 to {diagnoses.length} of {diagnoses.length}</span>
          <div className="enc-pag-btns">
            <button className="enc-pag-btn" disabled><i className="fas fa-chevron-left" /></button>
            <button className="enc-pag-btn active">1</button>
            <button className="enc-pag-btn"><i className="fas fa-chevron-right" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Patient Details ── */
function PatientDetailsContent({ patient }: { patient: any }) {
  const p = patient || {};
  const age = p.date_of_birth ? calcAge(p.date_of_birth) : "—";
  return (
    <div className="enc-pat-details">
      <div className="enc-pat-info-card">
        <div className="enc-pat-info-avatar">
          <div style={{ width: 72, height: 72, borderRadius: 10, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#6b7280" }}>
            <i className="fas fa-user" />
          </div>
        </div>
        <div className="enc-pat-info-main">
          <div className="enc-pat-info-name">{p.first_name} {p.last_name}</div>
          <div className="enc-pat-info-grid">
            <div>
              <div className="enc-pat-info-label">Date of Birth</div>
              <div className="enc-pat-info-val">{p.date_of_birth || "—"}</div>
            </div>
            <div>
              <div className="enc-pat-info-label">Age</div>
              <div className="enc-pat-info-val">{age} years</div>
            </div>
            <div>
              <div className="enc-pat-info-label">Patient ID</div>
              <div className="enc-pat-info-val">{p.id_number || "—"}</div>
            </div>
            <div>
              <div className="enc-pat-info-label">Pronouns</div>
              <div className="enc-pat-info-val">{p.pronouns || "—"}</div>
            </div>
            <div>
              <div className="enc-pat-info-label">Gender</div>
              <div className="enc-pat-info-val">{p.gender || "—"}</div>
            </div>
            <div>
              <div className="enc-pat-info-label">Contact</div>
              <div className="enc-pat-info-val">{p.phone || "—"}</div>
            </div>
          </div>
          <div className="enc-pat-info-row2">
            <div>
              <div className="enc-pat-info-label">Email</div>
              <div className="enc-pat-info-val">{p.email || "—"}</div>
            </div>
            <div>
              <div className="enc-pat-info-label">Provider</div>
              <div className="enc-pat-info-val">{p.provider || "—"}</div>
            </div>
            <div>
              <div className="enc-pat-info-label">Insurance</div>
              <div className="enc-pat-info-val">{p.insurance || "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Intake Form ── */
function IntakeFormContent({ enc }: { enc: any }) {
  const form = enc?.intakeForm || {};
  const ros  = form.reviewOfSystems || [];
  return (
    <div className="enc-intake">
      <div className="enc-intake-section">
        <div className="enc-intake-section-title">Chief Complaint</div>
        <div className="enc-intake-text">{form.chiefComplaint || "—"}</div>
      </div>
      <div className="enc-intake-section">
        <div className="enc-intake-section-title">History of Present Illness</div>
        <div className="enc-intake-text">{form.hpi || "—"}</div>
      </div>
      <div className="enc-intake-section">
        <div className="enc-intake-section-title">Review of Systems</div>
        <div className="enc-ros-grid">
          {ros.map((r: any, i: number) => (
            <div key={i} className="enc-ros-item">
              <i className="fas fa-check-circle enc-ros-check" />
              <div>
                <div className="enc-ros-system">{r.system}</div>
                <div className="enc-ros-note">{r.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Vitals ── */
function VitalsContent({ enc }: { enc: any }) {
  const cv = enc?.vitals?.current || {};
  const history = enc?.vitals?.history || [];

  const vitalCards = [
    { label: "Blood Pressure", key: "bloodPressure", icon: "fa-heartbeat" },
    { label: "Heart Rate",     key: "heartRate",     icon: "fa-heart" },
    { label: "Temperature",    key: "temperature",   icon: "fa-thermometer-half" },
    { label: "Respiratory Rate", key: "respiratoryRate", icon: "fa-lungs" },
    { label: "O2 Saturation",  key: "o2Saturation",  icon: "fa-tint" },
    { label: "Weight",         key: "weight",        icon: "fa-weight" },
    { label: "Height",         key: "height",        icon: "fa-ruler-vertical" },
    { label: "BMI",            key: "bmi",           icon: "fa-chart-line" },
    { label: "Pain Level",     key: "painLevel",     icon: "fa-exclamation-triangle" },
  ];

  return (
    <div className="enc-vitals">
      <div className="enc-vitals-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="fas fa-heartbeat" style={{ color: "#0891b2" }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Current Vital Signs</span>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          <i className="fas fa-clock" style={{ marginRight: 4 }} />{cv.recordedAt} · {cv.recordedBy}
        </div>
      </div>
      <div className="enc-vitals-grid">
        {vitalCards.map(vc => {
          const d = cv[vc.key] || {};
          const isOverweight = d.status === "Overweight";
          const isMild = d.status === "Mild";
          return (
            <div key={vc.key} className={`enc-vital-card ${isOverweight ? "warning" : isMild ? "mild" : ""}`}>
              <div className="enc-vital-card-header">
                <span className="enc-vital-label">{vc.label}</span>
                <i className={`fas ${vc.icon} enc-vital-icon`} />
              </div>
              <div className="enc-vital-value">
                {d.value || "—"}
                <span className="enc-vital-unit">{d.unit}</span>
              </div>
              <div className={`enc-vital-status ${isOverweight ? "warning" : isMild ? "mild" : "normal"}`}>
                {d.status || "Normal"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="enc-vitals-history">
        <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>Vital Signs History</div>
        <table className="pat-table" style={{ background: "#fff" }}>
          <thead>
            <tr>
              <th>Date</th><th>Blood Pressure</th><th>Heart Rate</th>
              <th>Temperature</th><th>SpO2</th><th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h: any, i: number) => (
              <tr key={i}>
                <td>{h.date}</td>
                <td>{h.bloodPressure}</td>
                <td>{h.heartRate}</td>
                <td>{h.temperature}</td>
                <td>{h.spO2}</td>
                <td>{h.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Labs ── */
function LabsContent({ enc }: { enc: any }) {
  const labs = enc?.labs || [];
  return (
    <div className="enc-labs">
      {labs.map((panel: any, pi: number) => (
        <div key={pi} className="enc-lab-panel">
          <div className="enc-lab-panel-header">
            <div className="enc-lab-panel-title">
              {panel.panel}
              <span className="enc-lab-ordered">Ordered: {panel.orderedDate} · Results: {panel.resultsDate} · {panel.orderedBy}</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="status-badge sb-completed">{panel.status}</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>{panel.lab}</span>
            </div>
          </div>
          {panel.results.map((r: any, ri: number) => (
            <div key={ri} className={`enc-lab-row ${ri % 2 === 0 ? "" : "alt"}`}>
              <div>
                <div className="enc-lab-name">{r.name}</div>
                <div className="enc-lab-ref">Reference: {r.reference}</div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div className="enc-lab-value-wrap">
                  <span className={`enc-lab-value ${r.status.toLowerCase()}`}>{r.value}</span>
                  <span className="enc-lab-unit">{r.unit}</span>
                </div>
                <span className={`enc-lab-status ${r.status.toLowerCase()}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Allergies ── */
function AllergiesContent({ enc }: { enc: any }) {
  const allergies = enc?.allergies || [];
  return (
    <div className="enc-allergies">
      {allergies.map((a: any, i: number) => (
        <div key={i} className={`enc-allergy-card-full severity-${a.severity.toLowerCase()}`}>
          <div className="enc-allergy-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-exclamation-triangle" style={{ color: a.severity === "Severe" ? "#dc2626" : "#f59e0b" }} />
              <span className="enc-allergy-card-name">{a.name}</span>
              <span className={`enc-severity-tag ${a.severity.toLowerCase()}`}>{a.severity}</span>
            </div>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Type: {a.type}</span>
          </div>
          <div className="enc-allergy-reaction-box">
            <div className="enc-allergy-box-label">Reaction:</div>
            <div className="enc-allergy-box-text">{a.reaction}</div>
          </div>
          <div className="enc-allergy-meta-row">
            <div>
              <div className="enc-allergy-meta-label">Onset Date</div>
              <div className="enc-allergy-meta-val">{a.onsetDate}</div>
            </div>
            <div>
              <div className="enc-allergy-meta-label">Verified By</div>
              <div className="enc-allergy-meta-val">{a.verifiedBy}</div>
            </div>
          </div>
          <div className="enc-allergy-note-box blue">
            <i className="fas fa-info-circle" style={{ color: "#0891b2", marginRight: 6 }} />
            <span>Clinical Notes: <span style={{ color: "#0891b2" }}>{a.clinicalNotes}</span></span>
          </div>
          <div className="enc-allergy-note-box green">
            <span>Safe Alternatives: <span style={{ color: "#10b981" }}>{a.safeAlternatives}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Utility ── */
function calcAge(dob: string): number {
  const d = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  if (today < new Date(today.getFullYear(), d.getMonth(), d.getDate())) age--;
  return age;
}

/* ── Main EncounterTab ── */
const EncounterTab: React.FC<Props> = ({ patient, encounterData, started, onStart, onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  const renderContent = () => {
    switch (activeSubTab) {
      case "overview":       return <OverviewContent patient={patient} enc={encounterData} />;
      case "scribe":         return <ScribeContent enc={encounterData} />;
      case "recordings":     return <RecordingsContent enc={encounterData} />;
      case "review":         return <ReviewContent enc={encounterData} />;
      case "patientDetails": return <PatientDetailsContent patient={patient} />;
      case "intake":         return <IntakeFormContent enc={encounterData} />;
      case "vitals":         return <VitalsContent enc={encounterData} />;
      case "labs":           return <LabsContent enc={encounterData} />;
      case "allergies":      return <AllergiesContent enc={encounterData} />;
      default:               return <OverviewContent patient={patient} enc={encounterData} />;
    }
  };

  if (!started) {
    return (
      <div className="enc-start-screen">
        <button className="enc-start-btn" onClick={onStart} data-testid="btn-start-encounter">
          Start
        </button>
      </div>
    );
  }

  return (
    <div className="enc-started-layout">
      <div className="enc-action-bar">
        <button className="enc-back-btn" onClick={onBack} data-testid="btn-enc-back">
          <i className="fas fa-chevron-left" style={{ marginRight: 6 }} />Back
        </button>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <button className="enc-fullview-btn">Full View</button>
          <button className="enc-complete-btn" data-testid="btn-complete-exam">
            Complete Exam <i className="fas fa-arrow-right" style={{ marginLeft: 6 }} />
          </button>
        </div>
      </div>
      <div className="enc-subtab-bar">
        {ENC_SUBTABS.map(t => (
          <button
            key={t.key}
            className={`enc-subtab ${activeSubTab === t.key ? "active" : ""}`}
            onClick={() => setActiveSubTab(t.key)}
            data-testid={`enc-tab-${t.key}`}
          >
            <i className={`fas ${t.icon}`} style={{ marginRight: 5, fontSize: 11 }} />
            {t.label}
          </button>
        ))}
      </div>
      <div className="enc-content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default EncounterTab;
