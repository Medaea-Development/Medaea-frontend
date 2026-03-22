import React, { useEffect } from "react";
import type { IModalProps } from "../../types/ui.types";

// Extend IModalProps if needed, or define locally
interface ModalProps extends IModalProps {
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconColor = "teal",
  children,
  className = "",
  maxWidth = "480px",
  preventClose = false,
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      // Only close if preventClose is false
      if (!preventClose && e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, preventClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay active ${className}`}
      // Only close on overlay click if preventClose is false
      onClick={(e) => {
        if (!preventClose && e.target === e.currentTarget) onClose();
      }}
      style={{
        // CRITICAL FIX: Allow the overlay itself to scroll
        overflowY: "auto",
        display: "flex",
        alignItems: "flex-start", // Start from top so top doesn't get cut off on scroll
        justifyContent: "center",
        padding: "40px 20px", // Add padding so it doesn't touch edges
      }}
    >
      <div
        className="modal-container"
        style={{
          maxWidth: maxWidth,
          width: "100%",
          margin: "auto",
          position: "relative",
        }}
      >
        {/* Only show Close button if preventClose is false */}
        {!preventClose && (
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="fas fa-times"></i>
          </button>
        )}

        {icon && (
          <div className={`modal-icon ${iconColor}`}>
            {/* Logic to handle String vs SVG */}
            {typeof icon === "string" ? <i className={icon}></i> : icon}
          </div>
        )}

        <div className="modal-header">
          <h1 className="modal-title">{title}</h1>
          {subtitle && (
            <p
              className="modal-subtitle"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
