import { getInitials } from "../../../utils/stringUtils";

interface PatientAvatarProps {
  firstName: string;
  lastName: string;
}

const PatientAvatar: React.FC<PatientAvatarProps> = ({
  firstName,
  lastName,
}) => {
  const initials = getInitials(firstName, lastName);

  const colors = [
    "#8b5cf6", // Purple
    "#3b82f6", // Blue
    "#06b6d4", // Cyan
    "#10b981", // Green
    "#f97316", // Orange
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#6366f1", // Indigo
  ];

  // Logic to assign a stable color based on the initials
  const getColorIndex = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % colors.length;
  };

  const backgroundColor = colors[getColorIndex(initials)];

  return (
    <div
      className="pat-av"
      style={{
        backgroundColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "12px",
      }}
    >
      {initials}
    </div>
  );
};

export default PatientAvatar;
