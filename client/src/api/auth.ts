import type { AuthResponse, ForgotPasswordPayload, LoginCredentials, LoginResponse, MfaFinalizeResponse, MfaMethod, MfaSetupResponse, ResendVerificationPayload, ResetPasswordPayload, SignupPayload, UserOrg } from '../types/auth.types';
import { api } from './client';

// --- 1. LOGIN ---
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // FastAPI expects form-data for OAuth2 login, NOT JSON.
    // We must use URLSearchParams to format it correctly.
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // OAuth2 standard uses 'username'
    formData.append('password', credentials.password);

    const response = await api.post<AuthResponse>('/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

// --- 2. SIGNUP ---
export const signup = async (payload: SignupPayload) => {
    const response = await api.post('/auth/signup', payload);
    return response.data;
};

// --- 3. RESEND VERIFICATION EMAIL ---
export const resendVerificationEmail = async (payload: ResendVerificationPayload) => {
    const response = await api.post('/auth/resend-verification', payload);
    return response.data;
};

// --- 4. FORGOT PASSWORD (Request Link) ---
export const forgotPassword = async (payload: ForgotPasswordPayload) => {
    const response = await api.post('/auth/forgot-password', payload);
    return response.data;
};

// --- 5. RESET PASSWORD (Confirm New Password) ---
export const resetPassword = async (payload: ResetPasswordPayload) => {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
};

// --- 6. LOGOUT (Helper) ---
export const logout = () => {
    // 1. Remove Token from Storage
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // If you store user info
    sessionStorage.clear(); // Clear session storage just in case

    // 2. Clear Cookie (if you use them as a fallback)
    document.cookie = 'token=; Max-Age=0; path=/;';

    // 3. Reset Axios Headers
    // This ensures that if the user stays on the page, 
    // the next request won't accidentally send the old token.
    delete api.defaults.headers.common['Authorization'];

    // 4. Optional: Call Backend to Blacklist Token
    // If your backend supports it, await api.post('/auth/logout');
};

// --- 7. VERIFY EMAIL TOKEN (Used in VerifyEmailPage) ---
export const verifyEmailToken = async (token: string) => {
    // Note: We use GET because verification usually happens 
    // when a user clicks a simple link.
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
};

// --- 8. GET MY ORGANIZATIONS (Used after login to fetch orgs) ---
export const getMyOrganizations = async (): Promise<UserOrg[]> => {
    const response = await api.get<UserOrg[]>('/organizations/my-organizations');
    return response.data;
};

// --- 9. Initialize MFA ---
export const initiateMfaSetup = async (method: MfaMethod): Promise<MfaSetupResponse> => {
    const response = await api.post('/auth/mfa/setup/initiate', { method: method });
    return response.data;
};

// --- 10. Finalize MFA ---
export const finalizeMfaSetup = async (code: string, method: MfaMethod): Promise<MfaFinalizeResponse> => {
    const response = await api.post('/auth/mfa/setup/finalize', { code, method });
    return response.data;
};

// --- 11. Verify MFA ---
export const verifyMfaChallenge = async (code: string, 
  mfaToken: string, 
  method: string = "authenticator"): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/mfa/verify', { 
    code, 
    mfa_token: mfaToken, 
    method 
  });
    return response.data;
};

// --- 12. Disable MFA ---
export const disableMfa = async (code: string) => {
    const response = await api.post('/auth/mfa/disable', { code });
    return response.data;
};