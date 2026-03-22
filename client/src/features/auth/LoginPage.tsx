import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import OtpModal from "./components/OtpModal";
import OrgSelectionModal from "./components/OrgSelectionModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import ForgotPasswordEmailSentModal from "./components/ForgotPasswordEmailSentModal";
import VerifyEmailModal from "./components/VerifyEmailModal"; // Import the modal we made earlier
import { APP_ROUTES } from "../../config/constants";
import Logo from "../../assets/img/logo.svg";
import { forgotPassword, login, verifyMfaChallenge } from "../../api/auth"; // Import API
import { useToast } from "../../hooks/useToast"; // Import Toast
import type {
  LoginResponse,
  MfaMethod,
  UserData,
  UserOrg,
} from "../../types/auth.types";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/ui/Loader";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login: finalizeGlobalAuth } = useAuth();

  const [email, setEmail] = useState<string>(
    () => localStorage.getItem("rememberedUsername") || "",
  );
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState<boolean>(
    () => !!localStorage.getItem("rememberedUsername"),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  // Modals & Data
  const [showOtp, setShowOtp] = useState(false);
  const [showOrg, setShowOrg] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  const [userOrgs, setUserOrgs] = useState<UserOrg[]>([]);
  const [tempToken, setTempToken] = useState<string>("");
  const [tempUser, setTempUser] = useState<UserData | null>(null);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);

  const [mfaToken, setMfaToken] = useState<string>("");
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>("authenticator");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    // Front-end Validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Step A: Call the raw API (DO NOT use finalizeGlobalAuth yet)
      const data = (await login({ email, password })) as LoginResponse;

      // Handle "Remember Me"
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", email);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      if (data.mfa_required) {
        if (data.mfa_token && data.method) {
          setMfaToken(data.mfa_token);
          setMfaMethod(data.method);
          setShowOtp(true);
        } else {
          showToast("MFA configuration error on server", "error");
        }
      } else {
        if (data.access_token && data.user) {
          setTempToken(data.access_token);
          setTempUser(data.user);
          setUserOrgs(data.user.organizations);
          setShowOrg(true);
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail || "Invalid email or password";
        showToast(message, "error");

        // Specific field highlighting if backend returns structured errors
        if (error.response?.status === 401) {
          setErrors({ email: " ", password: "Check your credentials" });
        }
      } else {
        showToast("An unexpected error occurred", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (code: string) => {
    setIsVerifyingOtp(true);

    try {
      // Check if mfaToken actually exists before calling the API
      if (!mfaToken) {
        showToast("Session expired. Please sign in again.", "error");
        setShowOtp(false);
        return;
      }

      // Call the backend MFA verification endpoint
      const response = await verifyMfaChallenge(code, mfaToken, mfaMethod);

      // On success, we get the real access_token and user data
      setTempToken(response.access_token);
      setTempUser(response.user);
      setUserOrgs(response.user.organizations);

      setShowOtp(false);
      setShowOrg(true);
    } catch (error) {
      console.error("OTP Verification Error:", error);
      showToast("Invalid verification code", "error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // This is the ONLY place where navigation to Calendar should happen
  const handleOrgSelection = async (orgId: string) => {
    try {
      // 1. Save Org Choice to Storage
      localStorage.setItem("selectedOrganization", orgId);

      // 2. Finalize Global Auth State
      // We pass the token and user we got from Step A.
      // This function in your AuthContext should set state and localStorage.token
      await finalizeGlobalAuth({
        token: tempToken,
        user: tempUser!,
      });

      setShowOrg(false);

      // 3. Navigation happens ONLY now
      showToast("Sign in successful", "success");
      navigate(APP_ROUTES.CALENDAR);
    } catch (err) {
      console.error(err); // Log the error to satisfy linter
      showToast("Failed to finalize login", "error");
    }
  };

  // The function passed to ForgotPasswordModal
  const handleForgotPasswordSubmit = async (email: string) => {
    setIsResetLoading(true);
    try {
      // Call your backend endpoint
      await forgotPassword({ email });

      setResetEmail(email);
      setShowForgotModal(false); // Close the input modal
      setShowEmailSentModal(true); // Open the success modal
    } catch (error) {
      console.error("Forgot Password Error:", error);
      // Per your backend logic, this usually won't trigger
      // unless there's a network error or rate limit
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <AuthLayout bannerText="Scheduled system maintenance on Sunday, Jan 5, 2025 from 2:00 AM - 4:00 AM EST.">
      <div className="login-card">
        <div className="card-custom">
          <div className="brand-header">
            <div className="brand-logo-login">
              <img src={Logo} alt="Medaea EHR Logo" />
            </div>
            <h1 className="login-title">Sign in to Electronic Health Record</h1>
            <p className="login-subtitle">
              Enter your credentials to access the system
            </p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <Input
              label="Work Email"
              placeholder="username@hospital.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <div className="remember-me-wrapper">
              <div className="checkbox-custom">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember username</label>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="forgot-password-wrapper">
            <a
              href="#"
              className="link-primary"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotModal(true);
              }}
            >
              Forgot Password?
            </a>
          </div>

          <div className="divider-custom">New to Medaea EHR?</div>
          <div className="new-user-section">
            <Link to={APP_ROUTES.SIGNUP}>
              <Button variant="secondary">Create Provider Account</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onSubmit={handleForgotPasswordSubmit}
      />

      <ForgotPasswordEmailSentModal
        isOpen={showEmailSentModal}
        onClose={() => setShowEmailSentModal(false)}
        email={resetEmail}
      />

      {/* Reusing the Modal from Signup for unverified logins */}
      <VerifyEmailModal
        isOpen={showVerifyEmail}
        onClose={() => setShowVerifyEmail(false)}
        email={email}
      />

      <OtpModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleOtpVerify}
        mfaMethod={mfaMethod}
        isVerifying={isVerifyingOtp}
      />

      <OrgSelectionModal
        isOpen={showOrg}
        onClose={() => setShowOrg(false)}
        organizations={userOrgs}
        onSelect={handleOrgSelection}
      />

      {/* Fullscreen Loader during the API call */}
      {isResetLoading && (
        <Loader variant="fullscreen" message="Processing reset request..." />
      )}
    </AuthLayout>
  );
};

export default LoginPage;
