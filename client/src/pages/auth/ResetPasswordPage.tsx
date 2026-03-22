import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { forgotPassword } from "../../api/auth";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import "../../assets/css/default.css";
import "../../assets/css/login.css";

const ResetPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    setIsLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
      showToast("Reset link sent! Check your inbox.", "success");
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-card">
        <div className="card-custom">
          <div className="brand-header" style={{ textAlign: "center", marginBottom: "24px" }}>
            <div className="logo-icon" style={{ background: "linear-gradient(135deg,#00bba7,#009689)", width: 48, height: 48 }}>
              <i className="fas fa-lock" style={{ color: "#fff", fontSize: "20px" }} />
            </div>
            <h2 className="login-title">Reset Password</h2>
            <p className="login-subtitle">Enter your email to receive a password reset link.</p>
          </div>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <Input label="Email Address" type="email" placeholder="doctor@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} required autoFocus />
              </div>
              <Button type="submit" disabled={isLoading} fullWidth>
                {isLoading ? <><i className="fas fa-spinner fa-spin me-2" />Sending...</> : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <i className="fas fa-check" style={{ color: "#065f46", fontSize: "24px" }} />
              </div>
              <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px" }}>A reset link has been sent to <strong>{email}</strong>. Please check your inbox.</p>
              <Link to="/login" className="link-primary">Back to Sign In</Link>
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Link to="/login" className="link-primary">← Back to Sign In</Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
