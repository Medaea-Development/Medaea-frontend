// Define the API URL with a fallback for safety
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Other constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Medaea EHR';

export const APP_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password', 
  RESET_PASSWORD: '/reset-password',
  CALENDAR: '/calendar',
  PATIENT: '/patient',
};