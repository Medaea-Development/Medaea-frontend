import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext.types"; // Import from types file
import type { UserData as User, LoginCredentials } from "../types/auth.types";
import * as authService from "../api/auth";
import { api } from "../api/client";
import { APP_ROUTES } from "../config/constants";
import { useNavigate } from "react-router-dom";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    // 1. Clear the persistent storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedOrganization");

    // 2. Clear the Axios header
    delete api.defaults.headers.common["Authorization"];

    // 3. CRITICAL: Update the React State
    // This causes the whole app to re-evaluate 'isAuthenticated'
    setUser(null);

    // 4. Manual redirect (as a fallback)
    navigate(APP_ROUTES.LOGIN);
  }, [navigate]);

  const login = async (
    data: LoginCredentials | { token: string; user: User },
  ) => {
    let token: string;
    let user: User;

    // Check if we already have the token (from our multi-step flow)
    if ("token" in data) {
      token = data.token;
      user = data.user;
    } else {
      // Standard login flow
      const response = await authService.login(data);
      token = response.access_token;
      user = response.user;
    }

    // Save to storage and state
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(user);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const refreshUser = useCallback((updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
