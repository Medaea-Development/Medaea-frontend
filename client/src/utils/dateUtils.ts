export const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    // Start week on Monday (1)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

export const formatDate = (date: Date, format: 'long' | 'short' | 'month-year' | 'day' | 'short-day'): string => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    switch(format) {
        case 'long': return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        case 'short': return `${months[date.getMonth()]} ${date.getDate()}`;
        case 'month-year': return `${months[date.getMonth()]} ${date.getFullYear()}`;
        case 'day': return days[date.getDay()];
        case 'short-day': return days[date.getDay()].substring(0, 3).toUpperCase();
        default: return date.toLocaleDateString();
    }
};

export const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Merges a date string and a 12-hour time string into a valid ISO 8601 string.
 * @param dateStr Format: "2026-03-02"
 * @param timeStr Format: "09:30 AM" or "02:00 PM"
 * @returns ISO String: "2026-03-02T09:30:00"
 */
export const formatToISO = (dateStr: string, timeStr: string): string => {
  if (!dateStr || !timeStr) return "";

  const [time, modifier] = timeStr.split(" ");
  let [hours] = time.split(":").map(Number);
  const [minutes] = time.split(":").slice(1).map(Number);

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  const sHours = hours.toString().padStart(2, "0");
  const sMinutes = minutes.toString().padStart(2, "0");

  return `${dateStr}T${sHours}:${sMinutes}:00`;
};

export function convertTimeTo24h(timeStr: string): string {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!match) {
    throw new Error("Invalid time format. Expected format: HH:MM AM/PM");
  }

  const [, hours, minutes, modifier] = match;

  let hrs = parseInt(hours, 10);

  if (modifier.toUpperCase() === "AM" && hrs === 12) {
    hrs = 0;
  }

  if (modifier.toUpperCase() === "PM" && hrs !== 12) {
    hrs += 12;
  }

  return `${hrs.toString().padStart(2, "0")}:${minutes}`;
}

export const calculateAge = (dob: string): string => {
  if (!dob) return "N/A";
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust if the birthday hasn't happened yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age > 0 ? `${age} years` : "0 years";
};