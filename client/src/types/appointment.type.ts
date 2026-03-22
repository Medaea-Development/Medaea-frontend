export interface OTPRequest {
  email: string;
}

export interface OTPResponse {
  user_exists: boolean;
  appointment_id: string; // The "Session ID" for this booking
  user_data?: {
    first_name: string;
    last_name: string;
    phone: string;
    profile_picture?: string;
  };
}

export interface OTPVerifyPayload {
  appointment_id: string;
  otp_code: string;
  email: string;
}

export interface AppointmentCreatePayload {
  // Step 4 & 6 Identity
  patient_first_name: string;
  patient_last_name: string;
  patient_email: string;
  patient_phone: string;
  patient_date_of_birth?: string; // YYYY-MM-DD

  // Step 6 Address
  address_line1: string;
  address_line2?: string;
  city: string;
  region: string;
  zip_code: string;

  // Step 1, 2, 3 Logic
  doctor_id: string | null;
  org_id: string | null;
  start_time: string; // ISO String
  condition_type: string;
  reason: string;
  notes?: string;
  document_urls?: string[];
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  avatar_url?: string;
  city?: string;
}

export type AppointmentStatus = "pending_verification" | "scheduled" | "cancelled" | "completed";

export interface AppointmentRead {
  id: string; // UUID
  start_time: string; // ISO DateTime string
  end_time: string;   // ISO DateTime string
  status: AppointmentStatus;
  condition_type: string;
  reason?: string;
  patient_id?: string;
  
  // These are the flattened fields we mapped in the Pydantic validator
  patient_first_name?: string;
  patient_last_name?: string;
  patient_email?: string;
  patient_phone?: string;
}

// Useful for the "Month View" badges
export interface CalendarSummary {
  [dateKey: string]: {
    type: 'visits' | 'calls' | 'tasks';
    count: number;
  }[];
}