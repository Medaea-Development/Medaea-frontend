import { useState, useEffect } from "react";
import { getMyAppointments } from "../api/appointment";
import type { AppointmentRead } from "../types/appointment.type";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { appointments, isLoading, error, refetch: fetch };
};
