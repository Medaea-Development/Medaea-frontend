import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import Button from "../../../components/ui/Button";

import "../../../assets/css/bookingModal.css";
import {
  calculateAge,
  formatDate,
  formatToISO,
} from "../../../utils/dateUtils";
import { formatFullName, getInitials } from "../../../utils/stringUtils";
import {
  confirmAppointment,
  getAvailableSlots,
  searchDoctors,
  sendBookingOTP,
  uploadMedicalDocuments,
  verifyBookingOTP,
} from "../../../api/appointment";
import type { Doctor } from "../../../types/appointment.type";
import { getAssetUrl } from "../../../api/client";

const BookingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Unified Form State
  const [formData, setFormData] = useState({
    condition: "OB - GYN",
    location_city: "Haughton, LA",
    location: "Blues Cross Blue Shield of Texas - Blue Choice PPO Plan",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "",
    doctor: null as Doctor | null,
    doctorName: "",
    doctorProfilePic: "",
    doctorSpecialty: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    profilePic: "",
    otpCode: "",
    dateOfBirth: "",
    address1: "",
    address2: "",
    city: "",
    region: "",
    zipCode: "",
    reasonToVisit: "",
    userExists: false,
    appointmentId: "" as string, // To track the DB record
    documentUrls: [] as string[], // Store URLs from backend
    documents: [] as File[], // Keep local files for UI display
  });

  // Helper to update fields easily
  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      if (formData.doctor === null) {
        showToast("Please select a doctor first", "error");
        setLoading(false);
        return;
      }

      const response = await sendBookingOTP(
        formData.email,
        formData.doctor?.id,
      );

      setFormData((prev) => ({
        ...prev,
        userExists: response.user_exists,
        appointmentId: response.appointment_id, // SAVE THIS ID
        firstName: response.user_data?.first_name || prev.firstName,
        lastName: response.user_data?.last_name || prev.lastName,
        phone: response.user_data?.phone || prev.phone,
        profilePic: response.user_data?.profile_picture ?? "",
      }));

      // START THE TIMER HERE
      setResendTimer(30);
      setStep(5);
    } catch (error) {
      console.log(error);
      showToast("Failed to send code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      // Check if we actually have the ID before calling the API
      if (!formData.appointmentId) {
        showToast("Session lost. Please re-enter your email.", "error");
        setStep(4);
        return;
      }

      // 1. Await the response
      const response = await verifyBookingOTP({
        appointment_id: formData.appointmentId,
        otp_code: formData.otpCode,
        email: formData.email,
      });

      // 2. Handle the response data (removing the extra .data layer if your API helper returns it directly)
      // If your axios/api client already unwraps the response, use 'response'
      // If not, use 'response.data'
      const result = response.data || response;

      if (
        result.status === "success" ||
        result.message === "Identity verified"
      ) {
        // 3. Pre-fill Step 6 ONLY if user exists
        if (result.user_data) {
          const d = result.user_data;
          setFormData((prev) => ({
            ...prev,
            userExists: true,
            dateOfBirth: d.dob || prev.dateOfBirth,
            address1: d.address_line1 || prev.address1,
            city: d.city || prev.city,
            region: d.region || prev.region,
            zipCode: d.zip_code || prev.zipCode,
            phone: d.phone || prev.phone,
            firstName: d.first_name || prev.firstName,
            lastName: d.last_name || prev.lastName,
          }));
        }

        // 4. ALWAYS move to the next step if verification was successful
        showToast("Identity verified successfully", "success");
        setStep(6);
      } else {
        showToast("Verification failed. Please check the code.", "error");
      }
    } catch (error) {
      console.log(error);
      showToast("Invalid or expired code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    // 1. Validation check
    if (!formData.appointmentId) {
      showToast("Session expired. Please restart booking.", "error");
      return;
    }

    setLoading(true);
    try {
      // Use the utility to merge date and time properly
      const isoStartDateTime = formatToISO(formData.date, formData.timeSlot);

      const payload = {
        patient_first_name: formData.firstName,
        patient_last_name: formData.lastName,
        patient_email: formData.email,
        patient_phone: formData.phone,
        patient_date_of_birth: formData.dateOfBirth,
        address_line1: formData.address1,
        address_line2: formData.address2,
        city: formData.city,
        region: formData.region,
        zip_code: formData.zipCode,
        doctor_id: formData.doctor?.id ? formData.doctor.id.toString() : null,
        org_id: null, // @TODO: Ensure this is a real UUID or from context
        start_time: isoStartDateTime,
        condition_type: formData.condition,
        reason: formData.reasonToVisit,
        // Use the URLs already stored in state from handleDocumentUpload
        document_urls: formData.documentUrls,
      };

      // Call the service we created earlier
      await confirmAppointment(formData.appointmentId, payload);

      setStep(7); // Move to Success Step
    } catch (error) {
      console.error("Booking Error:", error);
      showToast(
        "Could not complete booking. The slot might have been taken.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    // 1. Validation: Max 5 files total
    if (formData.documents.length + selectedFiles.length > 5) {
      showToast("Maximum 5 documents allowed", "error");
      return;
    }

    setLoading(true);

    try {
      if (!formData.appointmentId) {
        showToast("No active booking session found", "error");
        return;
      }

      // Call the service method (this handles the FormData and axios/fetch call)
      const response = await uploadMedicalDocuments(
        selectedFiles,
        formData.appointmentId,
      );

      // 2. Update state with both the Local File (for UI list) and Remote URL (for Final Booking)
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...selectedFiles],
        documentUrls: [...prev.documentUrls, ...response.document_urls],
      }));

      showToast("Documents uploaded successfully", "success");
    } catch (error) {
      console.error("Upload Error:", error);
      showToast(
        "File upload failed. Ensure files are < 5MB PDFs or Images.",
        "error",
      );
    } finally {
      setLoading(false);
      // Clear the input value so the same file can be uploaded again if deleted
      e.target.value = "";
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return; // Prevent clicking if timer is active

    setLoading(true);
    try {
      if (formData.doctor === null) {
        showToast("Please select a doctor first", "error");
        setLoading(false);
        return;
      }

      await sendBookingOTP(formData.email, formData.doctor?.id);
      showToast("A new code has been sent to your email.", "success");
      setResendTimer(30); // Start 30s cooldown
    } catch (error) {
      console.log(error);
      showToast("Failed to resend code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle the countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  //   useEffect(() => {
  //   if (step === 5 && formData.otpCode.length === 6) {
  //     handleVerifyOTP();
  //   }
  // }, [formData.otpCode]);

  // Fetch doctors when Step 1 inputs change
  useEffect(() => {
    const loadDoctors = async () => {
      if (step === 2) {
        // Only fetch when we reach the doctor selection step
        setFetchingDoctors(true);
        try {
          const data = await searchDoctors(
            formData.condition,
            formData.location_city,
          );
          setDoctors(data);
        } catch (error) {
          console.log("Doctor Fetch Error:", error);
          showToast("Could not load doctors for this region", "error");
        } finally {
          setFetchingDoctors(false);
        }
      }
    };

    loadDoctors();
  }, [step, formData.condition, formData.location_city, showToast]);

  // Fetch available slots when Doctor or Date changes
  useEffect(() => {
    const fetchSlots = async () => {
      // We need both a doctor and a date to check availability
      if (step === 3 && formData.doctor?.id && formData.date) {
        setFetchingSlots(true);
        try {
          // Use the API function we created
          const slots = await getAvailableSlots(
            formData.doctor.id.toString(),
            formData.date,
          );
          setAvailableSlots(slots);
        } catch (error) {
          console.log("Slots Fetch Error:", error);
          showToast("Could not fetch available times", "error");
        } finally {
          setFetchingSlots(false);
        }
      }
    };

    fetchSlots();
  }, [formData.date, formData.doctor?.id, showToast, step]);

  // Filter doctors based on search input
  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (doc) =>
        `${doc.first_name} ${doc.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, doctors]);

  if (!isOpen) return null;

  // Calculate percentage for the connecting line
  // (step - 1) because at step 1, the teal line should be 0% width
  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  const Spacer = () => {
    return (
      <div
        style={{
          height: "1px",
          width: "80%",
          backgroundColor: "#aeaeae",
          marginTop: "10px",
          marginBottom: "10px",
          opacity: 0.5,
        }}
      />
    );
  };

  // Reusable Summary Section
  const SelectionSummary = () => (
    <div className="selection-summary-card mb-4">
      <h5 className="mb-3">Appointment Details</h5>
      <div className="summary-item">
        <span className="summary-label">{formData.condition}</span>
        <span className="summary-value">Condition</span>
      </div>
      <Spacer />
      <div className="summary-item">
        <span className="summary-label">{formData.location}</span>
        <span className="summary-value">{formData.location_city}</span>
      </div>
      {step > 2 && formData.doctor && (
        <>
          <Spacer />
          <div className="summary-item">
            <span className="summary-label">
              {formatFullName(
                formData.doctor.first_name,
                formData.doctor.last_name,
              )}
            </span>
            <span className="summary-value">{formData.doctor.specialty}</span>
          </div>
        </>
      )}
      {step > 3 && formData.timeSlot && (
        <>
          <Spacer />
          <div className="summary-item">
            <span className="summary-label">
              {formatDate(new Date(formData.date), "long")}
            </span>
            <span className="summary-value">{formData.timeSlot} | 30 mins</span>
          </div>
        </>
      )}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1: // Condition & Location
        return (
          <div className="fade-in">
            <div className="mb-3">
              <label className="field-label">Condition</label>
              <select
                className="form-select med-input"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
              >
                <option>OB - GYN</option>
                <option>General Medicine</option>
                <option>Cardiology</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="field-label">City</label>
              <select
                className="form-select med-input"
                value={formData.location_city}
                onChange={(e) =>
                  setFormData({ ...formData, location_city: e.target.value })
                }
              >
                <option>Haughton, LA</option>
                <option>Shreveport, LA</option>
                <option>Bossier City, LA</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="field-label">Location</label>
              <input
                className="form-control"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>
        );

      case 2: // Doctor Location
        return (
          <div className="fade-in">
            <SelectionSummary />

            <div className="d-flex justify-content-between align-items-center mb-2">
              <p className="fw-bold mb-0">Select a Provider</p>
              {doctors.length > 0 && (
                <span className="badge bg-light text-dark border">
                  {doctors.length} available
                </span>
              )}
            </div>

            <div className="search-wrapper mb-3 position-relative">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={fetchingDoctors && doctors.length === 0}
              />
              {fetchingDoctors && (
                <div className="input-loader" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>

            <div className="doctor-list-container custom-scrollbar">
              {/* --- LOADING STATE (Skeletons) --- */}
              {fetchingDoctors &&
                doctors.length === 0 &&
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="doctor-select-card skeleton-loading mb-2"
                  >
                    <div className="skeleton-avatar" />
                    <div className="ms-3 flex-grow-1">
                      <div className="skeleton-line w-50" />
                      <div className="skeleton-line w-25 mt-2" />
                    </div>
                  </div>
                ))}

              {/* --- RESULTS STATE --- */}
              {!fetchingDoctors &&
                filteredDoctors.map((doc) => {
                  const isSelected = formData.doctor?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      role="button"
                      tabIndex={0}
                      className={`doctor-select-card ${isSelected ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, doctor: doc })}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        setFormData({ ...formData, doctor: doc })
                      }
                    >
                      <div className="doctor-avatar-circle overflow-hidden shadow-sm">
                        {doc.avatar_url ? (
                          <img
                            src={getAssetUrl(doc.avatar_url)}
                            alt={`Dr. ${doc.last_name}`}
                            className="doctor-avatar-circle"
                            loading="lazy"
                          />
                        ) : (
                          <span className="doctor-avatar-circle">
                            {getInitials(doc.first_name, doc.last_name)}
                          </span>
                        )}
                      </div>

                      <div className="ms-3 flex-grow-1">
                        <div className="fw-bold text-dark">
                          {formatFullName(doc.first_name, doc.last_name)}
                        </div>
                        <div className="text-muted small d-flex align-items-center">
                          <span className="specialty-tag">
                            {doc.specialty || "General Provider"}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="ms-auto text-teal pulse-check">
                          <i className="fa-solid fa-circle-check fs-5"></i>
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* --- EMPTY STATE --- */}
              {!fetchingDoctors && filteredDoctors.length === 0 && (
                <div className="text-center py-5 empty-state">
                  <p className="fw-bold mb-1">No providers found</p>
                  <p className="text-muted small">
                    Try adjusting your search or filters.
                  </p>
                  {searchQuery && (
                    <button
                      className="btn btn-link text-teal p-0 small"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Time Selection
        return (
          <div className="fade-in">
            <SelectionSummary />
            <p className="fw-bold mb-1">Consultation Date</p>
            <input
              type="date"
              className="form-control med-input mb-4"
              value={formData.date}
              // Prevent booking in the past
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateField("date", e.target.value)}
            />
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <p className="fw-bold mb-0">Select Time Slot</p>
                {!fetchingSlots && availableSlots.length > 0 && (
                  <span className="badge bg-light text-dark border">
                    {availableSlots.length} slots free
                  </span>
                )}
              </div>

              {fetchingSlots ? (
                <div className="grid-times">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="time-btn skeleton-pulse"
                      style={{ height: "45px", border: "none" }}
                    />
                  ))}
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid-times">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`time-btn ${formData.timeSlot === slot ? "active" : ""}`}
                      onClick={() => updateField("timeSlot", slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="alert alert-warning small">
                  No slots available for this date. Please try another day.
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Basic Info
        return (
          <div className="fade-in">
            <SelectionSummary />
            <p className="fw-bold mb-4">Enter Your Details</p>
            <div className="row g-3">
              <div className="col-6">
                <input
                  className="form-control med-input"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>
              <div className="col-6">
                <input
                  className="form-control med-input"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control med-input"
                  placeholder="Phone No."
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control med-input"
                  placeholder="Email ID"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
                <small className="text-muted mt-1 d-block">
                  We'll send a 6-digit verification code to this email.
                </small>
              </div>
            </div>
          </div>
        );

      case 5: // OTP Verification
        return (
          <div className="fade-in">
            <SelectionSummary />
            <div
              className="card-lite card-blue-bg p-4 rounded-4 mb-4"
              style={{
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
              }}
            >
              <div className="fw-bold fs-5 mb-1">
                {formData.userExists ? "Welcome Back!" : "Verify Your Identity"}
              </div>
              <p className="text-muted small mb-4 fst-italic">
                Please confirm its you by providing the code sent on your email{" "}
                <span className="fw-bold text-dark">{formData.email}</span>
              </p>

              {formData.userExists && (
                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-white rounded-3 shadow-sm">
                  <div
                    className="doctor-avatar-circle"
                    style={{ width: "50px", height: "50px" }}
                  >
                    {formData.profilePic ? (
                      <img
                        src={formData.profilePic}
                        className="rounded-circle w-100"
                      />
                    ) : (
                      getInitials(formData.firstName, formData.lastName)
                    )}
                  </div>
                  <div>
                    <div className="fw-bold">
                      {formData.firstName} {formData.lastName}
                    </div>
                    <div className="text-muted small">{formData.phone}</div>
                  </div>
                  <button
                    className="btn btn-link btn-sm ms-auto text-decoration-none"
                    onClick={() => setStep(4)}
                  >
                    Not you?
                  </button>
                </div>
              )}

              <label className="field-label">Enter Code</label>
              <input
                className="form-control med-input text-center fs-3"
                style={{ letterSpacing: "8px" }}
                maxLength={6}
                value={formData.otpCode}
                onChange={(e) => updateField("otpCode", e.target.value)}
                placeholder="000000"
              />
              <div className="text-center mt-3">
                {resendTimer > 0 ? (
                  <span className="text-muted small">
                    Resend code in{" "}
                    <span className="fw-bold">{resendTimer}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link text-teal btn-sm fw-bold text-decoration-none"
                    onClick={handleResendOTP}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Resend Code"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 6: // Detailed Info
        return (
          <div className="fade-in">
            <h5 className="fw-bold mb-3">
              {formData.userExists
                ? "Confirm Your Information"
                : "Complete Your Profile"}
            </h5>
            <div className="row g-3">
              <div className="col-6">
                <label className="field-label">First Name</label>
                <input
                  className="form-control med-input"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="field-label">Last Name</label>
                <input
                  className="form-control med-input"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="field-label">Phone Number</label>
                <input
                  className="form-control med-input"
                  placeholder="Phone No."
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="field-label">Date of Birth</label>
                <input
                  type="date"
                  placeholder="Date of Birth"
                  className="form-control med-input"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="field-label">Address Street 1</label>
                <input
                  className="form-control med-input"
                  placeholder="Address Street 1"
                  value={formData.address1}
                  onChange={(e) => updateField("address1", e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="field-label">Address Street 2</label>
                <input
                  className="form-control med-input"
                  placeholder="Address Street 2"
                  value={formData.address2}
                  onChange={(e) => updateField("address2", e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="field-label">Region</label>
                <select
                  className="form-select form-control med-input"
                  value={formData.region}
                  onChange={(e) => updateField("region", e.target.value)}
                >
                  <option value="">Select Region</option>
                  <option>Louisiana</option>
                  <option>Texas</option>
                </select>
              </div>
              <div className="col-6">
                <label className="field-label">City</label>
                <input
                  className="form-control med-input"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="field-label">Zip Code</label>
                <input
                  className="form-control med-input"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={(e) => updateField("zipCode", e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="field-label">Reason for Visit</label>
                <textarea
                  className="form-control med-input"
                  rows={3}
                  value={formData.reasonToVisit}
                  onChange={(e) => updateField("reasonToVisit", e.target.value)}
                  placeholder="Tell us more about your symptoms..."
                />
              </div>

              <div className="col-12 mt-3">
                <div className="card-lite d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span>
                      {formData.documents.length > 0
                        ? `${formData.documents.length} file(s) selected`
                        : "Upload Documents (Max 5)"}
                    </span>
                  </div>
                  <label
                    className="btn btn-sm btn-outline-secondary"
                    style={{ cursor: "pointer" }}
                  >
                    Choose files
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      style={{ display: "none" }}
                      disabled={loading || formData.documents.length >= 5}
                    />
                  </label>
                </div>
                {formData.documents.length > 0 && (
                  <div className="mt-2">
                    {formData.documents.map((file, index) => (
                      <div
                        key={index}
                        className="small text-muted d-flex justify-content-between"
                      >
                        <span>• {file.name}</span>
                        <span className="text-success small">Uploaded ✓</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 7: // Success
        return (
          <div className="fade-in">
            {/* Patient Details at the top */}
            <div className="text-center mb-5">
              <h5 className="fw-bold mb-5">Appointment Booked Successfully</h5>
              <div className="position-relative d-inline-block mb-3">
                <div
                  className="doctor-avatar-circle"
                  style={{ width: "80px", height: "80px", fontSize: "24px" }}
                >
                  {formData.profilePic ? (
                    <img
                      src={formData.profilePic}
                      className="rounded-circle w-100"
                    />
                  ) : (
                    getInitials(formData.firstName, formData.lastName)
                  )}
                </div>
                <div
                  className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                  style={{ width: "20px", height: "20px" }}
                >
                  <i
                    className="fa fa-check text-white"
                    style={{
                      fontSize: "10px",
                      verticalAlign: "middle",
                      display: "block",
                      marginTop: "4px",
                    }}
                  ></i>
                </div>
              </div>
              <p className="text-muted">
                {formData.firstName} {formData.lastName}
              </p>
              <div className="badge bg-light text-dark border p-3">
                <span className="text-teal fw-bold">
                  {calculateAge(formData.dateOfBirth)}
                </span>
                <span className="mx-2 text-muted">|</span>
                <span>{formData.email}</span>
                <span className="mx-2 text-muted">|</span>
                <span>{formData.phone}</span>
              </div>
            </div>

            {/* Summary at the bottom */}
            <div className="mt-4">
              <SelectionSummary />
            </div>

            <div className="text-center mt-5">
              <Button
                variant="primary"
                className="w-100 py-3 rounded-pill"
                onClick={onClose}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="medaea-modal-overlay">
      <div className="medaea-modal-card">
        {step < 7 && (
          <div className="modal-header-container">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold">Book an appointment</h5>
                <small className="text-muted">
                  Step {step} of {totalSteps}
                </small>
              </div>
              <button className="btn-close" onClick={onClose}></button>
            </div>
            <div
              className="step-indicator-wrapper"
              style={
                {
                  "--progress-width": `${progressPercent}%`,
                } as React.CSSProperties
              }
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`step-dot ${i <= step ? "active" : ""}`}
                ></div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-scroll-area">{renderStep()}</div>

        {step < 7 && (
          <div className="modal-footer p-4">
            <Button
              variant="secondary"
              onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            <Button
              variant="primary"
              disabled={
                loading ||
                (step === 1 &&
                  (!formData.condition || !formData.location_city)) ||
                (step === 2 && !formData.doctor) ||
                (step === 3 && !formData.timeSlot) ||
                (step === 4 && (!formData.email || !formData.firstName)) || // Basic validation
                (step === 5 && formData.otpCode.length !== 6)
              }
              onClick={() => {
                if (step === 4) {
                  handleSendOTP(); // Call your OTP logic here
                } else if (step === 5) {
                  handleVerifyOTP(); // Assuming you have a verify function for Step 5
                } else if (step === 6) {
                  handleBookAppointment(); // Final booking logic
                } else {
                  setStep(step + 1);
                }
              }}
            >
              {step === 6 ? "Confirm Booking" : "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
