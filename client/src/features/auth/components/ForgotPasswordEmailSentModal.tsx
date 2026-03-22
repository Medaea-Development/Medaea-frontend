import React from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

interface ForgotPasswordEmailSentModalProps {
  isOpen: boolean;
  onClose: () => void; // This acts as "Back to Sign In"
  email: string;
}

const CustomIcon = (
  <i
    className="fas"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.4344 11.6664C25.9672 14.2813 25.5875 16.9997 24.3585 19.3685C23.1296 21.7373 21.1257 23.6131 18.6811 24.6833C16.2365 25.7534 13.4989 25.9532 10.9249 25.2492C8.35084 24.5452 6.09593 22.98 4.53619 20.8147C2.97646 18.6494 2.20618 16.0149 2.35381 13.3504C2.50145 10.6859 3.55806 8.15252 5.34746 6.17278C7.13686 4.19304 9.55088 2.88658 12.1869 2.47127C14.823 2.05597 17.5218 2.55691 19.8332 3.89058"
        stroke="#00A63E"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M10.5 12.8332L14 16.3332L25.6667 4.6665"
        stroke="#00A63E"
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  </i>
);

const ForgotPasswordEmailSentModal: React.FC<
  ForgotPasswordEmailSentModalProps
> = ({ isOpen, onClose, email }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Check Your Email"
      subtitle={`We've sent password reset instructions to <strong>${email}</strong>`}
      icon={CustomIcon}
      iconColor="green"
    >
      <div className="next-steps-box">
        <h4>Next Steps:</h4>
        <ol>
          <li>Check your email inbox</li>
          <li>Click the reset link (valid for 24 hours)</li>
          <li>Create a new password meeting NIST requirements</li>
          <li>Sign in with your new password</li>
        </ol>
      </div>

      <Button onClick={onClose}>Back to Sign In</Button>

      <div className="helper-text">
        Didn't receive the email? Check your spam folder or contact support.
      </div>
    </Modal>
  );
};

export default ForgotPasswordEmailSentModal;
