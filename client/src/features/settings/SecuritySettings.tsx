import React, { useState } from "react";
import Button from "../../components/ui/Button";
import MfaSetupWizard from "./components/MfaSetupWizard";
import ShieldIcon from "../../assets/img/ic-shield.svg";
import { useAuth } from "../../hooks/useAuth";
import { COLORS } from "../../config/colors";

import "../../assets/css/settings.css";

const SecuritySettings: React.FC = () => {
  const { user } = useAuth(); // Global user state
  const [showWizard, setShowWizard] = useState(false);

  const isEnabled = user?.mfa_enabled || false;
  const currentMethod = user?.mfa_method || "authenticator";

  // This is still useful if you want to close the modal after success,
  // but refreshUser handles the data part!
  const handleMfaSuccess = () => {
    setShowWizard(false);
  };

  return (
    <div className="container-fluid main-content">
      <div className="security-container">
        {" "}
        {/* Reusing calendar container for consistent width */}
        <div className="security-header-section">
          <h1 className="security-title" style={{ color: COLORS.secondary }}>
            Security Settings
          </h1>
          <p className="security-subtitle">
            Manage how you verify your identity and protect patient health
            information (PHI).
          </p>
        </div>
        <div className="security-card mt-4">
          <div className="card-left">
            <div className="icon-wrapper">
              <img src={ShieldIcon} alt="Shield" width={32} />
            </div>
            <div className="mfa-info">
              <h5>Two-Factor Authentication (2FA)</h5>
              <p>
                {isEnabled
                  ? `Status: Protected via ${currentMethod}`
                  : "Status: At Risk - Extra security recommended"}
              </p>
            </div>
          </div>

          <Button
            variant={isEnabled ? "secondary" : "primary"}
            onClick={() => setShowWizard(true)}
          >
            {isEnabled ? "Change Settings" : "Enable 2FA"}
          </Button>
        </div>
      </div>

      {/* HIPAA Compliance Footer (Matching Calendar) */}
      <div className="cld-box mt-auto">
        <div className="text-center">
          <span>
            Security changes are logged and monitored in accordance with
            <a href="#" className="link-primary mx-1">
              HIPAA Privacy Notice
            </a>
            <a href="#" className="link-primary mx-1">
              Audit Logs
            </a>
          </span>
        </div>
      </div>

      {showWizard && (
        <MfaSetupWizard
          key={showWizard ? "open" : "closed"}
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          onSuccess={handleMfaSuccess}
        />
      )}
    </div>
  );
};

export default SecuritySettings;
