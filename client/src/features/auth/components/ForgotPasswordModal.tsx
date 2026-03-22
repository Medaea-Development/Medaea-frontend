import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  const CustomIcon = (
    <i
      className="far"
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
          d="M25.6668 8.1665L15.1773 14.848C14.8214 15.0548 14.4171 15.1637 14.0054 15.1637C13.5938 15.1637 13.1895 15.0548 12.8335 14.848L2.3335 8.1665"
          stroke="#009689"
          strokeWidth="2.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.3335 4.6665H4.66683C3.37817 4.6665 2.3335 5.71117 2.3335 6.99984V20.9998C2.3335 22.2885 3.37817 23.3332 4.66683 23.3332H23.3335C24.6222 23.3332 25.6668 22.2885 25.6668 20.9998V6.99984C25.6668 5.71117 24.6222 4.6665 23.3335 4.6665Z"
          stroke="#009689"
          strokeWidth="2.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </i>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Your Password"
      subtitle="Enter your work email address and we'll send you instructions to reset your password."
      icon={CustomIcon}
      iconColor="teal"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Work Email"
          type="email"
          placeholder="username@hospital.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          containerStyle={{ marginBottom: 0 }}
        />

        <Button type="submit" className="mt-4">
          Send Reset Instructions
        </Button>

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
      </form>
    </Modal>
  );
};

export default ForgotPasswordModal;
