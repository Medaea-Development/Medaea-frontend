import { api } from "./client";

export const getClinicAppointments  = () => api.get("/calendar/clinic").then(r => r.data);
export const getStaffList           = () => api.get("/calendar/staff").then(r => r.data);
export const getOnCallSchedule      = () => api.get("/calendar/on-call").then(r => r.data);
export const getRoomSchedule        = () => api.get("/calendar/rooms").then(r => r.data);
export const getPtoEntries          = () => api.get("/calendar/pto").then(r => r.data);
export const approvePtoEntry        = (id: string) => api.patch(`/calendar/pto/${id}/approve`).then(r => r.data);
export const denyPtoEntry           = (id: string) => api.patch(`/calendar/pto/${id}/deny`).then(r => r.data);
export const requestTimeOff         = (data: any) => api.post("/calendar/pto", data).then(r => r.data);
export const getScheduleTemplates   = () => api.get("/calendar/templates").then(r => r.data);
export const createTemplate         = (data: any) => api.post("/calendar/templates", data).then(r => r.data);
export const removeTemplate         = (id: string) => api.delete(`/calendar/templates/${id}`).then(r => r.data);
export const getAvailabilityRules   = () => api.get("/calendar/rules").then(r => r.data);
export const toggleRule             = (id: string) => api.patch(`/calendar/rules/${id}/toggle`).then(r => r.data);
export const createRule             = (data: any) => api.post("/calendar/rules", data).then(r => r.data);
export const updateAppointmentStatus = (id: string, status: string) => api.patch(`/appointments/${id}/status`, { status }).then(r => r.data);
