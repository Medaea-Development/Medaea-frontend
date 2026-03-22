/**
 * Maps backend roles/enums to human-readable labels.
 * Example: "doctor" -> "Doctor", "medical_director" -> "Medical Director"
 */
export const formatRole = (role: string | undefined): string => {
  if (!role) return "User";

  const roleMap: Record<string, string> = {
    doctor: "Doctor",
    admin: "Administrator",
    nurse: "Nurse",
    medical_director: "Medical Director",
    staff: "Staff Member",
    patient: "Patient",
  };

  // Check if we have a specific mapping, otherwise fallback to Capitalization
  return (
    roleMap[role.toLowerCase()] ||
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  );
};

/**
 * Combines first and last name, handling missing values gracefully.
 */
export const formatFullName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return "Anonymous User";
  return `${firstName || ""} ${lastName || ""}`.trim();
};

/**
 * Generates initials for avatars (e.g., "Sarah Johnson" -> "SJ")
 */
export const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";
  return (first + last).toUpperCase() || "??";
};