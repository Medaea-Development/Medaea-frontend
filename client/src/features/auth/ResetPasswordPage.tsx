import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useToast } from "../../hooks/useToast";
import { APP_ROUTES } from "../../config/constants";
import { COLORS } from "../../config/colors"; // Importing your color palette
import { validatePasswordStrength } from "../../utils/validation";
import { resetPassword } from "../../api/auth";
import axios from "axios";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time validation
  useEffect(() => {
    if (password) {
      const { errors } = validatePasswordStrength(password);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password]);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation Check (using your custom utils)
    const strength = validatePasswordStrength(password);
    if (!strength.isValid) {
      showToast("Password does not meet requirements", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setIsLoading(true);

    try {
      // 2. API Integration
      // Ensure your resetPasswordApi is defined to accept token and new_password
      await resetPassword({
        token: token || "",
        new_password: password,
      });

      showToast("Password updated successfully! Please log in.", "success");
      navigate(APP_ROUTES.LOGIN);
    } catch (error: unknown) {
      // 3. Type-Safe Catch
      let errorMessage = "An unexpected error occurred.";

      if (axios.isAxiosError(error)) {
        // Backend detail or general axios message
        errorMessage =
          error.response?.data?.detail || "The reset link may have expired.";
      }

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card-custom p-4 shadow-sm">
        <h2 className="h4 font-weight-bold mb-2">Create New Password</h2>
        <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          Your new password must be different from previous passwords.
        </p>

        <form onSubmit={handleResetSubmit}>
          <Input
            label="New Password"
            type="password"
            placeholder="Min. 12 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Real-time Password Requirements UI */}
          {password.length > 0 && (
            <div
              className="mb-3 p-2 rounded bg-light"
              style={{ fontSize: "0.8rem" }}
            >
              <p className="mb-1 font-weight-bold">Requirements:</p>
              <ul className="list-unstyled mb-0">
                {[
                  "At least 12 characters",
                  "One uppercase letter",
                  "One lowercase letter",
                  "One number",
                  "One special character (!@#$%^&*)",
                ].map((req) => {
                  const isMissing = passwordErrors.includes(req);
                  return (
                    <li
                      key={req}
                      style={{
                        color: isMissing ? COLORS.danger : COLORS.success,
                      }}
                    >
                      <i
                        className={`fas ${isMissing ? "fa-times" : "fa-check"} me-2`}
                      ></i>
                      {req}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            style={{ backgroundColor: COLORS.primary }}
          >
            Reset Password
          </Button>
        </form>
      </div>
      {isLoading && (
        <Loader variant="fullscreen" message="Updating password..." />
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
