import type { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, ReactNode } from "react";


export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: string; // FontAwesome class string (e.g., "fas fa-user")
    iconSize?: string | number; // Size in pixels for the icon
    containerStyle?: CSSProperties;
    helperText?: ReactNode;
}

export interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: string | ReactNode;
    iconColor?: 'teal' | 'green' | 'red';
    children: ReactNode;
    maxWidth?: string;
    preventClose?: boolean;
}