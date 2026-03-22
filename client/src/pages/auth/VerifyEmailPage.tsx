import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { resendVerificationEmail } from "../../api/auth";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/ui/Button";
import "../../assets/css/default.css";
import "../../assets/css/login.css";

const VerifyEmailPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) { showToast("Please enter your email address.", "error"); return; }
    setIsLoading(true);
    try {
      await resendVerificationEmail({ email });
      showToast("Verification email resent! Check your inbox.", "success");
    } catch {
      showToast("Failed to resend. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-card">
        <div className="card-custom" style={{ textAlign: "center" }}>
          <div className="logo-icon" style={{ background: "linear-gradient(135deg,#00bba7,#009689)" }}>
            <i className="fas fa-envelope" style={{ color: "#fff", fontSize: "20px" }} />
          </div>
          <h2 className="login-title">Verify Your Email</h2>
          <p className="login-subtitle">We sent a verification link to your email address. Click the link to activate your account.</p>

          <div className="next-steps-box" style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4>Next Steps:</h4>
            <ol>
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Return here to sign in</li>
            </ol>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input className="form-control-custom" type="email" placeholder="Enter your email to resend" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: "10px" }} />
            <Button onClick={handleResend} disabled={isLoading} fullWidth variant="secondary">
              {isLoading ? "Resending..." : "Resend Verification Email"}
            </Button>
          </div>
          <Link to="/login" className="link-primary">← Back to Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
