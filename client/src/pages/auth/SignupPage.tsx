import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import "../../assets/css/default.css";
import "../../assets/css/signup.css";

const SPECIALTY_OPTIONS = ["General Practice", "Internal Medicine", "Pediatrics", "Cardiology", "Orthopedics", "Neurology", "Psychiatry", "Dermatology", "Obstetrics", "Surgery", "Emergency Medicine", "Radiology", "Oncology", "Other"];
const ORG_TYPES = ["clinic", "hospital", "private_practice", "urgent_care", "telehealth"];
const STATES_US = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;

  const [form, setForm] = useState({
    email: "", password: "", confirmPassword: "",
    firstName: "", lastName: "", phone: "",
    role: "doctor", specialty: "", providerType: "physician", npi: "",
    orgName: "", orgType: "clinic", address: "", city: "", state: "", zip: "", department: "",
    hipaaConsent: false, ehrConsent: false, auditConsent: false, hieConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.firstName.trim()) errs.firstName = "First name is required";
      if (!form.lastName.trim()) errs.lastName = "Last name is required";
      if (!form.email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
      if (!form.password) errs.password = "Password is required";
      else if (form.password.length < 8) errs.password = "Min 8 characters";
      if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    }
    if (step === 2) {
      if (!form.specialty) errs.specialty = "Specialty is required";
    }
    if (step === 3) {
      if (!form.orgName.trim()) errs.orgName = "Practice name is required";
    }
    if (step === 4) {
      if (!form.hipaaConsent) errs.hipaaConsent = "HIPAA consent is required";
      if (!form.ehrConsent) errs.ehrConsent = "EHR Terms consent is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(s + 1, TOTAL_STEPS)); };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsLoading(true);
    try {
      await (await import("../../api/auth")).signup(form as any);
      showToast("Account created! Check your email to verify.", "success");
      navigate("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Signup failed. Please try again.";
      showToast(typeof msg === "string" ? msg : "Signup failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const stepDots = Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1);

  return (
    <AuthLayout>
      <div className="signup-card">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#00bba7,#009689)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>M</span>
            </div>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a" }}>Medaea EHR</span>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1a1a1a" }}>Create Your Account</h2>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Secure provider portal registration</p>
        </div>

        <div className="step-progress">
          {stepDots.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`step-dot ${s < step ? "done" : s === step ? "active" : "upcoming"}`}>
                {s < step ? <i className="fa fa-check" /> : s}
              </div>
              {i < TOTAL_STEPS - 1 && <div className={`step-line ${s < step ? "done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Account Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input className={errors.firstName ? "is-invalid" : ""} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="John" />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input className={errors.lastName ? "is-invalid" : ""} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Smith" />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" className={errors.email ? "is-invalid" : ""} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="john.smith@clinic.com" />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input type="password" className={errors.password ? "is-invalid" : ""} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 8 characters" />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" className={errors.confirmPassword ? "is-invalid" : ""} value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} placeholder="Re-enter password" />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Provider Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={(e) => set("role", e.target.value)}>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Administrator</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
              <div className="form-group">
                <label>Provider Type</label>
                <select value={form.providerType} onChange={(e) => set("providerType", e.target.value)}>
                  <option value="physician">Physician (MD/DO)</option>
                  <option value="np">Nurse Practitioner</option>
                  <option value="pa">Physician Assistant</option>
                  <option value="rn">Registered Nurse</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Specialty *</label>
              <select className={errors.specialty ? "is-invalid" : ""} value={form.specialty} onChange={(e) => set("specialty", e.target.value)}>
                <option value="">Select specialty...</option>
                {SPECIALTY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.specialty && <div className="invalid-feedback">{errors.specialty}</div>}
            </div>
            <div className="form-group">
              <label>NPI Number</label>
              <input value={form.npi} onChange={(e) => set("npi", e.target.value)} placeholder="10-digit NPI" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Organization Details</h3>
            <div className="form-group">
              <label>Practice/Organization Name *</label>
              <input className={errors.orgName ? "is-invalid" : ""} value={form.orgName} onChange={(e) => set("orgName", e.target.value)} placeholder="St. Mary Medical Center" />
              {errors.orgName && <div className="invalid-feedback">{errors.orgName}</div>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Organization Type</label>
                <select value={form.orgType} onChange={(e) => set("orgType", e.target.value)}>
                  {ORG_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="e.g. Cardiology" />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="123 Medical Center Drive" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className="form-group">
                <label>State</label>
                <select value={form.state} onChange={(e) => set("state", e.target.value)}>
                  <option value="">Select...</option>
                  {STATES_US.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>ZIP</label>
                <input value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="12345" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Regulatory Consents</h3>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>Please review and accept all required agreements before creating your account.</p>
            {[
              { field: "hipaaConsent", label: "HIPAA Privacy & Security", desc: "I understand and agree to comply with HIPAA Privacy and Security Rules in the use of this system and patient health information." },
              { field: "ehrConsent", label: "EHR System Terms of Use", desc: "I agree to the Electronic Health Records system terms of use, acceptable use policies, and data handling requirements." },
              { field: "auditConsent", label: "Audit & Monitoring", desc: "I acknowledge that all access to patient records is logged, audited, and monitored for compliance and security purposes." },
              { field: "hieConsent", label: "Health Information Exchange (Optional)", desc: "I consent to participation in Health Information Exchange for care coordination and interoperability purposes." },
            ].map(({ field, label, desc }) => (
              <div key={field} className={`consent-item ${errors[field] ? "border-danger" : ""}`}>
                <input type="checkbox" checked={(form as any)[field]} onChange={(e) => set(field, e.target.checked)} />
                <div>
                  <div className="consent-label">{label}</div>
                  <div className="consent-desc">{desc}</div>
                  {errors[field] && <div className="invalid-feedback d-block">{errors[field]}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="step-nav">
          {step > 1 ? (
            <button className="btn-back" onClick={prevStep} type="button">← Back</button>
          ) : (
            <Link to="/login" className="btn-back" style={{ textDecoration: "none" }}>Cancel</Link>
          )}
          {step < TOTAL_STEPS ? (
            <button className="btn-next" onClick={nextStep} type="button">Next →</button>
          ) : (
            <button className="btn-next" onClick={handleSubmit} disabled={isLoading} type="button">
              {isLoading ? <><i className="fas fa-spinner fa-spin me-1" />Creating...</> : "Create Account"}
            </button>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#9ca3af", marginTop: "16px" }}>
          Already have an account? <Link to="/login" className="link-primary">Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
