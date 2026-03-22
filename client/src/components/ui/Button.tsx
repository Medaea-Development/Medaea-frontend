import React from "react";
import clsx from "clsx"; // Helper for class merging
import type { IButtonProps } from "../../types/ui.types";

const Button: React.FC<IButtonProps> = ({
  children,
  variant = "primary",
  className,
  fullWidth = true,
  isLoading,
  ...props
}) => {
  const baseClass =
    variant === "secondary" ? "btn-secondary-custom" : "btn-primary-custom";

  return (
    <button
      className={clsx(baseClass, className, { "w-100": fullWidth })}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <i className="fas fa-spinner fa-spin"></i> : children}
    </button>
  );
};

export default Button;
