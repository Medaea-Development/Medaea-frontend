import { createContext } from 'react';
import type { UserData as User, LoginCredentials } from '../types/auth.types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginCredentials | { token: string; user: User }) => Promise<void>;
  logout: () => void;
  refreshUser: (user: User) => void;
}

// This is the ONLY place this is created
export const AuthContext = createContext<AuthContextType | undefined>(undefined);