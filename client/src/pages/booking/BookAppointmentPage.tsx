import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointment } from "../../api/appointment";
import { useToast } from "../../hooks/useToast";
import "../../assets/css/bookingModal.css";
import "../../assets/css/default.css";

const CONDITION_TYPES = ["Office Visit", "Follow-up", "Consultation", "Procedure", "Telehealth", "Lab Review", "Urgent Care", "Annual Physical", "Other"];
const STATUS_OPTIONS = ["scheduled", "confirmed", "waitlisted"];

const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    patient_first_name: "",
    patient_last_name: "",
    start_time: "",
    end_time: "",
    condition_type: "",
    reason: "",
    status: "scheduled",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.patient_first_name.trim()) errs.patient_first_name = "First name is required";
    if (!form.patient_last_name.trim()) errs.patient_last_name = "Last name is required";
    if (!form.start_time) errs.start_time = "Appointment date/time is required";
    if (form.end_time && form.start_time && new Date(form.end_time) <= new Date(form.start_time)) {
      errs.end_time = "End time must be after start time";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await createAppointment({
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: form.end_time ? new Date(form.end_time).toISOString() : undefined,
      });
      showToast("Appointment booked successfully!", "success");
      navigate("/calendar");
    } catch (err: any) {
      showToast(err?.response?.data?.detail || "Failed to book appointment.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-card">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "40px", height: "40px", background: "#e0f2fe", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fa fa-calendar-plus" style={{ color: "#0891b2", fontSize: "18px" }} />
          </div>
          <div>
            <div className="booking-title">Book Appointment</div>
            <div className="booking-subtitle">Schedule a new patient appointment</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>Patient First Name *</label>
              <input className={`form-control-custom ${errors.patient_first_name ? "has-error" : ""}`} value={form.patient_first_name} onChange={(e) => set("patient_first_name", e.target.value)} placeholder="John" />
              {errors.patient_first_name && <div className="form-error-message">{errors.patient_first_name}</div>}
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>Patient Last Name *</label>
              <input className={`form-control-custom ${errors.patient_last_name ? "has-error" : ""}`} value={form.patient_last_name} onChange={(e) => set("patient_last_name", e.target.value)} placeholder="Smith" />
              {errors.patient_last_name && <div className="form-error-message">{errors.patient_last_name}</div>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>Start Date & Time *</label>
              <input type="datetime-local" className={`form-control-custom ${errors.start_time ? "has-error" : ""}`} value={form.start_time} onChange={(e) => set("start_time", e.target.value)} />
              {errors.start_time && <div className="form-error-message">{errors.start_time}</div>}
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>End Date & Time</label>
              <input type="datetime-local" className={`form-control-custom ${errors.end_time ? "has-error" : ""}`} value={form.end_time} onChange={(e) => set("end_time", e.target.value)} />
              {errors.end_time && <div className="form-error-message">{errors.end_time}</div>}
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>Visit Type</label>
            <select className="form-control-custom" value={form.condition_type} onChange={(e) => set("condition_type", e.target.value)}>
              <option value="">Select visit type...</option>
              {CONDITION_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>Status</label>
              <select className="form-control-custom" value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>Location</label>
              <input className="form-control-custom" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Room 101 / Virtual" />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>Reason for Visit</label>
            <textarea className="form-control-custom" value={form.reason} onChange={(e) => set("reason", e.target.value)} placeholder="Brief description of the visit reason..." rows={3} style={{ resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={() => navigate("/calendar")} style={{ flex: 1, background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 500, color: "#6b7280", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom" style={{ flex: 2 }} disabled={isLoading}>
              {isLoading ? <><i className="fas fa-spinner fa-spin me-2" />Booking...</> : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
