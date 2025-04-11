// Validation utilities for forms

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (at least 6 characters, one uppercase, one lowercase, one number)
export const isStrongPassword = (password: string): boolean => {
  const minLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return minLength && hasUppercase && hasLowercase && hasNumber;
};

// Check password strength and return feedback
export const getPasswordStrengthFeedback = (password: string): {
  isStrong: boolean;
  feedback: string[];
} => {
  const feedback = [];
  
  if (password.length < 6) {
    feedback.push("Password should be at least 6 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push("Include at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push("Include at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push("Include at least one number");
  }
  
  return {
    isStrong: feedback.length === 0,
    feedback
  };
};

// Username validation (3-20 characters, letters, numbers, underscores, hyphens)
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

// Form validation for login
export const validateLoginForm = (username: string, password: string): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  
  if (!username.trim()) {
    errors.username = "Username is required";
  }
  
  if (!password) {
    errors.password = "Password is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation for signup
export const validateSignupForm = (formData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  
  // Username validation
  if (!formData.username.trim()) {
    errors.username = "Username is required";
  } else if (!isValidUsername(formData.username)) {
    errors.username = "Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens";
  }
  
  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = "Password is required";
  } else {
    const { isStrong, feedback } = getPasswordStrengthFeedback(formData.password);
    if (!isStrong) {
      errors.password = feedback.join(", ");
    }
  }
  
  // Confirm password validation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
