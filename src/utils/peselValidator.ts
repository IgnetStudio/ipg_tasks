export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validatePESEL = (pesel: string): ValidationResult => {
  // Check if PESEL is exactly 11 digits
  if (!/^\d{11}$/.test(pesel)) {
    return {
      isValid: false,
      message: "PESEL musi składać się z dokładnie 11 cyfr",
    };
  }

  // Extract date components
  const year = parseInt(pesel.substring(0, 2));
  const monthCode = parseInt(pesel.substring(2, 4));
  const day = parseInt(pesel.substring(4, 6));

  // Validate date
  let fullYear;
  const monthBase = monthCode % 20;

  if (monthCode <= 12) fullYear = 1900 + year;
  else if (monthCode <= 32) fullYear = 2000 + year;
  else if (monthCode <= 52) fullYear = 2100 + year;
  else if (monthCode <= 72) fullYear = 2200 + year;
  else if (monthCode <= 92) fullYear = 1800 + year;
  else return { isValid: false, message: "Nieprawidłowy miesiąc" };

  const testDate = new Date(fullYear, monthBase - 1, day);
  if (
    testDate.getFullYear() !== fullYear ||
    testDate.getMonth() !== monthBase - 1 ||
    testDate.getDate() !== day
  ) {
    return { isValid: false, message: "Nieprawidłowa data" };
  }

  // Weight factors for PESEL validation
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];

  // Calculate checksum according to the official algorithm
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += weights[i] * parseInt(pesel.charAt(i));
  }

  const checksum = (10 - (sum % 10)) % 10;
  const lastDigit = parseInt(pesel.charAt(10));

  // Validate checksum
  if (checksum !== lastDigit) {
    return { isValid: false, message: "Nieprawidłowa suma kontrolna" };
  }

  return { isValid: true, message: "PESEL jest prawidłowy" };
};
