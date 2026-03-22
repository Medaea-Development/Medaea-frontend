import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById, getPatientDetail, getPatientEncounter } from "../../api/patient";
import { calculateAge } from "../../utils/dateUtils";
import Loader from "../../components/ui/Loader";
import Footer from "../../components/layout/Footer";
import RegistrationTab from "./tabs/RegistrationTab";
import MessagingTab from "./tabs/MessagingTab";
import SchedulingTab from "./tabs/SchedulingTab";
import BillingTab from "./tabs/BillingTab";
import ClinicalsTab from "./tabs/ClinicalsTab";
import EncounterTab from "./tabs/EncounterTab";

const AV_COLORS = ["#0891b2", "#7c3aed", "#059669", "#dc2626", "#d97706", "#db2777"];
const avColor = (name: string) => AV_COLORS[(name?.charCodeAt(0) ?? 0) % AV_COLORS.length];

const WORKFLOW_STEPS = [
  { key: "checkin",   label: "Check In" },
  { key: "intake",    label: "Intake" },
  { key: "exam",      label: "Exam" },
  { key: "signoff",   label: "Sign Off" },
  { key: "checkout",  label: "Check Out" },
  { key: "billing",   label: "Billing" },
];

const MAIN_TABS = [
  { key: "registration", label: "Registration" },
  { key: "messaging",    label: "Messaging" },
  { key: "scheduling",   label: "Scheduling" },
  { key: "billing",      label: "Billing" },
  { key: "clinicals",    label: "Clinicals" },
];

const DEFAULT_SUBTABS: Record<string, string> = {
  registration: "privacy",
  messaging:    "inbox",
  scheduling:   "appointments",
  billing:      "bills",
  clinicals:    "labs",
};

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [encounterData, setEncounterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"details" | "encounter">("details");
  const [encounterStarted, setEncounterStarted] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState("checkin");
  const [mainTab, setMainTab] = useState("registration");
  const [subTabs, setSubTabs] = useState({ ...DEFAULT_SUBTABS });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getPatientById(id), getPatientDetail(id), getPatientEncounter(id)])
      .then(([pat, det, enc]) => { setPatient(pat); setDetail(det); setEncounterData(enc); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const setSubTab = (sub: string) =>
    setSubTabs(prev => ({ ...prev, [mainTab]: sub }));

  const subTab = subTabs[mainTab] ?? DEFAULT_SUBTABS[mainTab];

  const stepIndex = WORKFLOW_STEPS.findIndex(s => s.key === activeWorkflowStep);

  if (loading) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><Loader /></div>;
  if (!patient) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#6b7280" }}>
      <i className="fas fa-user-slash" style={{ fontSize: 40 }} />
      <p>Patient not found.</p>
      <button className="add-btn" onClick={() => navigate("/patient")}>Back to Search</button>
    </div>
  );

  const firstName = patient.first_name || patient.firstName || "?";
  const lastName  = patient.last_name  || patient.lastName  || "?";
  const initials  = `${firstName[0]}${lastName[0]}`;
  const bgColor   = avColor(lastName);
  const age       = patient.date_of_birth ? calculateAge(patient.date_of_birth) : (patient.age ?? "—");
  const unread    = (detail?.inbox || []).filter((m: any) => !m.read).length;

  return (
    <div className="patient-detail-page">
      {/* ── Header Bar ─────────────────────────────────────── */}
      <div className="patient-header-bar" data-testid="patient-header-bar">
        <div className="patient-header-av" style={{ background: bgColor }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="patient-header-name" data-testid="text-patient-name">
            {lastName.toUpperCase()}
          </div>
          <div className="patient-header-meta">
            {age}yo {patient.gender} · {patient.pronouns || ""} · DOB: {patient.date_of_birth || patient.dob || "—"} · ID: {patient.id_number || patient.mrn || "—"}
          </div>
          <div className="patient-header-chips">
            {[
              { icon: "fa-mobile-alt",    label: "Mobile",    val: patient.phone    || patient.mobile },
              { icon: "fa-calendar-alt",  label: "Next Appt", val: patient.next_appt || patient.nextAppt },
              { icon: "fa-user-md",       label: "Provider",  val: patient.provider },
              { icon: "fa-shield-alt",    label: "Insurance", val: patient.insurance },
              { icon: "fa-map-marker-alt",label: "Status",    val: patient.status },
              { icon: "fa-stethoscope",   label: "Encounter", val: patient.encounter },
            ].map(chip => (
              <span key={chip.label} className="pat-hchip">
                <i className={`fas ${chip.icon}`} />
                <span>
                  <span className="pat-hchip-label">{chip.label}</span>
                  <strong>{chip.val}</strong>
                </span>
              </span>
            ))}
          </div>

          {/* Workflow stepper — shown in encounter mode */}
          {viewMode === "encounter" && (
            <div className="enc-workflow-stepper">
              {WORKFLOW_STEPS.map((step, i) => {
                const isDone    = i < stepIndex;
                const isActive  = i === stepIndex;
                return (
                  <React.Fragment key={step.key}>
                    {i > 0 && <div className={`enc-step-line ${isDone ? "done" : ""}`} />}
                    <div
                      className={`enc-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
                      onClick={() => setActiveWorkflowStep(step.key)}
                    >
                      <div className="enc-step-dot" />
                      <div className="enc-step-label">{step.label}</div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        <div className="patient-header-right">
          <button
            className="btn-patient-detail"
            style={{ opacity: viewMode === "details" ? 1 : 0.7 }}
            onClick={() => setViewMode("details")}
            data-testid="btn-patient-details"
          >
            Patient Details
          </button>
          <button
            className={`btn-encounter-tab ${viewMode === "encounter" ? "active" : ""}`}
            onClick={() => setViewMode("encounter")}
            data-testid="btn-encounter"
          >
            Encounter
          </button>
          <button style={{ background: "none", border: "none", color: "#a0aec0", fontSize: 16, cursor: "pointer", padding: "4px 8px" }} data-testid="btn-notifications">
            <i className="fas fa-bell" />
          </button>
          <button style={{ background: "none", border: "none", color: "#a0aec0", fontSize: 16, cursor: "pointer", padding: "4px 8px" }} data-testid="btn-patient-menu">
            <i className="fas fa-ellipsis-v" />
          </button>
        </div>
      </div>

      {/* ── Patient Details Mode ────────────────────────────── */}
      {viewMode === "details" && (
        <>
          <div className="patient-main-tabs" role="tablist">
            {MAIN_TABS.map(tab => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={mainTab === tab.key}
                className={`pat-main-tab ${mainTab === tab.key ? "active" : ""}`}
                onClick={() => setMainTab(tab.key)}
                data-testid={`tab-${tab.key}`}
              >
                {tab.label}
                {tab.key === "messaging" && unread > 0 && (
                  <span style={{ marginLeft: 6, background: "#dc2626", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pat-content-area">
            {mainTab === "registration" && (
              <RegistrationTab detail={detail} subTab={subTab} setSubTab={setSubTab} />
            )}
            {mainTab === "messaging" && (
              <MessagingTab detail={detail} subTab={subTab} setSubTab={setSubTab} />
            )}
            {mainTab === "scheduling" && (
              <SchedulingTab detail={detail} subTab={subTab} setSubTab={setSubTab} />
            )}
            {mainTab === "billing" && (
              <BillingTab detail={detail} subTab={subTab} setSubTab={setSubTab} />
            )}
            {mainTab === "clinicals" && (
              <ClinicalsTab detail={detail} subTab={subTab} setSubTab={setSubTab} />
            )}
          </div>
        </>
      )}

      {/* ── Encounter Mode ──────────────────────────────────── */}
      {viewMode === "encounter" && (
        <EncounterTab
          patient={patient}
          encounterData={encounterData}
          started={encounterStarted}
          onStart={() => {
            setEncounterStarted(true);
            setActiveWorkflowStep("exam");
          }}
          onBack={() => {
            setEncounterStarted(false);
            setActiveWorkflowStep("checkin");
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default PatientDetailPage;
