import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { APP_ROUTES } from "../../config/constants";
import {
  isValidEmail,
  isValidPhone,
  validatePasswordStrength,
} from "../../utils/validation";
import Logo from "../../assets/img/logo.svg";
import UserIcon from "../../assets/img/ic-1.svg";
import ProviderIcon from "../../assets/img/ic-2.svg";
import InfoIcon from "../../assets/img/ic-info.svg";
import InfoIconAlt from "../../assets/img/ic-info-alt.svg";
import ProfessionalIDIcon from "../../assets/img/ic-3.svg";
import ShieldIcon from "../../assets/img/ic-shield.svg";
import PracticeAffIcon from "../../assets/img/ic-4-alt.svg";
import ShieldAltIcon from "../../assets/img/ic-5.svg";
import InfoAltIcon from "../../assets/img/ic-info-i.svg";
import ShieldSecIcon from "../../assets/img/ic-shield-alt.svg";
import Select from "../../components/ui/Select";
import { useToast } from "../../hooks/useToast";
import { api } from "../../api/client";
import axios, { AxiosError } from "axios";
import type {
  ApiErrorResponse,
  ValidationErrorDetail,
} from "../../types/api.types";
import VerifyEmailModal from "./components/VerifyEmailModal";

const SignupPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    mfaMethod: "app",
    // Step 2
    role: "",
    providerType: "",
    specialty: "",
    // Step 3
    npi: "",
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    dea: "",
    // Step 4
    orgName: "",
    orgType: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    department: "",
    // Step 5
    hipaaConsent: true,
    ehrConsent: true,
    auditConsent: true,
    hieConsent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  // Validation Logic
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    const setError = (field: string, msg: string) => {
      newErrors[field] = msg;
      isValid = false;
    };

    if (currentStep === 1) {
      if (!formData.firstName) setError("firstName", "First Name is required");
      if (!formData.lastName) setError("lastName", "Last Name is required");
      if (!formData.email) setError("email", "Work Email is required");
      else if (!isValidEmail(formData.email))
        setError("email", "Invalid email address");

      if (!formData.phone) setError("phone", "Mobile Phone is required");
      else if (!isValidPhone(formData.phone))
        setError("phone", "Invalid phone number");

      if (!formData.password) setError("password", "Password is required");
      else {
        const strength = validatePasswordStrength(formData.password);
        if (!strength.isValid) setError("password", strength.errors[0]);
      }

      if (formData.password !== formData.confirmPassword)
        setError("confirmPassword", "Passwords do not match");
    } else if (currentStep === 2) {
      if (!formData.role) setError("role", "Role is required");
      if (!formData.providerType)
        setError("providerType", "Provider Type is required");
      if (!formData.specialty) setError("specialty", "Specialty is required");
    } else if (currentStep === 3) {
      if (!formData.npi) setError("npi", "NPI is required");
      else if (formData.npi.length !== 10)
        setError("npi", "NPI must be 10 digits");

      if (!formData.licenseNumber)
        setError("licenseNumber", "License Number is required");
      if (!formData.licenseState)
        setError("licenseState", "License State is required");
      if (!formData.licenseExpiry)
        setError("licenseExpiry", "Expiration Date is required");
    } else if (currentStep === 4) {
      if (!formData.orgName)
        setError("orgName", "Organization Name is required");
      if (!formData.orgType)
        setError("orgType", "Organization Type is required");
      if (!formData.address) setError("address", "Address is required");
      if (!formData.city) setError("city", "City is required");
      if (!formData.state) setError("state", "State is required");
      if (!formData.zip) setError("zip", "ZIP Code is required");
      if (!formData.department)
        setError("department", "Department is required");
    } else if (currentStep === 5) {
      if (!formData.hipaaConsent) setError("hipaaConsent", "Required");
      if (!formData.ehrConsent) setError("ehrConsent", "Required");
      if (!formData.auditConsent) setError("auditConsent", "Required");
      if (!formData.hieConsent) setError("hieConsent", "Required");

      if (!isValid) alert("Please accept all consent forms to proceed.");
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => {
        const nextStep = Math.min(prev + 1, totalSteps);
        return nextStep;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Only submit on the final step
    if (step !== totalSteps) return;

    // 2. Client-side validation
    if (!validateStep(step)) return;

    try {
      // --- PRODUCTION REQUEST WAY ---
      // We use the 'api' instance. No need for full URL or headers manually.
      await api.post("/auth/signup", formData);

      // Success handling
      showToast("Account created! Please check your email.", "success");
      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error("Signup Error:", error);
      let errorMessage = "Something went wrong. Please try again.";

      // --- ROBUST ERROR HANDLING ---
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ApiErrorResponse>;

        // Case A: Server responded with an error (4xx, 5xx)
        if (apiError.response) {
          const { status, data } = apiError.response;

          // 1. Handle FastAPI Validation Errors (422)
          if (status === 422 && data.detail && Array.isArray(data.detail)) {
            // Extract the first validation error
            const firstError = (data.detail as ValidationErrorDetail[])[0];
            // loc is usually ["body", "email"], so loc[1] is the field name
            const fieldName = firstError.loc[1] || "Field";
            errorMessage = `${fieldName}: ${firstError.msg}`;
          }
          // 2. Handle Logic Errors (400 - e.g., "Email already exists")
          else if (data.detail) {
            errorMessage =
              typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(data.detail);
          }
        }
        // Case B: No response received (Network Error / Server Down)
        else if (apiError.request) {
          errorMessage = "Network error. Unable to reach the server.";
        }
      }
      // Case C: Generic JS Error
      else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
    }
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const renderStepper = () => (
    <div className="stepper-wrapper">
      <div className="stepper">
        {[
          "Account",
          "Classification",
          "Credentials",
          "Affiliation",
          "Consent",
        ].map((label, idx) => {
          const stepNum = idx + 1;
          return (
            <div
              key={stepNum}
              className={`step ${step === stepNum ? "active" : ""} ${step > stepNum ? "completed" : ""}`}
            >
              <div className="step-circle">
                <span>{stepNum}</span>
              </div>
              <div className="step-label">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="signup-container">
      <div className="signup-card">
        <Link to={APP_ROUTES.LOGIN} className="back-to-login">
          <i className="fas fa-chevron-left"></i> Back to Login
        </Link>

        <div className="signup-header">
          <div className="brand-logo-signup">
            <img src={Logo} alt="Medaea EHR Logo" />
          </div>
          <h1 className="signup-title">Provider Account Registration</h1>
          <p className="signup-subtitle">
            ONC Certified EHR • HIPAA Compliant • Secure by Design
          </p>
        </div>

        {renderStepper()}

        <form onSubmit={handleSubmit} id="signupForm">
          {/* STEP 1: ACCOUNT IDENTITY */}
          {step === 1 && (
            <div className="form-step active">
              <div className="step-content">
                <div className="step-header">
                  <div className="step-icon blue">
                    <img src={UserIcon} alt="Account Identity Icon" />
                  </div>
                  <div className="step-header-text">
                    <h2>Account Identity</h2>
                    <p>Your legal name and contact information</p>
                  </div>
                </div>
                <div className="form-row">
                  <Input
                    label="First Name (Legal)"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    error={errors.firstName}
                  />
                  <Input
                    label="Last Name (Legal)"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    error={errors.lastName}
                  />
                </div>
                <Input
                  label="Work Email (Unique Username)"
                  placeholder="john.doe@hospital.org"
                  required
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  error={errors.email}
                  icon="far fa-envelope"
                  iconSize={16}
                />
                <Input
                  label="Mobile Phone"
                  required
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  error={errors.phone}
                  icon="fas fa-phone"
                  iconSize={16}
                  placeholder="(555) 123-4567"
                />
                <div className="form-row">
                  <Input
                    label="Password"
                    placeholder="Create Password"
                    type="password"
                    required
                    value={formData.password}
                    icon="fas fa-lock"
                    iconSize={16}
                    onChange={(e) => updateField("password", e.target.value)}
                    error={errors.password}
                  />
                  <Input
                    label="Confirm Password"
                    placeholder="Re-enter Password"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    icon="fas fa-lock"
                    iconSize={16}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                    error={errors.confirmPassword}
                  />
                </div>
                {/* Password Requirements Box */}
                <div className="password-requirements">
                  <h4>
                    <img
                      src={InfoIcon}
                      alt="Info Icon"
                      width="16"
                      height="16"
                    />{" "}
                    NIST 800-63B Password Requirements:
                  </h4>
                  <div className="requirements-grid">
                    <div
                      className={`requirement-item ${formData.password.length >= 12 ? "valid" : ""}`}
                    >
                      <i
                        className={`far ${formData.password.length >= 12 ? "far fa-check-circle" : "far fa-circle"}`}
                      ></i>{" "}
                      At least 12 characters
                    </div>
                    <div
                      className={`requirement-item ${/[A-Z]/.test(formData.password) ? "valid" : ""}`}
                    >
                      <i
                        className={`far ${/[A-Z]/.test(formData.password) ? "far fa-check-circle" : "far fa-circle"}`}
                      ></i>{" "}
                      One uppercase letter
                    </div>
                    <div
                      className={`requirement-item ${/[a-z]/.test(formData.password) ? "valid" : ""}`}
                    >
                      <i
                        className={`far ${/[a-z]/.test(formData.password) ? "far fa-check-circle" : "far fa-circle"}`}
                      ></i>{" "}
                      One lowercase letter
                    </div>
                    <div
                      className={`requirement-item ${/[0-9]/.test(formData.password) ? "valid" : ""}`}
                    >
                      <i
                        className={`far ${/[0-9]/.test(formData.password) ? "far fa-check-circle" : "far fa-circle"}`}
                      ></i>{" "}
                      One number
                    </div>
                    <div
                      className={`requirement-item ${/[!@#$%^&*]/.test(formData.password) ? "valid" : ""}`}
                    >
                      <i
                        className={`far ${/[!@#$%^&*]/.test(formData.password) ? "far fa-check-circle" : "far fa-circle"}`}
                      ></i>{" "}
                      One special character (!@#$%^&*)
                    </div>
                  </div>
                </div>
                {/* MFA Options */}
                <div
                  className="form-row single-column"
                  style={{ marginTop: "24px" }}
                >
                  <div>
                    <label className="form-label-custom">
                      Multi-Factor Authentication Preference{" "}
                      <span className="required">*</span>
                    </label>
                    <div className="mfa-options">
                      <div
                        className={`mfa-option ${formData.mfaMethod === "app" ? "selected" : ""}`}
                        onClick={() => updateField("mfaMethod", "app")}
                      >
                        <h4>Authenticator App</h4>
                        <p>Most Secure</p>
                      </div>
                      <div
                        className={`mfa-option ${formData.mfaMethod === "sms" ? "selected" : ""}`}
                        onClick={() => updateField("mfaMethod", "sms")}
                      >
                        <h4>SMS</h4>
                        <p>Text Message</p>
                      </div>
                      <div
                        className={`mfa-option ${formData.mfaMethod === "email" ? "selected" : ""}`}
                        onClick={() => updateField("mfaMethod", "email")}
                      >
                        <h4>Email</h4>
                        <p>Email Code</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROVIDER CLASSIFICATION */}
          {step === 2 && (
            <div className="form-step active">
              <div className="step-content">
                <div className="step-header">
                  <div className="step-icon purple">
                    <img
                      src={ProviderIcon}
                      alt="Provider Classification Icon"
                    />
                  </div>
                  <div className="step-header-text">
                    <h2>Provider Classification</h2>
                    <p>Your clinical role and specialty</p>
                  </div>
                </div>

                {/* Role */}
                <Select
                  label="Role"
                  required
                  value={formData.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  error={errors.role}
                >
                  <option value="">Select Role</option>
                  <option value="physician">Physician</option>
                  <option value="nurse_practitioner">Nurse Practitioner</option>
                  <option value="physician_assistant">Physician Assistant</option>
                  <option value="registered_nurse">Registered Nurse</option>
                  <option value="licensed_practical_nurse">Licensed Practical Nurse</option>
                  <option value="medical_assistant">Medical Assistant</option>
                  <option value="clinical_pharmacist">Clinical Pharmacist</option>
                  <option value="radiologist">Radiologist</option>
                  <option value="therapist">Therapist / Counselor</option>
                  <option value="administrative">Administrative Staff</option>
                  <option value="billing_specialist">Billing Specialist</option>
                  <option value="other">Other</option>
                </Select>

                {/* Provider Type (Taxonomy Based) */}
                <Select
                  label="Provider Type (Taxonomy Based)"
                  required
                  value={formData.providerType}
                  onChange={(e) => updateField("providerType", e.target.value)}
                  error={errors.providerType}
                >
                  <option value="">Select Provider Type</option>
                  <optgroup label="Allopathic & Osteopathic Physicians">
                    <option value="207Q00000X">Family Medicine (207Q00000X)</option>
                    <option value="207R00000X">Internal Medicine (207R00000X)</option>
                    <option value="208000000X">Pediatrics (208000000X)</option>
                    <option value="207X00000X">Orthopedic Surgery (207X00000X)</option>
                    <option value="2084N0400X">Neurology (2084N0400X)</option>
                    <option value="207RC0000X">Cardiovascular Disease (207RC0000X)</option>
                    <option value="207RG0100X">Gastroenterology (207RG0100X)</option>
                    <option value="207RE0101X">Endocrinology (207RE0101X)</option>
                    <option value="2086S0122X">Plastic Surgery (2086S0122X)</option>
                    <option value="2085R0202X">Diagnostic Radiology (2085R0202X)</option>
                    <option value="207RH0003X">Hematology (207RH0003X)</option>
                    <option value="207RO0200X">Oncology (207RO0200X)</option>
                    <option value="2084P0800X">Psychiatry (2084P0800X)</option>
                    <option value="207V00000X">Obstetrics &amp; Gynecology (207V00000X)</option>
                    <option value="207P00000X">Emergency Medicine (207P00000X)</option>
                    <option value="207T00000X">Neurological Surgery (207T00000X)</option>
                    <option value="208600000X">Surgery (208600000X)</option>
                  </optgroup>
                  <optgroup label="Nurse Practitioners &amp; Physician Assistants">
                    <option value="363L00000X">Nurse Practitioner (363L00000X)</option>
                    <option value="363A00000X">Physician Assistant (363A00000X)</option>
                    <option value="364S00000X">Clinical Nurse Specialist (364S00000X)</option>
                  </optgroup>
                  <optgroup label="Nursing">
                    <option value="163W00000X">Registered Nurse (163W00000X)</option>
                    <option value="164W00000X">Licensed Practical Nurse (164W00000X)</option>
                  </optgroup>
                  <optgroup label="Other Providers">
                    <option value="183500000X">Pharmacist (183500000X)</option>
                    <option value="225100000X">Physical Therapist (225100000X)</option>
                    <option value="225X00000X">Occupational Therapist (225X00000X)</option>
                    <option value="235500000X">Respiratory Therapist (235500000X)</option>
                    <option value="103T00000X">Psychologist (103T00000X)</option>
                    <option value="106H00000X">Marriage &amp; Family Therapist (106H00000X)</option>
                  </optgroup>
                </Select>

                {/* Primary Specialty */}
                <Select
                  label="Primary Specialty"
                  required
                  value={formData.specialty}
                  onChange={(e) => updateField("specialty", e.target.value)}
                  error={errors.specialty}
                >
                  <option value="">Select Primary Specialty</option>
                  <option value="allergy_immunology">Allergy &amp; Immunology</option>
                  <option value="anesthesiology">Anesthesiology</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="critical_care">Critical Care Medicine</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="emergency_medicine">Emergency Medicine</option>
                  <option value="endocrinology">Endocrinology &amp; Metabolism</option>
                  <option value="family_medicine">Family Medicine</option>
                  <option value="gastroenterology">Gastroenterology</option>
                  <option value="general_surgery">General Surgery</option>
                  <option value="geriatrics">Geriatric Medicine</option>
                  <option value="hematology">Hematology</option>
                  <option value="hospitalist">Hospital Medicine (Hospitalist)</option>
                  <option value="infectious_disease">Infectious Disease</option>
                  <option value="internal_medicine">Internal Medicine</option>
                  <option value="nephrology">Nephrology</option>
                  <option value="neurology">Neurology</option>
                  <option value="neurosurgery">Neurological Surgery</option>
                  <option value="obstetrics_gynecology">Obstetrics &amp; Gynecology</option>
                  <option value="oncology">Oncology / Hematology-Oncology</option>
                  <option value="ophthalmology">Ophthalmology</option>
                  <option value="orthopedics">Orthopedic Surgery</option>
                  <option value="otolaryngology">Otolaryngology (ENT)</option>
                  <option value="pain_medicine">Pain Medicine</option>
                  <option value="pathology">Pathology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="physical_medicine">Physical Medicine &amp; Rehabilitation</option>
                  <option value="plastic_surgery">Plastic &amp; Reconstructive Surgery</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="pulmonology">Pulmonology / Critical Care</option>
                  <option value="radiology">Radiology</option>
                  <option value="rheumatology">Rheumatology</option>
                  <option value="sports_medicine">Sports Medicine</option>
                  <option value="urology">Urology</option>
                  <option value="vascular_surgery">Vascular Surgery</option>
                  <option value="other">Other</option>
                </Select>

                <div className="info-box purple">
                  <img
                    src={InfoIconAlt}
                    alt="Info Icon"
                    width="16"
                    height="16"
                  />
                  <div className="info-box-content">
                    <h4>Taxonomy-Based Classification</h4>
                    <p>
                      Provider types follow the NUCC Health Care Provider
                      Taxonomy Code Set. This ensures compliance with HIPAA and
                      ONC certification requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROFESSIONAL IDENTIFIERS */}
          {step === 3 && (
            <div className="form-step active">
              <div className="step-content">
                <div className="step-header">
                  <div className="step-icon green">
                    <img
                      src={ProfessionalIDIcon}
                      alt="Professional Identifiers Icon"
                    />
                  </div>
                  <div className="step-header-text">
                    <h2>Professional Identifiers</h2>
                    <p>License and credential information</p>
                  </div>
                </div>
                <Input
                  label="NPI Number"
                  required
                  value={formData.npi}
                  onChange={(e) => updateField("npi", e.target.value)}
                  maxLength={10}
                  placeholder="1234567890 (10 digits)"
                  helperText="National Provider Identifier (Type 1 or Type 2)"
                  error={errors.npi}
                />
                <div className="form-row">
                  <Input
                    label="State License Number"
                    placeholder="Enter license number"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      updateField("licenseNumber", e.target.value)
                    }
                    error={errors.licenseNumber}
                  />
                  <Select
                    label="License State"
                    required
                    value={formData.licenseState}
                    onChange={(e) =>
                      updateField("licenseState", e.target.value)
                    }
                    error={errors.licenseState}
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                  </Select>
                </div>
                <div className="form-row">
                  <Input
                    label="License Expiration Date"
                    type="date"
                    required
                    value={formData.licenseExpiry}
                    onChange={(e) =>
                      updateField("licenseExpiry", e.target.value)
                    }
                    error={errors.licenseExpiry}
                  />
                  <Input
                    label="DEA Number"
                    value={formData.dea}
                    onChange={(e) => updateField("dea", e.target.value)}
                    placeholder="AB1234563"
                    error={errors.dea}
                  />
                </div>
                <div className="info-box green">
                  <img
                    src={ShieldIcon}
                    alt="Info Icon"
                    width="16"
                    height="16"
                  />
                  <div className="info-box-content">
                    <h4>Credential Verification</h4>
                    <p>
                      All professional credentials will be verified through
                      NPPES and state licensing boards before account
                      activation. This typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PRACTICE AFFILIATION */}
          {step === 4 && (
            <div className="form-step active">
              <div className="step-content">
                <div className="step-header">
                  <div className="step-icon orange">
                    <img
                      src={PracticeAffIcon}
                      alt="Practice Affiliation Icon"
                    />
                  </div>
                  <div className="step-header-text">
                    <h2>Practice Affiliation</h2>
                    <p>Where you practice medicine</p>
                  </div>
                </div>
                <div className="form-row">
                  <Input
                    label="Organization Name"
                    placeholder="St. Mary's Hospital"
                    required
                    value={formData.orgName}
                    onChange={(e) => updateField("orgName", e.target.value)}
                    error={errors.orgName}
                  />
                  {/* Organization Type Select */}
                  <Select
                    label="Organization Type"
                    required
                    value={formData.orgType}
                    onChange={(e) => updateField("orgType", e.target.value)}
                    error={errors.orgType}
                  >
                    <option value="" disabled>
                      Select Organization Type
                    </option>
                    <option value="hospital_inpatient">
                      Hospital - Inpatient
                    </option>
                    <option value="hospital_outpatient">
                      Hospital - Outpatient
                    </option>
                    <option value="clinic">Clinic</option>
                    <option value="private_practice">Private Practice</option>
                    <option value="urgent_care">Urgent Care</option>
                    <option value="academic_medical_center">
                      Academic Medical Center
                    </option>
                    <option value="community_health_center">
                      Community Health Center
                    </option>
                    <option value="specialty_center">Specialty Center</option>
                  </Select>
                </div>
                <Input
                  label="Practice Address"
                  placeholder="123 Medical Drive"
                  required
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  icon="fas fa-map-marker-alt"
                  error={errors.address}
                />
                <div className="form-row three-columns">
                  <Input
                    label="City"
                    placeholder="Boston"
                    required
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    error={errors.city}
                  />
                  {/* State Select */}
                  <Select
                    label="State"
                    required
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    error={errors.state}
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    <option value="MA">MA</option>
                    <option value="NY">NY</option>
                    <option value="CA">CA</option>
                    <option value="TX">TX</option>
                    <option value="FL">FL</option>
                  </Select>
                  <Input
                    label="ZIP Code"
                    placeholder="02115"
                    required
                    value={formData.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    error={errors.zip}
                  />
                </div>
                {/* Department Select */}
                <Select
                  label="Department / Service Line"
                  required
                  value={formData.department}
                  onChange={(e) => updateField("department", e.target.value)}
                  error={errors.department}
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  <option value="emergency">Emergency Department</option>
                  <option value="icu">Intensive Care Unit (ICU)</option>
                  <option value="medical_surgical">Medical-Surgical</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="obstetrics">Obstetrics</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="oncology">Oncology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="neurology">Neurology</option>
                  <option value="primary_care">Primary Care</option>
                  <option value="outpatient_clinic">Outpatient Clinic</option>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 5: SECURITY & CONSENT */}
          {step === 5 && (
            <div className="form-step active">
              <div className="step-content">
                <div className="step-header">
                  <div className="step-icon red">
                    <img src={ShieldAltIcon} alt="Security & Consent Icon" />
                  </div>
                  <div className="step-header-text">
                    <h2>Security & Consent</h2>
                    <p>Required compliance acknowledgements</p>
                  </div>
                </div>

                <div className="consent-section mt-4">
                  <h4>
                    HIPAA Privacy Acknowledgement{" "}
                    <span className="required">*</span>
                  </h4>
                  <div className="checkbox-custom mt-2">
                    {/* <input type="checkbox" id="hipaaConsent" required /> */}
                    <p>
                      I acknowledge that I have received, read, and understand
                      the Notice of Privacy Practices. I understand my rights
                      under HIPAA and agree to comply with all privacy and
                      security requirements when accessing Protected Health
                      Information (PHI).
                    </p>
                  </div>
                </div>
                <div className="consent-section">
                  <h4>
                    Consent for Electronic Health Records{" "}
                    <span className="required">*</span>
                  </h4>
                  <p>
                    I consent to the use of electronic health records (EHR) for
                    documenting patient care. I understand that all entries are
                    timestamped, audited, and legally binding. I will maintain
                    the confidentiality of my login credentials.
                  </p>
                  {/* <div className="checkbox-custom mt-2">
                    <input type="checkbox" id="ehrConsent" required />
                    <label htmlFor="ehrConsent">I agree</label>
                  </div> */}
                </div>
                <div className="consent-section">
                  <h4>
                    Consent for Audit Logging{" "}
                    <span className="required">*</span>
                  </h4>
                  <p>
                    I understand and consent to comprehensive audit logging of
                    all system activities, including PHI access, modifications,
                    and disclosures. I acknowledge that all actions are
                    monitored for security and compliance purposes in accordance
                    with ONC certification requirements.
                  </p>
                </div>
                <div className="consent-section">
                  <h4>
                    Health Information Exchange (HIE) Consent{" "}
                    <span className="required">*</span>
                  </h4>
                  <p>
                    I consent to participate in Health Information Exchange
                    (HIE) for the purpose of care coordination. I understand
                    that patient health information may be shared with other
                    healthcare providers through secure, interoperable systems
                    in compliance with ONC USCDI standards.
                  </p>
                </div>

                {/* Security Standards Box */}
                <div className="security-info-boxes">
                  <div className="security-info-box b-slct">
                    <h4>
                      <img
                        src={InfoAltIcon}
                        alt="ONC Certification Logo"
                        height="16"
                        width="16"
                      />{" "}
                      ONC Certification Compliance
                    </h4>
                    <p
                      className="text-muted-custom"
                      style={{ fontSize: "12px" }}
                    >
                      This EHR system is ONC certified under the 21st Century
                      Cures Act. All data exchange follows FHIR standards,
                      supports USCDI v3, and enables patient access via APIs.
                    </p>
                  </div>
                  <div className="security-info-box">
                    <h4>
                      <img
                        src={ShieldSecIcon}
                        alt="Security Standards Logo"
                        height="16"
                        width="16"
                      />{" "}
                      Security Standards
                    </h4>
                    <ul>
                      <li>NIST 800-53 Security Controls</li>
                      <li>Multi-Factor Authentication (MFA) Required</li>
                      <li>AES-256 Encryption at Rest & TLS 1.3</li>
                      <li>Role-Based Access Control (RBAC)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="form-navigation">
            <div className="step-info">
              Step {step} of {totalSteps}
            </div>
            <div className="nav-buttons">
              {step > 1 && (
                <Button type="button" className="btn-back" onClick={handleBack}>
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  type="button"
                  className="btn-primary-custom btn-next"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  className="btn-primary-custom btn-next"
                  style={{ minWidth: "165px" }}
                  onClick={handleSubmit}
                >
                  <i className="fas fa-check-circle"></i> Create Account
                </Button>
              )}
            </div>
          </div>
        </form>

        <div className="already-registered">
          Already have an account? <Link to={APP_ROUTES.LOGIN}>Sign In</Link>
        </div>
        <div className="terms-text">
          By creating an account, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </div>
      </div>
      <VerifyEmailModal
        isOpen={showSuccessModal}
        onClose={() => navigate(APP_ROUTES.LOGIN)}
        email={formData.email}
      />
    </div>
  );
};

export default SignupPage;
