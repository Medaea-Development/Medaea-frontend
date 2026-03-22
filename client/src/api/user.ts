import type { UserData } from '../types/auth.types';
import { api } from './client';

export interface UserUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  specialty?: string;
  // Add other fields as per your UserUpdate Pydantic schema
}

export interface AvatarUploadResponse {
  avatar_url: string;
}

// --- 1. GET CURRENT USER ---
export const getMe = async (): Promise<UserData> => {
  const response = await api.get<UserData>('/users/me');
  return response.data;
};

// --- 2. UPDATE PROFILE DATA ---
export const updateProfile = async (payload: UserUpdatePayload): Promise<UserData> => {
  const response = await api.patch<UserData>('/users/me', payload);
  return response.data;
};

// --- 3. UPLOAD AVATAR ---
export const uploadAvatar = async (file: File): Promise<AvatarUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<AvatarUploadResponse>('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};