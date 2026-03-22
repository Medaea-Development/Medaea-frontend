import type { PatientProfile } from "../types/patient.type";
import { api } from "./client";

export const getAllPatients = async (): Promise<PatientProfile[]> => {
  const response = await api.get<PatientProfile[]>('/patients/search');
  return response.data;
};

export const getPatientById = async (id: string): Promise<any> => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const getPatientDetail = async (id: string): Promise<any> => {
  const response = await api.get(`/patients/${id}/detail`);
  return response.data;
};

export const getPatientEncounter = async (id: string): Promise<any> => {
  const response = await api.get(`/patients/${id}/encounter`);
  return response.data;
};

export const createPatient = async (data: {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
}): Promise<any> => {
  const response = await api.post("/patients/", data);
  return response.data;
};
