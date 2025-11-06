import { useState } from "react";
import type { FormEvent } from "react";
import { validatePESEL } from "../utils/peselValidator";

export function PeselValidatorPage() {
  const [pesel, setPesel] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsValidating(true);

    // Simulating delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = validatePESEL(pesel);
    setValidationResult(result);
    setIsValidating(false);
  };

  return (
    <div className="page">
      <h1>Walidator PESEL</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={pesel}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPesel(e.target.value)
            }
            placeholder="Wprowadź numer PESEL"
            maxLength={11}
            className="pesel-input"
            disabled={isValidating}
          />
          <button type="submit" disabled={isValidating}>
            {isValidating ? "Sprawdzanie..." : "Sprawdź"}
          </button>
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
