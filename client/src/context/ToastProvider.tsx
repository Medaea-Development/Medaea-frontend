import React, { useState, useCallback, type ReactNode } from "react";
import { ToastContext } from "./ToastContext";
import type { ToastMessage, ToastType } from "../types/toast.types";

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      // Generate a random ID
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* UI Container */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              minWidth: "300px",
              maxWidth: "450px",
              backgroundColor: "white",
              borderLeft: `5px solid ${getBorderColor(toast.type)}`,
              borderRadius: "4px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              animation: "slideIn 0.3s ease-out",
              cursor: "pointer",
              pointerEvents: "auto",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {getIcon(toast.type)}
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#333",
                  fontWeight: 500,
                }}
              >
                {toast.message}
              </p>
            </div>
            <span style={{ fontSize: "12px", color: "#999" }}>✕</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Helper functions for styling
const getBorderColor = (type: ToastType) => {
  switch (type) {
    case "success":
      return "#2e7d32";
    case "error":
      return "#d32f2f";
    case "warning":
      return "#ed6c02";
    default:
      return "#0288d1";
  }
};

const getIcon = (type: ToastType) => {
  const style = { fontSize: "18px", fontWeight: "bold" };
  switch (type) {
    case "success":
      return <span style={{ ...style, color: "#2e7d32" }}>✓</span>;
    case "error":
      return <span style={{ ...style, color: "#d32f2f" }}>⚠</span>;
    case "warning":
      return <span style={{ ...style, color: "#ed6c02" }}>!</span>;
    default:
      return <span style={{ ...style, color: "#0288d1" }}>ℹ</span>;
  }
};
