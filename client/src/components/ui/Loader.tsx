import React from "react";
import "../../assets/css/loader.css";

interface LoaderProps {
  variant?: "fullscreen" | "container";
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ variant = "container", message }) => {
  const variantClass =
    variant === "fullscreen" ? "loader-fullscreen" : "loader-container";

  return (
    <div className={`loader-overlay ${variantClass}`}>
      <div className="custom-spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
