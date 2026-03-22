import React, { useState } from "react";
import type { IInputProps } from "../../types/ui.types";

const Input: React.FC<IInputProps> = ({
  label,
  type = "text",
  className = "",
  icon,
  iconSize = 16,
  required,
  containerStyle,
  style,
  error,
  helperText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  // Calculate dynamic padding
  const paddingStyle = {
    // If there is an icon on the left, add padding
    paddingLeft: icon ? "45px" : undefined,
    // If it's a password field, add padding on right for the eye toggle
    paddingRight: isPassword ? "45px" : undefined,
    ...style, // Allow overriding via props
  };

  return (
    <div className={`form-group-custom ${className}`} style={containerStyle}>
      {label && (
        <label className="form-label-custom">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      {/* The wrapper needs to be relative so the absolute icons 
         position themselves inside THIS div, not the parent 
      */}
      <div
        className={isPassword || icon ? "password-wrapper input-with-icon" : ""}
      >
        {icon && (
          <i
            className={`${icon} search-icon`}
            style={{
              left: "16px",
              zIndex: 2,
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize:
                typeof iconSize === "number" ? `${iconSize}px` : iconSize,
            }}
          ></i>
        )}

        <input
          type={inputType}
          className={`form-control-custom ${error ? "has-error" : ""}`}
          style={paddingStyle}
          required={required}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
            tabIndex={-1} // Prevent tabbing to the eye icon for smoother form flow
          >
            <i
              className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            ></i>
          </button>
        )}
      </div>

      {/* Render Helper Text */}
      {helperText && !error && (
        <div style={{ marginTop: "4px" }}>
          {typeof helperText === "string" ? (
            <small className="text-muted-custom">{helperText}</small>
          ) : (
            helperText
          )}
        </div>
      )}

      {/* Render Error Message */}
      {error && <div className="form-error-message">{error}</div>}
    </div>
  );
};

export default Input;
