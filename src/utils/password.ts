export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number; // 0 to 5
  strengthLabel: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  error?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  const p = password || '';
  const hasMinLength = p.length >= 8;
  const hasUpperCase = /[A-Z]/.test(p);
  const hasLowerCase = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(p);

  const checks = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
  const score = checks.filter(Boolean).length;

  let strengthLabel: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong' = 'Very Weak';
  if (score === 5) strengthLabel = 'Very Strong';
  else if (score === 4) strengthLabel = 'Strong';
  else if (score === 3) strengthLabel = 'Medium';
  else if (score === 2) strengthLabel = 'Weak';

  const isValid = score === 5;

  let error: string | undefined;
  if (!hasMinLength) {
    error = 'Password must be at least 8 characters long.';
  } else if (!hasUpperCase) {
    error = 'Password must contain at least one uppercase letter (A-Z).';
  } else if (!hasLowerCase) {
    error = 'Password must contain at least one lowercase letter (a-z).';
  } else if (!hasNumber) {
    error = 'Password must contain at least one number (0-9).';
  } else if (!hasSpecialChar) {
    error = 'Password must contain at least one special character (!@#$%^&*...).';
  }

  return {
    isValid,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    score,
    strengthLabel,
    error
  };
}
