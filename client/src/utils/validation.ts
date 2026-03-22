export const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[0-9\s()-]+$/,
    NPI: /^\d{10}$/,
    // At least 12 chars, 1 upper, 1 lower, 1 number, 1 special char
    PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/
};

export const isValidEmail = (email: string): boolean => {
    return PATTERNS.EMAIL.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    // Check allowed characters AND minimum 10 digits
    return PATTERNS.PHONE.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validatePasswordStrength = (password: string) => {
    const errors = [];
    if (password.length < 12) errors.push("At least 12 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/\d/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("One special character (!@#$%^&*)");
    
    return {
        isValid: errors.length === 0,
        errors
    };
};