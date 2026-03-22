import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import ShieldIcon from "../../../assets/img/ic-shield.svg";
import type { MfaMethod } from "../../../types/auth.types";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  mfaMethod?: MfaMethod;
  isVerifying?: boolean;
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  mfaMethod = "authenticator",
  isVerifying = false,
}) => {
  // Reset otp and timer based on isOpen state, not in useEffect
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const previousIsOpenRef = useRef(false);

  // Only focus input when modal opens (side effect only, no state)
  useEffect(() => {
    if (isOpen && !previousIsOpenRef.current) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
    previousIsOpenRef.current = isOpen;
  }, [isOpen]);

  // Timer logic for Resend
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Determine initial state based on isOpen
  if (isOpen && otp[0] === "") {
    // Modal just opened, reset state (not in effect, in render)
    const newOtp = new Array(6).fill("");
    if (JSON.stringify(newOtp) !== JSON.stringify(otp)) {
      setOtp(newOtp);
    }

    if (mfaMethod !== "authenticator" && resendTimer === 0) {
      setResendTimer(60);
    } else if (mfaMethod === "authenticator" && resendTimer > 0) {
      setResendTimer(0);
    }
  }

  if (!isOpen && otp[0] !== "") {
    // Modal closed, reset
    setOtp(new Array(6).fill(""));
    setResendTimer(0);
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value;
      if (/[^0-9]/.test(value)) return;

      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value.substring(value.length - 1);
        return newOtp;
      });

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace") {
        setOtp((prevOtp) => {
          if (!prevOtp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
          }
          return prevOtp;
        });
      }
    },
    [],
  );

  const handleVerify = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const fullCode = otp.join("");
      if (fullCode.length === 6) {
        onVerify(fullCode);
      }
    },
    [otp, onVerify],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 6)
      .split("");

    if (pasteData.every((char) => !isNaN(Number(char)))) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        pasteData.forEach((char, i) => (newOtp[i] = char));
        return newOtp;
      });

      setTimeout(() => {
        inputRefs.current[Math.min(pasteData.length, 5)]?.focus();
      }, 0);
    }
  }, []);

  const handleResend = useCallback(() => {
    setResendTimer(60);
  }, []);

  // Dynamic UI Content based on Method
  const getContent = useMemo(() => {
    switch (mfaMethod) {
      case "email":
        return {
          title: "Verify Your Email",
          subtitle:
            "We've sent a 6-digit code to your registered email address.",
          icon: ShieldIcon,
        };
      case "sms":
        return {
          title: "Verify Your Phone",
          subtitle: "A 6-digit text message was sent to your mobile device.",
          icon: ShieldIcon,
        };
      default:
        return {
          title: "Security Verification",
          subtitle:
            "Enter the 6-digit code from your Authenticator App (Google, Authy, etc.)",
          icon: ShieldIcon,
        };
    }
  }, [mfaMethod]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getContent.title}
      subtitle={getContent.subtitle}
      icon={
        <img
          src={getContent.icon as string}
          alt="icon"
          style={{ width: 28, height: 28 }}
        />
      }
      iconColor="teal"
    >
      <form onSubmit={handleVerify}>
        <div className="modal-body py-4">
          <div className="otp-input-container mb-4" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                className="otp-input"
                style={{ borderColor: data ? "#00a896" : "#e2e8f0" }}
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={data}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isVerifying}
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={otp.some((v) => v === "") || isVerifying}
            className="w-100"
          >
            {isVerifying ? "Verifying..." : "Confirm & Access Account"}
          </Button>

          {(mfaMethod === "email" || mfaMethod === "sms") && (
            <div className="text-center mt-4">
              <p className="text-muted small">
                Didn't receive a code?{" "}
                {resendTimer > 0 ? (
                  <span className="fw-bold" style={{ color: "#00a896" }}>
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-link p-0 small fw-bold"
                    style={{ color: "#00a896", textDecoration: "none" }}
                    onClick={handleResend}
                  >
                    Resend Code
                  </button>
                )}
              </p>
            </div>
          )}

          <div className="text-center mt-3">
            <a
              href="#"
              className="modal-link"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default OtpModal;
