import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerStyle?: React.CSSProperties;
}

const Select: React.FC<SelectProps> = ({
  label,
  className = "",
  containerStyle,
  error,
  required,
  children,
  value,
  ...props
}) => {
  return (
    <div className={`form-group-custom ${className}`} style={containerStyle}>
      {label && (
        <label className="form-label-custom">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <div className="select-wrapper">
        <select
          className={`form-control-custom ${error ? "has-error" : ""}`}
          required={required}
          value={value}
          // Apply gray color if the value is empty (placeholder state)
          style={{ color: value === "" ? "#999" : "#333" }}
          {...props}
        >
          {children}
        </select>
      </div>

      {error && <div className="form-error-message">{error}</div>}
    </div>
  );
};

export default Select;
