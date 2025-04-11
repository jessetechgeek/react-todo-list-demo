import * as React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (password: string) => {
    let score = 0;
    
    // Empty password
    if (!password) {
      return 0;
    }
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Return a value between 0 and 4
    return Math.min(Math.floor(score / 2), 4);
  };
  
  const strength = getStrength(password);
  
  const getStrengthText = (strength: number) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Strong";
    return "Very Strong";
  };
  
  const getStrengthColor = (strength: number) => {
    if (strength === 0) return "bg-destructive/20";
    if (strength === 1) return "bg-destructive";
    if (strength === 2) return "bg-amber-500";
    if (strength === 3) return "bg-lime-500";
    return "bg-emerald-500";
  };
  
  // Don't show the indicator for empty passwords
  if (!password) {
    return null;
  }
  
  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-14 rounded-full transition-colors duration-300",
                i < strength ? getStrengthColor(strength) : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {getStrengthText(strength)}
        </span>
      </div>
    </div>
  );
}
