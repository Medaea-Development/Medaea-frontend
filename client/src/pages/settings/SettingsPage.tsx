import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import * as authApi from "../../api/auth";
import Footer from "../../components/layout/Footer";
import type { MfaMethod } from "../../types/auth.types";
import "../../assets/css/settings.css";

const MFA_METHODS: { id: MfaMethod; label: string; desc: string; icon: string }[] = [
  { id: "authenticator", label: "Authenticator App", desc: "Use Google Authenticator or Authy", icon: "fa-shield-alt" },
  { id: "email", label: "Email Code", desc: "Receive a code via email", icon: "fa-envelope" },
  { id: "sms", label: "SMS Code", desc: "Receive a code via text message", icon: "fa-mobile-alt" },
];

const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [mfaEnabled, setMfaEnabled] = useState(user?.mfa_enabled ?? false);
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>(user?.mfa_method || "authenticator");
  const [setupStep, setSetupStep] = useState<"idle" | "choose" | "configure" | "finalize" | "done">("idle");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState("security");

  useEffect(() => {
    authApi.getMfaStatus().then((s) => {
      setMfaEnabled(s.is_enabled);
    }).catch(() => {});
  }, []);

  const startSetup = () => setSetupStep("choose");

  const handleSetupMfa = async () => {
    setIsLoading(true);
    try {
      const data = await authApi.setupMfa(mfaMethod);
      setQrCode(data.qr_code);
      setSecret(data.secret);
      setSetupStep("configure");
    } catch {
      showToast("Failed to start MFA setup.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeMfa = async () => {
    if (!code.trim() || code.length < 6) { showToast("Enter a valid 6-digit code.", "error"); return; }
    setIsLoading(true);
    try {
      const data = await authApi.finalizeMfa(code, mfaMethod);
      setBackupCodes(data.backup_codes || []);
      setMfaEnabled(true);
      refreshUser(data.user);
      setSetupStep("done");
      showToast("MFA enabled successfully!", "success");
    } catch {
      showToast("Invalid code. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    setIsLoading(true);
    try {
      await authApi.disableMfa("");
      setMfaEnabled(false);
      setSetupStep("idle");
      showToast("MFA disabled.", "info");
    } catch {
      showToast("Failed to disable MFA.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarItems = [
    { id: "security", label: "Security & MFA", icon: "fa-shield-alt" },
    { id: "notifications", label: "Notifications", icon: "fa-bell" },
    { id: "preferences", label: "Preferences", icon: "fa-sliders-h" },
  ];

  return (
    <div>
      <div className="dash-hd">
        <div className="dash-left">
          <div className="dash-hd-icon" style={{ background: "#f3e8ff" }}>
            <i className="fa fa-cog" style={{ color: "#7c3aed" }} />
          </div>
          <div>
            <div className="dash-title">Settings</div>
            <div className="dash-sub">Manage your account preferences and security</div>
          </div>
        </div>
      </div>

      <div className="content-wrap">
        <div className="left-menu">
          <div className="page-card" style={{ padding: "8px 0" }}>
            {sidebarItems.map((item) => (
              <button key={item.id} onClick={() => setSelectedSection(item.id)}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", width: "100%", background: selectedSection === item.id ? "#e0f2fe" : "none", border: "none", cursor: "pointer", color: selectedSection === item.id ? "#0891b2" : "#374151", fontWeight: selectedSection === item.id ? 600 : 400, fontSize: "13px", textAlign: "left", borderRadius: "0" }}>
                <i className={`fa ${item.icon}`} style={{ width: "16px" }} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="main-panel">
          {selectedSection === "security" && (
            <div className="panel-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <div className="section-title">Multi-Factor Authentication</div>
                  <p className="panel-card-sub">Add an extra layer of security to your account</p>
                </div>
                <span className={`mfa-status-badge ${mfaEnabled ? "enabled" : "disabled"}`}>
                  <i className={`fa ${mfaEnabled ? "fa-check-circle" : "fa-times-circle"}`} />
                  {mfaEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              {mfaEnabled && setupStep === "idle" && (
                <div>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
                    <div style={{ fontWeight: 600, color: "#065f46", marginBottom: "4px", fontSize: "13px" }}>MFA is active on your account</div>
                    <div style={{ fontSize: "12px", color: "#047857" }}>
                      Method: <span className="mfa-method-badge">{user?.mfa_method || mfaMethod}</span>
                    </div>
                  </div>
                  <button className="btn-disable-mfa" onClick={handleDisableMfa} disabled={isLoading}>
                    {isLoading ? "Disabling..." : "Disable MFA"}
                  </button>
                </div>
              )}

              {!mfaEnabled && setupStep === "idle" && (
                <button className="btn-enable-mfa" onClick={startSetup}><i className="fa fa-shield-alt me-2" />Enable MFA</button>
              )}

              {setupStep === "choose" && (
                <div>
                  <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>Choose your preferred authentication method:</p>
                  {MFA_METHODS.map((m) => (
                    <div key={m.id} className={`mfa-option ${mfaMethod === m.id ? "selected" : ""}`} onClick={() => setMfaMethod(m.id)}>
                      <i className={`fa ${m.icon} mfa-option-icon`} style={{ width: "24px", color: mfaMethod === m.id ? "#0891b2" : "#6b7280" }} />
                      <div className="mfa-option-text">
                        <div className="mfa-title">{m.label}</div>
                        <div className="mfa-desc">{m.desc}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <button style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "13px" }} onClick={() => setSetupStep("idle")}>Cancel</button>
                    <button className="btn-enable-mfa" onClick={handleSetupMfa} disabled={isLoading}>{isLoading ? "Setting up..." : "Continue"}</button>
                  </div>
                </div>
              )}

              {setupStep === "configure" && (
                <div>
                  {mfaMethod === "authenticator" && (
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                      <div className="mfa-qr"><i className="fa fa-qrcode" style={{ fontSize: "80px", color: "#374151" }} /></div>
                      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>Scan with your authenticator app, or enter this key:</p>
                      <div className="mfa-secret">{secret || "MOCK_SECRET_KEY_1234"}</div>
                    </div>
                  )}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "block" }}>Enter 6-digit code</label>
                    <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" maxLength={6} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 12px", fontSize: "20px", textAlign: "center", letterSpacing: "8px", width: "160px", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "13px" }} onClick={() => setSetupStep("choose")}>Back</button>
                    <button className="btn-enable-mfa" onClick={handleFinalizeMfa} disabled={isLoading || code.length < 6}>{isLoading ? "Verifying..." : "Verify & Enable"}</button>
                  </div>
                </div>
              )}

              {setupStep === "done" && (
                <div>
                  <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
                    <div style={{ fontWeight: 600, color: "#065f46" }}><i className="fa fa-check-circle me-2" />MFA Successfully Enabled!</div>
                    <p style={{ fontSize: "12px", color: "#047857", margin: "4px 0 0" }}>Your account is now protected with {mfaMethod} MFA.</p>
                  </div>
                  {backupCodes.length > 0 && (
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Backup Codes — save these safely:</p>
                      <div className="backup-codes">{backupCodes.map((c, i) => <div key={i} className="backup-code">{c}</div>)}</div>
                    </div>
                  )}
                  <button className="btn-enable-mfa" onClick={() => setSetupStep("idle")} style={{ marginTop: "8px" }}>Done</button>
                </div>
              )}
            </div>
          )}

          {selectedSection === "notifications" && (
            <div className="panel-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>Notification Preferences</div>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>Configure how and when you receive notifications. (Coming soon)</p>
            </div>
          )}

          {selectedSection === "preferences" && (
            <div className="panel-card">
              <div className="section-title" style={{ marginBottom: "16px" }}>Application Preferences</div>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>Customize your Medaea EHR experience. (Coming soon)</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
