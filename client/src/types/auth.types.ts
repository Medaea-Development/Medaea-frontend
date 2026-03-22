// Login & Token Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: UserData;
    permissions?: string[]; // Optional permissions list
}

// Signup Types
// Matches the UserCreate schema from the backend
export interface SignupPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string; // 'doctor', 'nurse', 'admin', etc.
    
    // Provider Details
    npi?: string;
    dea?: string;
    licenseNumber?: string;
    licenseState?: string;
    licenseExpiry?: string; // YYYY-MM-DD
    providerType: string;
    specialty: string;

    // Organization Details
    orgName: string;
    orgType: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    department: string;

    // Consents
    hipaaConsent: boolean;
    ehrConsent: boolean;
    auditConsent: boolean;
    hieConsent: boolean;
}

// Password Reset Types
export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    new_password: string;
}

// Verification Types
export interface ResendVerificationPayload {
    email: string;
}

export interface UserOrg {
  id: string;
  name: string;
  role: string;  
  dept: string; 
  type: string;   
  icon?: string;
}

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url?: string;
  specialty?: string;
  role: string;
  mfa_enabled: boolean;
  mfa_method?: MfaMethod;
  organizations: UserOrg[];
  permissions: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserData;
  mfa_required: boolean;
  mfa_token?: string;
  method?: MfaMethod;
}

export type MfaMethod = "authenticator" | "email" | "sms";

export interface MfaStatus {
    is_enabled: boolean;
    current_method: MfaMethod;
    verified_at?: string;
    // For setup phase
    secret_qr_code?: string; // Base64 string for QR
    backup_codes_remaining?: number;
}

export interface MfaSetupResponse {
    qr_code: string;
    secret: string;
    backupCodes: string[];
}

export interface MfaFinalizeResponse {
    message: string;
    backup_codes: string[];
    user: UserData;
}

export interface MfaVerifyResponse {
    access_token: string;
    token_type: string;
    user: UserData;
}