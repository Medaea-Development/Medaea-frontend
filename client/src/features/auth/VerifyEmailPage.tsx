import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { verifyEmailToken } from "../../api/auth";
import { useToast } from "../../hooks/useToast";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import { APP_ROUTES } from "../../config/constants";
import Loader from "../../components/ui/Loader";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const token = searchParams.get("token");
  const verificationAttempted = useRef(false);

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "invalid"
  >(token ? "loading" : "invalid");

  useEffect(() => {
    // If no token or we've already tried, don't do anything
    if (!token || verificationAttempted.current) return;

    // Mark as attempted immediately
    verificationAttempted.current = true;

    const verify = async () => {
      try {
        await verifyEmailToken(token);
        setStatus("success");
        showToast("Email verified successfully!", "success");
      } catch (error: unknown) {
        setStatus("error"); // Immediately switch to error state

        if (axios.isAxiosError(error)) {
          // 1. Get the specific detail from backend
          const backendDetail = error.response?.data?.detail;

          // 2. Decide what to show the user
          // If you want to hide specific technical errors, use a fallback
          const friendlyError =
            typeof backendDetail === "string"
              ? backendDetail
              : "The verification link is invalid or has expired.";

          showToast(friendlyError, "error");
        } else {
          // 3. General error if it's not an Axios error (e.g., network down)
          showToast(
            "A connection error occurred. Please try again later.",
            "error",
          );
        }
      }
    };

    verify();
  }, [token, showToast]);

  return (
    <AuthLayout>
      <div
        className="card-custom text-center p-5"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        {status === "loading" && (
          <div className="py-4">
            <Loader variant="container" message="Verifying your email..." />
          </div>
        )}

        {status === "success" && (
          <div className="py-4">
            <div className="text-success mb-3" style={{ fontSize: "3.5rem" }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="h4 mb-3">Account Verified!</h2>
            <p className="text-muted mb-4">
              Your email has been confirmed. You are ready to access Medaea EHR.
            </p>
            <Button onClick={() => navigate(APP_ROUTES.LOGIN)} fullWidth>
              Go to Sign In
            </Button>
          </div>
        )}

        {(status === "error" || status === "invalid") && (
          <div className="py-4">
            <div className="text-danger mb-3" style={{ fontSize: "3.5rem" }}>
              <i className="fas fa-times-circle"></i>
            </div>
            <h2 className="h4 mb-3">Verification Link Failed</h2>
            <p className="text-muted mb-4">
              {status === "invalid"
                ? "No verification link provided."
                : "This link may have expired or was already used."}
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate(APP_ROUTES.LOGIN)}
              fullWidth
            >
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
