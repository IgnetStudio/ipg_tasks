import { useState } from "react";
import type { FormEvent } from "react";
import "./index.css";

// PESEL validation function
export const validatePESEL = (
  pesel: string
): { isValid: boolean; message: string } => {
  // Check if PESEL is exactly 11 digits
  if (!/^\d{11}$/.test(pesel)) {
    return {
      isValid: false,
      message: "PESEL musi składać się z dokładnie 11 cyfr",
    };
  }

  // Extract and validate date
  const year = parseInt(pesel.substring(0, 2));
  const monthCode = parseInt(pesel.substring(2, 4));
  const day = parseInt(pesel.substring(4, 6));

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

export function App() {
  const [pesel, setPesel] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validatePESEL(pesel);
    setValidationResult(result);
  };

  return (
    <div className="app">
      <h1>Walidator PESEL</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={pesel}
            onChange={(e) => setPesel(e.target.value)}
            placeholder="Wprowadź numer PESEL"
            maxLength={11}
            className="pesel-input"
          />
          <button type="submit">Sprawdź</button>
        </div>
      </form>
      {validationResult && (
        <div
          className={`validation-result ${
            validationResult.isValid ? "valid" : "invalid"
          }`}
        >
          {validationResult.message}
        </div>
      )}
    </div>
  );
}

export default App;
