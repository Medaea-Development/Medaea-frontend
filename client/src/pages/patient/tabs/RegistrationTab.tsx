import React, { useState } from "react";

interface Props { detail: any; subTab: string; setSubTab: (s: string) => void; }

const SIDEBAR_ITEMS = [
  { key: "privacy",           icon: "fa-lock",          label: "Privacy" },
  { key: "identification",    icon: "fa-id-card",       label: "Identification Provider" },
  { key: "contact",           icon: "fa-phone-alt",     label: "Contact" },
  { key: "emergency",         icon: "fa-user-clock",    label: "Emergency Contact Details" },
  { key: "demographics",      icon: "fa-user",          label: "Demographics" },
  { key: "additional",        icon: "fa-file-alt",      label: "Additional Information's" },
  { key: "correspondence",    icon: "fa-envelope",      label: "Correspondence" },
  { key: "insurances",        icon: "fa-file-invoice",  label: "Insurances" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-track" />
    </label>
  );
}

function PrivacyContent({ data }: { data: any }) {
  const [vals, setVals] = useState(data || {
    privacyNoticeAck: false, releaseBilling: false, releaseMedical: false,
    shareHealthcare: false, shareInsurance: false, hie: false,
  });
  const toggle = (k: string) => setVals((v: any) => ({ ...v, [k]: !v[k] }));
  const items = [
    { key: "privacyNoticeAck", label: "Privacy Notice Acknowledgement", desc: "Patient has acknowledged receipt of the privacy notice" },
    { key: "releaseBilling",   label: "Release of Billing Information", desc: "Authorize release of billing information to insurers" },
    { key: "releaseMedical",   label: "Release of Medical Records", desc: "Authorize release of medical records to treating providers" },
    { key: "shareHealthcare",  label: "Share Healthcare Information", desc: "Allow sharing of health information for care coordination" },
    { key: "shareInsurance",   label: "Share Insurance Information", desc: "Allow sharing of insurance details with affiliated providers" },
    { key: "hie",              label: "Health Info Exchange (HIE)", desc: "Consent to participate in health information exchange" },
  ];
  return (
    <>
      <h2 className="reg-section-title">Privacy Settings</h2>
      <p className="reg-section-desc">Manage patient privacy preferences and consent authorizations.</p>
      <div className="privacy-grid">
        {items.map(item => (
          <div key={item.key} className="privacy-item">
            <div className="privacy-item-info">
              <h4>{item.label}</h4>
              <p>{item.desc}</p>
            </div>
            <Toggle checked={!!vals[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
        <button className="export-btn">Cancel</button>
        <button className="add-btn"><i className="fas fa-save" /> Save Changes</button>
      </div>
    </>
  );
}

function IdentificationContent({ data }: { data: any }) {
  const d = data || {};
  return (
    <>
      <h2 className="reg-section-title">Identification Provider</h2>
      <p className="reg-section-desc">Patient identification and personal information.</p>
      <div className="reg-card">
        <div className="reg-card-title">Personal Information</div>
        <div className="reg-form-grid cols-3" style={{ marginBottom: 16 }}>
          {[["First Name","firstName"],["Last Name","lastName"],["Middle Name","middleName"],["Suffix","suffix"],["Date of Birth","dob"],["SSN","ssn"],["Gender","gender"],["Marital Status","maritalStatus"]].map(([lbl, fld]) => (
            <div key={fld} className="reg-field">
              <label className="reg-label">{lbl}</label>
              <input className="reg-input" defaultValue={d[fld] || ""} />
            </div>
          ))}
        </div>
      </div>
      <div className="reg-card">
        <div className="reg-card-title">Government ID</div>
        <div className="reg-form-grid">
          {[["ID Type","idType"],["ID Number","idNumber"],["Issuing State","issuingState"],["Expiry Date","expiryDate"]].map(([lbl, fld]) => (
            <div key={fld} className="reg-field">
              <label className="reg-label">{lbl}</label>
              <input className="reg-input" defaultValue={d[fld] || ""} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button className="export-btn">Cancel</button>
        <button className="add-btn"><i className="fas fa-save" /> Save Changes</button>
      </div>
    </>
  );
}

function ContactContent({ data }: { data: any }) {
  const d = data || {};
  return (
    <>
      <h2 className="reg-section-title">Contact Information</h2>
      <p className="reg-section-desc">Primary contact details and communication preferences.</p>
      <div className="reg-card">
        <div className="reg-card-title">Phone & Email</div>
        <div className="reg-form-grid">
          {[["Primary Phone","primaryPhone"],["Phone Type","phoneType"],["Email Address","email"]].map(([lbl, fld]) => (
            <div key={fld} className="reg-field">
              <label className="reg-label">{lbl}</label>
              <input className="reg-input" defaultValue={d[fld] || ""} />
            </div>
          ))}
          <div className="reg-field">
            <label className="reg-label">Communication Preferences</label>
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <input type="checkbox" defaultChecked={d.allowEmail} /> Allow Email
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <input type="checkbox" defaultChecked={d.allowSms} /> Allow SMS
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="reg-card">
        <div className="reg-card-title">Mailing Address</div>
        <div className="reg-form-grid">
          {[["Address Line 1","addressLine1"],["Address Line 2","addressLine2"],["City","city"],["State","state"],["ZIP Code","zip"]].map(([lbl, fld]) => (
            <div key={fld} className="reg-field">
              <label className="reg-label">{lbl}</label>
              <input className="reg-input" defaultValue={d[fld] || ""} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button className="export-btn">Cancel</button>
        <button className="add-btn"><i className="fas fa-save" /> Save Changes</button>
      </div>
    </>
  );
}

function EmergencyContent({ data }: { data: any[] }) {
  const contacts = data || [];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 className="reg-section-title">Emergency Contact Details</h2>
          <p className="reg-section-desc" style={{ margin: 0 }}>Emergency contacts and authorized representatives.</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Add Contact</button>
      </div>
      {contacts.map((c, i) => (
        <div key={i} className="emerg-contact-card">
          <div className="emerg-contact-header">
            <div className="emerg-contact-title">{i === 0 ? "Primary Emergency Contact" : "Secondary Emergency Contact"}</div>
            <span className={i === 0 ? "priority-1" : "priority-2"}>Priority {c.priority}</span>
          </div>
          <div className="reg-form-grid">
            {[["Full Name",c.fullName],["Relationship",c.relationship],["Phone Number",c.phone],["Email Address",c.email]].map(([lbl, val]) => (
              <div key={lbl as string} className="reg-field">
                <label className="reg-label">{lbl}</label>
                <input className="reg-input" defaultValue={val || ""} />
              </div>
            ))}
            <div className="reg-field" style={{ gridColumn: "1/-1" }}>
              <label className="reg-label">Address</label>
              <input className="reg-input" defaultValue={c.address || ""} />
            </div>
            <div className="reg-field">
              <label className="reg-label">Power of Attorney</label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 13 }}>
                <input type="checkbox" defaultChecked={c.poa} /> Has Power of Attorney
              </label>
            </div>
          </div>
        </div>
      ))}
      <button className="add-contact-btn"><i className="fas fa-plus" style={{ marginRight: 6 }} />Add Emergency Contact</button>
    </>
  );
}

function DemographicsContent({ data }: { data: any }) {
  const d = data || {};
  return (
    <>
      <h2 className="reg-section-title">Demographics</h2>
      <p className="reg-section-desc">Patient demographic information for reporting and care.</p>
      <div className="reg-card">
        <div className="reg-form-grid">
          {[["Race","race"],["Ethnicity","ethnicity"],["Primary Language","primaryLanguage"],["Secondary Language","secondaryLanguage"],["Religion","religion"]].map(([lbl, fld]) => (
            <div key={fld} className="reg-field">
              <label className="reg-label">{lbl}</label>
              <input className="reg-input" defaultValue={d[fld] || ""} />
            </div>
          ))}
          <div className="reg-field">
            <label className="reg-label">Interpreter Needed</label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 13 }}>
              <input type="checkbox" defaultChecked={d.needsInterpreter} /> Requires Interpreter
            </label>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button className="export-btn">Cancel</button>
        <button className="add-btn"><i className="fas fa-save" /> Save Changes</button>
      </div>
    </>
  );
}

function AdditionalContent({ data }: { data: any }) {
  const d = data || {};
  return (
    <>
      <h2 className="reg-section-title">Additional Information</h2>
      <p className="reg-section-desc">Employment status and contact time preferences.</p>
      <div className="reg-card">
        <div className="reg-form-grid">
          {[["Employment Status","employmentStatus"],["Employer Name","employer"],["Occupation","occupation"],["Best Time to Call","bestTimeToCall"],["Preferred Contact Method","preferredContact"]].map(([lbl, fld]) => (
            <div key={fld} className="reg-field">
              <label className="reg-label">{lbl}</label>
              <input className="reg-input" defaultValue={d[fld] || ""} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button className="export-btn">Cancel</button>
        <button className="add-btn"><i className="fas fa-save" /> Save Changes</button>
      </div>
    </>
  );
}

function CorrespondenceContent({ data }: { data: any }) {
  const [vals, setVals] = useState(data || {
    appointmentReminders: false, labResults: false, prescriptionRefills: false,
    billingStatements: false, healthTips: false,
  });
  const toggle = (k: string) => setVals((v: any) => ({ ...v, [k]: !v[k] }));
  const items = [
    { key: "appointmentReminders", label: "Appointment Reminders", desc: "Receive reminders for upcoming appointments via preferred channel" },
    { key: "labResults",           label: "Lab Results", desc: "Receive notifications when new lab results are available" },
    { key: "prescriptionRefills",  label: "Prescription Refills", desc: "Receive alerts when prescriptions are due for refill" },
    { key: "billingStatements",    label: "Billing Statements", desc: "Receive billing statements and payment reminders" },
    { key: "healthTips",           label: "Health Tips & Newsletters", desc: "Receive general health information and wellness tips" },
  ];
  return (
    <>
      <h2 className="reg-section-title">Correspondence Preferences</h2>
      <p className="reg-section-desc">Configure patient communication and notification preferences.</p>
      {items.map(item => (
        <div key={item.key} className="privacy-item" style={{ marginBottom: 8 }}>
          <div className="privacy-item-info">
            <h4>{item.label}</h4>
            <p>{item.desc}</p>
          </div>
          <Toggle checked={!!vals[item.key]} onChange={() => toggle(item.key)} />
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
        <button className="export-btn">Cancel</button>
        <button className="add-btn"><i className="fas fa-save" /> Save Changes</button>
      </div>
    </>
  );
}

function InsurancesContent({ data }: { data: any }) {
  const d = data || {};
  const pri = d.primary || {};
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 className="reg-section-title">Insurances</h2>
          <p className="reg-section-desc" style={{ margin: 0 }}>Patient insurance coverage and policy information.</p>
        </div>
        <button className="add-btn"><i className="fas fa-plus" /> Add Insurance</button>
      </div>
      <div className="insurance-card">
        <div className="insurance-header">
          <span className="insurance-title">Primary Insurance</span>
          <span className={`status-badge ${pri.status?.toLowerCase() === "active" ? "sb-scheduled" : "sb-unpaid"}`}>{pri.status || "Active"}</span>
        </div>
        <div className="reg-form-grid">
          {[["Insurance Provider","provider"],["Policy Number","policyNumber"],["Group Number","groupNumber"],["Effective Date","effectiveDate"],["Subscriber Name","subscriberName"]].map(([lbl, fld]) => (
            <div key={fld} className="reg-field">
              <label className="reg-label">{lbl}</label>
              <input className="reg-input" defaultValue={pri[fld] || ""} />
            </div>
          ))}
        </div>
      </div>
      {d.secondary ? (
        <div className="insurance-card">
          <div className="insurance-header">
            <span className="insurance-title">Secondary Insurance</span>
          </div>
        </div>
      ) : (
        <button className="add-contact-btn"><i className="fas fa-plus" style={{ marginRight: 6 }} />Add Secondary Insurance</button>
      )}
    </>
  );
}

const CONTENT_MAP: Record<string, React.FC<{ data: any }>> = {
  privacy:        PrivacyContent,
  identification: IdentificationContent,
  contact:        ContactContent,
  emergency:      ({ data }) => <EmergencyContent data={data} />,
  demographics:   DemographicsContent,
  additional:     AdditionalContent,
  correspondence: CorrespondenceContent,
  insurances:     InsurancesContent,
};

const RegistrationTab: React.FC<Props> = ({ detail, subTab, setSubTab }) => {
  const ContentComponent = CONTENT_MAP[subTab] || CONTENT_MAP["privacy"];
  const data = detail ? {
    privacy:        detail.privacy,
    identification: detail.identification,
    contact:        detail.contact,
    emergency:      detail.emergencyContacts,
    demographics:   detail.demographics,
    additional:     detail.additionalInfo,
    correspondence: detail.correspondence,
    insurances:     detail.insurances,
  }[subTab] : null;

  return (
    <>
      <div className="pat-left-sidebar">
        <div className="pat-left-sidebar-header">
          <h4>Registration Info</h4>
          <p>Patients details are saved under these categories</p>
        </div>
        {SIDEBAR_ITEMS.map(item => (
          <div
            key={item.key}
            className={`pat-sidebar-item ${subTab === item.key ? "active" : ""}`}
            onClick={() => setSubTab(item.key)}
            data-testid={`reg-sidebar-${item.key}`}
          >
            <i className={`fas ${item.icon}`} />
            {item.label}
          </div>
        ))}
      </div>
      <div className="pat-main-content">
        <ContentComponent data={data} />
      </div>
    </>
  );
};

export default RegistrationTab;
