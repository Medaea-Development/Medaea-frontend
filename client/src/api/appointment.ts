import type { AppointmentCreatePayload, AppointmentRead, Doctor, OTPResponse, OTPVerifyPayload } from "../types/appointment.type";
import { api } from "./client";

/**
 * STEP 4: Initiate booking and send OTP
 * This creates the draft record in the backend.
 */
export const sendBookingOTP = async (email: string, doctorId: string): Promise<OTPResponse> => {
  const response = await api.post<OTPResponse>('/calendar/send-otp', { email, doctor_id: doctorId });
  return response.data;
};

/**
 * STEP 5: Verify the 6-digit code
 */
export const verifyBookingOTP = async (payload: OTPVerifyPayload) => {
  const response = await api.post('/calendar/verify-otp', payload);
  return response.data;
};

/**
 * STEP 6: Upload Medical Documents (Multi-file)
 * Returns the S3/Storage URLs to be saved with the appointment.
 */
export const uploadMedicalDocuments = async (files: File[], appointmentId: string): Promise<{ document_urls: string[] }> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await api.post<{ document_urls: string[] }>(
    `/calendar/upload-medical-docs/${appointmentId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
};

/**
 * FINAL STEP: Confirm the full booking
 * We pass the appointment_id as a query param to update the verified draft.
 */
export const confirmAppointment = async (
  appointmentId: string,
  payload: AppointmentCreatePayload
) => {
  const response = await api.post(
    `/calendar/book-for-patient?appointment_id=${appointmentId}`,
    payload
  );
  return response.data;
};

export const searchDoctors = async (specialty?: string, city?: string): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>('/calendar/search-doctors', {
    params: { specialty, city }
  });
  return response.data;
};

/**
 * Fetches available 30-min slots for a specific doctor on a specific date.
 */
export const getAvailableSlots = async (doctorId: string, date: string): Promise<string[]> => {
  const response = await api.get<string[]>('/calendar/slots', {
    params: {
      doctor_id: doctorId,
      booking_date: date
    }
  });
  return response.data;
};

export const getMyAppointments = async (): Promise<AppointmentRead[]> => {
  const response = await api.get<AppointmentRead[]>('/appointments/me');
  const data = response.data;
  return Array.isArray(data) ? data : [];
};