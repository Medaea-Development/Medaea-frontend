import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import type { MfaMethod } from "../../../types/auth.types";

import "../../../assets/css/mfa.css";
import {
  disableMfa,
  finalizeMfaSetup,
  initiateMfaSetup,
} from "../../../api/auth";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";

interface MfaSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: MfaMethod) => void;
}

const MfaSetupWizard: React.FC<MfaSetupWizardProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<
    "select" | "setup" | "verify" | "recovery" | "disable_confirm"
  >("select");

  const [setupData, setSetupData] = useState({
    qrCode: "",
    secret: "",
    backupCodes: [""],
  });
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

  const [isDisabling, setIsDisabling] = useState(false);

  const { user, refreshUser } = useAuth();

  const mfaEnabled = user?.mfa_enabled;
  const activeMethod = user?.mfa_method;

  const [selectedMethod, setSelectedMethod] = useState<MfaMethod>(
    activeMethod || "authenticator",
  );

  const { showToast } = useToast();

  const handleInputChange = (value: string, index: number) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.substring(value.length - 1); // Only take last char
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleStartSetup = async () => {
    try {
      // 1. Call the initiate endpoint
      const data = await initiateMfaSetup(selectedMethod);

      // 2. data contains { qr_code: "...", secret: "..." }
      setSetupData((prev) => ({
        ...prev,
        qrCode: data.qr_code || "",
        secret: data.secret || "",
      }));

      // --- FLOW BRANCHING ---
      if (selectedMethod === "authenticator") {
        setStep("setup"); // Go to QR scan step
      } else {
        showToast(
          `Verification code sent to your ${selectedMethod}`,
          "success",
        );
        setStep("verify"); // Skip QR scan, go to code entry
      }
    } catch (error) {
      // You should use a toast notification here for EHR production
      console.error("Failed to initiate MFA setup", error);
      showToast("Failed to initiate MFA setup. Please try again.", "error");
    }
  };

  const handleFinalVerify = async (code: string) => {
    try {
      // 1. Send the 6-digit code to the backend to "lock in" the MFA
      const response = await finalizeMfaSetup(code, selectedMethod);

      if (response.user) {
        refreshUser(response.user);
      }

      if (selectedMethod === "authenticator") {
        // Show Recovery Codes only for Authenticator App
        setSetupData((prev) => ({
          ...prev,
          backupCodes: response.backup_codes || [],
        }));
        setStep("recovery");
      } else {
        // Directly finish for Email/SMS
        showToast(`${selectedMethod} MFA enabled successfully!`, "success");
        onSuccess(selectedMethod); // Close modal and refresh UI
      }
    } catch (error) {
      console.error("Verification failed", error);
      // Important: Alert the user the code was wrong/expired
      showToast("Invalid verification code. Please try again.", "error");
    }
  };

  const handleStartDisable = async () => {
    if (!activeMethod) {
      showToast("No active MFA method found.", "error");
      return;
    }

    try {
      // 1. Tell the backend to send a code to the CURRENT method
      // This uses your existing initiate endpoint which handles email/sms logic
      await initiateMfaSetup(activeMethod);

      // 2. Only then move to the verify step
      setIsDisabling(true);
      setOtpValues(Array(6).fill(""));
      setStep("verify");

      showToast(
        `A verification code has been sent to your ${activeMethod}.`,
        "success",
      );
    } catch (error) {
      console.error("Failed to start disable process", error);
      showToast("Failed to send verification code. Please try again.", "error");
    }
  };

  const handleFinalDisable = async (code: string) => {
    try {
      // Pass the code to the backend to authorize the disabling
      const response = await disableMfa(code);

      if (response.user) {
        refreshUser(response.user);
      }

      showToast("MFA has been successfully disabled.", "success");
      onClose();
    } catch (error) {
      console.error("Failed to disable MFA", error);
      showToast("Invalid verification code. Please try again.", "error");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      // If current input is empty and not the first box, move focus back
      if (!otpValues[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").trim();
    if (data.length === 6 && /^\d+$/.test(data)) {
      const newOtp = data.split("");
      setOtpValues(newOtp);
      // Focus the last input after pasting
      document.getElementById(`otp-5`)?.focus();
    }
  };

  const getModalTitle = () => {
    if (isDisabling) return "Disable Two-Factor Authentication";

    switch (step) {
      case "select":
        return "Choose MFA Method";
      case "setup":
        return "Scan QR Code";
      case "verify":
        return "Verify Your Identity";
      case "recovery":
        return "Security Recovery Codes";
      default:
        return "Two-Factor Authentication";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      maxWidth="500px"
    >
      <div className="wizard-body">
        {step === "select" && (
          <>
            <p className="step-description">
              {mfaEnabled
                ? `You are currently using ${activeMethod}. You must disable it to make changes.`
                : "Add an extra layer of security to your Medaea Health account."}
            </p>
            <div className="method-list">
              {(["authenticator", "email", "sms"] as MfaMethod[]).map((m) => {
                const isSelected = selectedMethod === m; // Check against current selection
                const isCurrentlyActive = activeMethod === m; // Check against DB state
                const isDisabled = mfaEnabled && !isCurrentlyActive;

                return (
                  <div
                    key={m}
                    className={`method-item 
                      ${isSelected ? "active" : ""} 
                      ${isDisabled ? "disabled-grayscale" : ""}
                    `}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedMethod(m); // This now correctly updates the 'active' class
                      }
                    }}
                  >
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <span className="method-name">
                        {m === "authenticator"
                          ? "Authenticator App"
                          : m.toUpperCase()}
                      </span>
                      {isCurrentlyActive && mfaEnabled && (
                        <span className="badge bg-primary">Active</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {mfaEnabled ? (
              <Button
                className="w-100 btn-danger"
                onClick={() => setStep("disable_confirm")} // Create a new step for disabling
              >
                Disable Current MFA
              </Button>
            ) : (
              <Button className="w-100" onClick={handleStartSetup}>
                Continue
              </Button>
            )}
          </>
        )}

        {step === "setup" && (
          <div className="text-center animate-fade-in">
            <h6 className="fw-bold">Scan with Authenticator</h6>

            <div className="qr-frame">
              {setupData.qrCode ? (
                <img
                  src={`data:image/png;base64,${setupData.qrCode}`}
                  alt="MFA QR Code"
                  style={{ width: 180, height: 180, display: "block" }}
                />
              ) : (
                <div className="qr-placeholder">Generating...</div>
              )}
            </div>

            <p className="small text-muted">
              Or enter manually:{" "}
              <span className="secret-key-display">{setupData.secret}</span>
            </p>

            <Button className="w-100 mt-3" onClick={() => setStep("verify")}>
              I've Scanned the Code
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="text-center">
            <p className="mb-4">
              {isDisabling
                ? `Enter the 6-digit code to confirm disabling MFA`
                : selectedMethod === "authenticator"
                  ? "Enter the 6-digit code from your Authenticator App"
                  : `Enter the 6-digit code sent to your ${selectedMethod}`}
            </p>
            {/* You would use your OTP inputs here */}
            <div className="d-flex justify-content-center gap-2 mb-4">
              {otpValues.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="otp-input"
                  style={{ width: 40, height: 50, textAlign: "center" }}
                  maxLength={1}
                />
              ))}
            </div>
            <Button
              className={`w-100 ${isDisabling ? "btn-danger" : ""}`}
              disabled={otpValues.some((v) => v === "")}
              onClick={() => {
                const fullCode = otpValues.join("");
                if (isDisabling) {
                  handleFinalDisable(fullCode);
                } else {
                  handleFinalVerify(fullCode);
                }
              }}
            >
              {isDisabling ? "Confirm & Disable" : "Verify & Enable"}
            </Button>
            <Button
              className="mt-2 bg-secondary"
              onClick={() => {
                setIsDisabling(false);
                setOtpValues(Array(6).fill("")); // Clear codes
                setStep("select");
              }}
            >
              Back
            </Button>
            {activeMethod !== "authenticator" && (
              <p className="mt-3 small">
                Didn't receive a code?{" "}
                <button
                  className="btn btn-link p-0 m-0 small"
                  onClick={isDisabling ? handleStartDisable : handleStartSetup}
                  type="button"
                >
                  Resend Code
                </button>
              </p>
            )}
          </div>
        )}

        {step === "recovery" && (
          <div className="animate-fade-in">
            <div className="recovery-alert p-3 border rounded bg-light mb-3">
              <h6 className="fw-bold text-danger mb-2">
                Save Your Recovery Codes
              </h6>
              <p className="x-small text-muted mb-3">
                If you lose your device, these codes are the ONLY way to access
                your account.
              </p>

              {/* Grid for codes */}
              <div
                className="codes-grid d-grid"
                style={{ gridTemplateColumns: "1fr 1fr", gap: "10px" }}
              >
                {setupData.backupCodes && setupData.backupCodes.length > 0 ? (
                  setupData.backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="recovery-code-item p-2 text-center font-monospace border rounded bg-white"
                      style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
                    >
                      {code}
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No codes received.</div>
                )}
              </div>
            </div>

            <Button
              className="w-100"
              variant="primary"
              onClick={() => onSuccess(selectedMethod)}
            >
              Finish & Close
            </Button>
          </div>
        )}

        {step === "disable_confirm" && (
          <div className="text-center animate-fade-in">
            <div className="mb-4">
              <h5 className="fw-bold">Security Challenge Required</h5>
              <p className="text-muted">
                To disable MFA, you must enter a code from your{" "}
                <strong>{activeMethod}</strong>.
              </p>
            </div>

            <div className="d-flex flex-column gap-2">
              <Button className="w-100 btn-danger" onClick={handleStartDisable}>
                Continue to Verification
              </Button>
              <Button
                variant="ghost"
                className="w-100"
                onClick={() => setStep("select")}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MfaSetupWizard;
