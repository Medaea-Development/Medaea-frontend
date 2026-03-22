export interface PatientProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  region: string;
  zip_code: string;
  avatar_url: string | null;
  
  // Optional clinical fields if you added them to backend
  id_number?: string;
  status?: string;
  last_visit_reason?: string;
  current_room?: string;
}