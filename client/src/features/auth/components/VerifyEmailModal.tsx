import React, { useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { resendVerificationEmail } from "../../../api/auth";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import type { ApiErrorResponse } from "../../../types/api.types";
import type { AxiosError } from "axios";
import axios from "axios";

interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string; // The email to resend to
}

const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const { showToast } = useToast();
  const [isResending, setIsResending] = useState(false);

  // --- Resend Logic ---
  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      await resendVerificationEmail({ email });
      showToast("Verification email sent! Please check your inbox.", "success");
    } catch (error: unknown) {
      let msg = "Failed to resend email.";

      // Check if it is an Axios Error
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ApiErrorResponse>; // Cast to specific type

        if (apiError.response?.data?.detail) {
          const detail = apiError.response.data.detail;

          // Handle case where detail is a simple string (most common for logic errors)
          if (typeof detail === "string") {
            msg = detail;
          }
          // Handle case where detail is an array (validation errors)
          else if (Array.isArray(detail) && detail.length > 0) {
            msg = detail[0].msg; // Grab the first validation message
          }
        }
      }
      // Handle generic Javascript errors
      else if (error instanceof Error) {
        msg = error.message;
      }

      showToast(msg, "error");
    } finally {
      setIsResending(false);
    }
  };

  // Custom icon for the modal header
  const EnvelopeIcon = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
      }}
    >
      <i className="fas fa-envelope-open-text"></i>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Check Your Email"
      icon={EnvelopeIcon}
      iconColor="teal"
      maxWidth="480px"
      preventClose={true}
    >
      <div className="text-center">
        <p
          className="text-muted-custom mb-4"
          style={{ fontSize: "15px", lineHeight: "1.6" }}
        >
          We have sent a verification link to: <br />
          <strong>{email}</strong>
        </p>

        <div
          className="alert alert-custom-info mb-4"
          style={{
            backgroundColor: "#e0f2f1",
            color: "#00695c",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px",
            textAlign: "left",
          }}
        >
          <i className="fas fa-info-circle me-2"></i>
          <strong>Next Step:</strong> Click the link in the email to activate
          your account. You will not be able to log in until your email is
          verified.
        </div>

        <div className="d-flex flex-column gap-2">
          {/* Main Action: Go to Login (closes modal) */}
          <Button onClick={onClose} fullWidth>
            Go to Login
          </Button>

          {/* Secondary Action: Resend Email */}
          <button
            className="btn-link-custom mt-2"
            style={{
              background: "none",
              border: "none",
              color: isResending ? "#999" : "#666",
              fontSize: "13px",
              cursor: isResending ? "not-allowed" : "pointer",
              textDecoration: "underline",
              transition: "color 0.2s",
            }}
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <span>
                <i className="fas fa-spinner fa-spin me-2"></i> Sending...
              </span>
            ) : (
              "Didn't receive the email? Click to resend"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VerifyEmailModal;
