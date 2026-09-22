/**
 * OmniService AI — Password Requirements Validator
 *
 * Rules:
 * - Minimum 3 alphabets (letters a-z, A-Z)
 * - Minimum 2 numbers (0-9)
 * - Minimum 1 symbol (!@#$%^&*...)
 * - Minimum length 6 characters
 */

export interface PasswordValidationResult {
  isValid: boolean;
  hasMin3Letters: boolean;
  hasMin2Numbers: boolean;
  hasMin1Symbol: boolean;
  hasMinLength: boolean;
  lettersCount: number;
  numbersCount: number;
  symbolsCount: number;
  error?: string;
}

export function validatePasswordRequirements(password: string): PasswordValidationResult {
  if (!password || typeof password !== "string") {
    return {
      isValid: false,
      hasMin3Letters: false,
      hasMin2Numbers: false,
      hasMin1Symbol: false,
      hasMinLength: false,
      lettersCount: 0,
      numbersCount: 0,
      symbolsCount: 0,
      error: "Password cannot be empty.",
    };
  }

  const lettersMatch = password.match(/[a-zA-Z]/g) || [];
  const numbersMatch = password.match(/[0-9]/g) || [];
  const symbolsMatch = password.match(/[^a-zA-Z0-9\s]/g) || [];

  const lettersCount = lettersMatch.length;
  const numbersCount = numbersMatch.length;
  const symbolsCount = symbolsMatch.length;

  const hasMin3Letters = lettersCount >= 3;
  const hasMin2Numbers = numbersCount >= 2;
  const hasMin1Symbol = symbolsCount >= 1;
  const hasMinLength = password.length >= 6;

  const isValid = hasMin3Letters && hasMin2Numbers && hasMin1Symbol && hasMinLength;

  let error: string | undefined;
  if (!hasMin3Letters) {
    error = `Password must have at least 3 alphabets (found ${lettersCount}).`;
  } else if (!hasMin2Numbers) {
    error = `Password must have at least 2 numbers (found ${numbersCount}).`;
  } else if (!hasMin1Symbol) {
    error = `Password must have at least 1 symbol e.g. !@#$%^&* (found ${symbolsCount}).`;
  } else if (!hasMinLength) {
    error = "Password must be at least 6 characters in total length.";
  }

  return {
    isValid,
    hasMin3Letters,
    hasMin2Numbers,
    hasMin1Symbol,
    hasMinLength,
    lettersCount,
    numbersCount,
    symbolsCount,
    error,
  };
}
