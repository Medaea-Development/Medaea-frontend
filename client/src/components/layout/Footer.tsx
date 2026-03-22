import React from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  simple?: boolean;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ simple = false, className = "" }) => {
  const year = new Date().getFullYear();

  return (
    <div className={`ftr-bg ${className}`}>
      <div className="container">
        <div className="d-flex ftr-lnks">
          <div className="footer-links">
            <Link to="#">HIPAA Privacy Notice</Link>
            <Link to="#">Acceptable Use Policy</Link>
            <Link to="#">Terms of Service</Link>
            {!simple && <Link to="/signup">Provider Sign Up</Link>}
          </div>

          {/* Footer Info */}
          <div className="footer-info">
            <p>© {year} Medaea EHR, ONC Certified • HIPAA Compliant</p>
            <p>USCDI v3 • NIST 800-63B Authentication</p>
          </div>
        </div>
      </div>

      <div className="footer-info ftr-extra">
        <p>
          This system is for authorized use only. All access is monitored and
          logged in accordance with HIPAA Security Rule. Unauthorized access or
          misuse may result in disciplinary action, civil and/or criminal
          penalties.
        </p>
      </div>
    </div>
  );
};

export default Footer;
