import React from "react";
import Footer from "./Footer";
import InfoIcon from "../../assets/img/ic-info-o.svg";

interface AuthLayoutProps {
  children: React.ReactNode;
  bannerText?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, bannerText }) => {
  return (
    <>
      {bannerText && (
        <div className="maintenance-banner">
          <div className="maintenance-banner-content">
            <img src={InfoIcon} alt="Info Icon" />
            <p className="maintenance-text">{bannerText}</p>
          </div>
          <button className="maintenance-close" aria-label="Close banner">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className={`login-container ${bannerText ? "has-banner" : ""}`}>
        {children}
      </div>

      <Footer />
    </>
  );
};

export default AuthLayout;
