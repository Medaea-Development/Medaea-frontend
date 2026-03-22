import React from "react";

interface Props { detail: any; subTab: string; setSubTab: (s: string) => void; }

const SIDEBAR_ITEMS = [
  { key: "appointments",  icon: "fa-calendar-check", label: "Appointments" },
  { key: "visitHistory",  icon: "fa-history",        label: "Visit History" },
  { key: "referrals",     icon: "fa-user-friends",   label: "Referrals" },
  { key: "waitlist",      icon: "fa-clock",          label: "Waitlist" },
  { key: "cancellations", icon: "fa-times-circle",   label: "Cancellations" },
];

const statusClass: Record<string, string> = {
  "Pending": "sb-pending", "Unconfirmed": "sb-unconfirmed", "Completed": "sb-completed",
  "Scheduled": "sb-scheduled", "Cancelled": "sb-cancelled", "Waiting": "sb-waiting",
  "Urgent": "sb-urgent", "High": "sb-high", "Normal": "sb-normal",
};

function AppointmentsContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Appointments</h2>
          <p className="pat-section-desc">{rows.length} upcoming appointment{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="export-btn"><i className="fas fa-download" /> Export</button>
          <button className="add-btn" data-testid="btn-add-appointment"><i className="fas fa-plus" /> Add Appointment</button>
        </div>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Visit Type</th><th>Clinician</th><th>Location</th>
              <th>Date</th><th>Duration</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} data-testid={`row-appt-${i}`}>
                <td style={{ fontWeight: 500 }}>{r.visitType}</td>
                <td>{r.clinician}</td>
                <td style={{ fontSize: 12 }}>{r.location}</td>
                <td>{r.date}</td>
                <td>{r.duration}</td>
                <td><span className={`status-badge ${statusClass[r.status] || ""}`}>{r.status}</span></td>
                <td>
                  <button className="tbl-action-btn" title="Edit"><i className="fas fa-edit" /></button>
                  <button className="tbl-action-btn" title="Cancel"><i className="fas fa-times" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function VisitHistoryContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Visit History</h2>
          <p className="pat-section-desc">{rows.length} past visits</p>
        </div>
        <button className="export-btn"><i className="fas fa-download" /> Export</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Date</th><th>Visit Type</th><th>Provider</th><th>Location</th>
              <th>Chief Complaint</th><th>Diagnosis</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} data-testid={`row-visit-${i}`}>
                <td>{r.date}</td>
                <td style={{ fontWeight: 500 }}>{r.type}</td>
                <td>{r.provider}</td>
                <td style={{ fontSize: 12 }}>{r.location}</td>
                <td style={{ fontSize: 12 }}>{r.complaint}</td>
                <td style={{ fontSize: 12 }}>{r.diagnosis}</td>
                <td><span className={`status-badge ${statusClass[r.status] || ""}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ReferralsContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Referrals</h2>
          <p className="pat-section-desc">{rows.length} referral{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> New Referral</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Date</th><th>Referring Provider</th><th>Specialist</th>
              <th>Specialty</th><th>Reason</th><th>Priority</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} data-testid={`row-referral-${i}`}>
                <td>{r.date}</td>
                <td>{r.referring}</td>
                <td style={{ fontWeight: 500 }}>{r.specialist}</td>
                <td>{r.specialty}</td>
                <td style={{ fontSize: 12 }}>{r.reason}</td>
                <td><span className={`status-badge ${r.priority === "Urgent" ? "sb-urgent" : r.priority === "High" ? "sb-high" : "sb-normal"}`}>{r.priority}</span></td>
                <td><span className={`status-badge ${statusClass[r.status] || ""}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WaitlistContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Waitlist</h2>
          <p className="pat-section-desc">{rows.length} patient{rows.length !== 1 ? "s" : ""} on waitlist</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Add to Waitlist</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Added Date</th><th>Preferred Date</th><th>Visit Type</th>
              <th>Provider</th><th>Location</th><th>Priority</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} data-testid={`row-waitlist-${i}`}>
                <td>{r.addedDate}</td>
                <td>{r.preferredDate}</td>
                <td style={{ fontWeight: 500 }}>{r.visitType}</td>
                <td>{r.provider}</td>
                <td style={{ fontSize: 12 }}>{r.location}</td>
                <td><span className={`status-badge ${r.priority === "High" ? "sb-high" : "sb-normal"}`}>{r.priority}</span></td>
                <td><span className="status-badge sb-waiting">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CancellationsContent({ data }: { data: any[] }) {
  const rows = data || [];
  return (
    <>
      <div className="pat-section-header">
        <div>
          <h2 className="pat-section-title">Cancellations</h2>
          <p className="pat-section-desc">{rows.length} cancelled appointment{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="export-btn"><i className="fas fa-download" /> Export</button>
      </div>
      <div className="pat-table-wrap">
        <table className="pat-table">
          <thead>
            <tr>
              <th>Original Date</th><th>Cancelled Date</th><th>Visit Type</th>
              <th>Provider</th><th>Reason</th><th>Cancelled By</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} data-testid={`row-cancel-${i}`}>
                <td>{r.originalDate}</td>
                <td>{r.cancelledDate}</td>
                <td style={{ fontWeight: 500 }}>{r.visitType}</td>
                <td>{r.provider}</td>
                <td style={{ fontSize: 12 }}>{r.reason}</td>
                <td><span className={`status-badge ${r.cancelledBy === "Patient" ? "sb-pending" : r.cancelledBy === "Provider" ? "sb-unconfirmed" : "sb-normal"}`}>{r.cancelledBy}</span></td>
                <td><span className="status-badge sb-cancelled">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const SchedulingTab: React.FC<Props> = ({ detail, subTab, setSubTab }) => {
  const renderContent = () => {
    if (subTab === "appointments")  return <AppointmentsContent data={detail?.appointments} />;
    if (subTab === "visitHistory")  return <VisitHistoryContent data={detail?.visitHistory} />;
    if (subTab === "referrals")     return <ReferralsContent data={detail?.referrals} />;
    if (subTab === "waitlist")      return <WaitlistContent data={detail?.waitlist} />;
    if (subTab === "cancellations") return <CancellationsContent data={detail?.cancellations} />;
    return null;
  };

  return (
    <>
      <div className="pat-left-sidebar">
        {SIDEBAR_ITEMS.map(item => (
          <div
            key={item.key}
            className={`pat-sidebar-item ${subTab === item.key ? "active" : ""}`}
            onClick={() => setSubTab(item.key)}
            data-testid={`sched-sidebar-${item.key}`}
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

export default SchedulingTab;
