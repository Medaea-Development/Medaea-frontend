import React from "react";

// Define the types of badges supported by your CSS
export type BadgeVariant = "visits" | "calls" | "tasks" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  icon?: string;
  label: string;
  count?: number;
  className?: string;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  icon,
  label,
  count,
  className = "",
  onClick,
}) => {
  // Determine default icon if none provided based on variant
  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case "visits":
        return "fas fa-user";
      case "calls":
        return "fas fa-phone";
      case "tasks":
        return "fas fa-calendar-check";
      default:
        return "fas fa-circle";
    }
  };

  return (
    <div
      className={`event-badge ${variant} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      <i className={getIcon()}></i>
      <span>{label}</span>
      {count !== undefined && <span className="event-count">{count}</span>}
    </div>
  );
};

export default Badge;
