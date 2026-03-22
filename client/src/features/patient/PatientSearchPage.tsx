import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientRow from "./components/PatientRow";
import type { PatientProfile } from "../../types/patient.type";
import { createPatient } from "../../api/patient";

const GENDERS = ["Male", "Female", "Non-binary", "Other", "Prefer not to say"];

const PatientSearchPage: React.FC<{
  patients: PatientProfile[];
  onPatientAdded?: () => void;
}> = ({ patients, onPatientAdded }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
  });

  const filteredPatients = patients.filter((p) =>
    `${p.first_name} ${p.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const openModal = () => {
    setForm({ first_name: "", last_name: "", date_of_birth: "", gender: "", phone: "", email: "" });
    setSaveError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setSaveError("First name and last name are required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      await createPatient(form);
      setShowModal(false);
      if (onPatientAdded) onPatientAdded();
    } catch {
      setSaveError("Failed to add patient. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="dash-hd">
        <div className="dash-left">
          <div className="dash-hd-icon">
            <i className="fa fa-user" />
          </div>
          <div>
            <div className="dash-title">Patient Dashboard</div>
            <div className="dash-sub">Manage patient records and track patient flow</div>
          </div>
        </div>
        <button
          className="btn-my-patients"
          onClick={() => navigate("/patient/mine")}
          data-testid="btn-my-patients"
        >
          My Patients
        </button>
      </div>

      {/* ── Table Card ── */}
      <div className="cal-card">
        <div className="tbl-hd">
          <div className="tbl-title">Patients</div>
          <div className="tbl-actions">
            <div className="search-box">
              <i className="fa fa-search" style={{ color: "#9ca3af", fontSize: "12px" }} />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-patient-search"
              />
            </div>
            <button className="icon-btn" data-testid="btn-filter">
              <i className="fa fa-filter" />
            </button>
            <button
              className="btn-add-patient"
              onClick={openModal}
              data-testid="btn-add-patient"
            >
              <i className="fa fa-plus" /> Add Patient
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="patient-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Patient ID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Reason to Visit</th>
                <th>Appointment Status</th>
                <th>Waiting Room</th>
                <th>Encounter Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <PatientRow key={patient.id} patient={patient} />
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Patient Modal ── */}
      {showModal && (
        <div className="ap-overlay" onClick={closeModal} data-testid="modal-add-patient">
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="ap-modal-icon"><i className="fas fa-user-plus" /></div>
                <div>
                  <div className="ap-modal-title">Add New Patient</div>
                  <div className="ap-modal-sub">Enter patient information to create a new record</div>
                </div>
              </div>
              <button className="ap-close-btn" onClick={closeModal} data-testid="btn-close-modal">
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ap-modal-body">
              <div className="ap-section-label">Personal Information</div>
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label className="ap-label">First Name <span className="ap-req">*</span></label>
                  <input
                    className="ap-input"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    data-testid="input-first-name"
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-label">Last Name <span className="ap-req">*</span></label>
                  <input
                    className="ap-input"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label className="ap-label">Date of Birth</label>
                  <input
                    className="ap-input"
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    data-testid="input-dob"
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-label">Gender</label>
                  <select
                    className="ap-input"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    data-testid="select-gender"
                  >
                    <option value="">Select gender</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="ap-section-label" style={{ marginTop: 16 }}>Contact Information</div>
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label className="ap-label">Phone Number</label>
                  <input
                    className="ap-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    data-testid="input-phone"
                  />
                </div>
                <div className="ap-form-group">
                  <label className="ap-label">Email Address</label>
                  <input
                    className="ap-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="patient@email.com"
                    data-testid="input-email"
                  />
                </div>
              </div>

              {saveError && (
                <div className="ap-error" data-testid="text-save-error">
                  <i className="fas fa-exclamation-circle" style={{ marginRight: 6 }} />
                  {saveError}
                </div>
              )}

              <div className="ap-modal-footer">
                <button
                  type="button"
                  className="ap-cancel-btn"
                  onClick={closeModal}
                  data-testid="btn-cancel-add"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ap-save-btn"
                  disabled={saving}
                  data-testid="btn-save-patient"
                >
                  {saving
                    ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: 6 }} />Saving...</>
                    : <><i className="fas fa-user-plus" style={{ marginRight: 6 }} />Add Patient</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearchPage;
