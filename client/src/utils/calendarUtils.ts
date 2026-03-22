import type { AppointmentRead } from "../types/appointment.type";
import { formatDateKey } from "./dateUtils";

export const groupAppointmentsByDate = (appointments: AppointmentRead[]) => {
  return appointments.reduce((acc, appt) => {
    const key = formatDateKey(new Date(appt.start_time));
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {} as Record<string, AppointmentRead[]>);
};