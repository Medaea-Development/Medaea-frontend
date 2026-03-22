import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import AuthLayout from "../../components/layout/AuthLayout";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import "../../assets/css/default.css";
import "../../assets/css/login.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await (await import("../../api/auth")).login({ email, password });
      if (response.user.organizations && response.user.organizations.length > 1) {
        setPendingToken(response.access_token);
        setPendingUser(response.user);
        setOrgModalOpen(true);
      } else {
        await login({ token: response.access_token, user: response.user });
        showToast(`Welcome back, ${response.user.first_name}!`, "success");
        navigate("/calendar");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Login failed. Please check your credentials.";
      showToast(typeof msg === "string" ? msg : "Login failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrgSelect = async () => {
    if (!pendingToken || !pendingUser) return;
    await login({ token: pendingToken, user: pendingUser });
    setOrgModalOpen(false);
    showToast(`Welcome back, ${pendingUser.first_name}!`, "success");
    navigate("/calendar");
  };

  return (
    <AuthLayout bannerText="Scheduled maintenance on June 15, 2025 at 2:00 AM EST. System will be unavailable for approximately 1 hour.">
      <div className="login-card">
        <div className="card-custom">
          <div className="brand-header">
            <div className="brand-logo-login">
              <div className="logo-icon" style={{ margin: 0, width: 40, height: 40, background: "linear-gradient(135deg,#00bba7,#009689)" }}>
                <span style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>M</span>
              </div>
              <div>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a" }}>Medaea</span>
                <sup style={{ fontSize: "9px", color: "#00bba7", fontWeight: 600 }}> AI</sup>
              </div>
            </div>
            <h2 className="login-title">Sign In to Your Account</h2>
            <p className="login-subtitle">Access your electronic health records securely</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <Input label="Email Address" type="email" placeholder="doctor@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required autoFocus />
            </div>
            <div className="mb-3">
              <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required />
            </div>
            <div className="remember-me-wrapper">
              <div className="checkbox-custom">
                <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <label htmlFor="rememberMe">Remember me for 30 days</label>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? <><i className="fas fa-spinner fa-spin me-2" />Signing In...</> : "Sign In"}
            </Button>
          </form>

          <div className="forgot-password-wrapper">
            <Link to="/reset-password" className="link-primary">Forgot password?</Link>
          </div>

          <div className="hipaa-notice" style={{ background: "#f0fffe", border: "1px solid #ccebe8", borderRadius: "8px", padding: "12px 16px", textAlign: "center" }}>
            <i className="fas fa-shield-alt" style={{ color: "#00a896", marginRight: "6px", fontSize: "12px" }} />
            <span style={{ fontSize: "12px", color: "#00735f" }}>HIPAA Compliant • 256-bit Encryption • Secure Access</span>
          </div>

          <div className="new-user-section" style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#666" }}>
            Don't have an account? <Link to="/signup" className="link-primary" style={{ fontWeight: 600 }}>Request Access</Link>
          </div>
        </div>
      </div>

      <Modal isOpen={orgModalOpen} onClose={() => setOrgModalOpen(false)}
        title="Select Your Organization"
        subtitle="You have access to multiple organizations. Please select one to continue."
        maxWidth="520px"
      >
        <div className="organization-list">
          {pendingUser?.organizations?.map((org: any) => (
            <div key={org.id} className={`organization-item ${selectedOrgId === org.id ? "selected" : ""}`} onClick={() => setSelectedOrgId(org.id)}>
              <div className="organization-info">
                <div className="organization-icon"><i className="fas fa-hospital" /></div>
                <div className="organization-details">
                  <div className="organization-name">{org.name}</div>
                  <div className="organization-badges">
                    <span className="organization-badge role">{org.role}</span>
                    {org.type && <span className="organization-badge type">{org.type}</span>}
                  </div>
                </div>
              </div>
              <i className="fas fa-chevron-right organization-arrow" />
            </div>
          ))}
        </div>
        <Button fullWidth onClick={handleOrgSelect} disabled={!selectedOrgId && (pendingUser?.organizations?.length ?? 0) > 1}>
          Continue to Dashboard
        </Button>
      </Modal>
    </AuthLayout>
  );
};

export default LoginPage;
