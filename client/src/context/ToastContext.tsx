import { createContext } from "react";
import type { ToastContextType } from "../types/toast.types";

// Create Context with the imported type
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);
