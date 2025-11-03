import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
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

    // Symulacja opóźnienia dla lepszego UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = validatePESEL(pesel);
    setValidationResult(result);
    setIsValidating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page"
    >
      <h1>Walidator PESEL</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            type="text"
            value={pesel}
            onChange={(e) => setPesel(e.target.value)}
            placeholder="Wprowadź numer PESEL"
            maxLength={11}
            className="pesel-input"
            disabled={isValidating}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isValidating}
          >
            {isValidating ? "Sprawdzanie..." : "Sprawdź"}
          </motion.button>
        </div>
      </form>
      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`validation-result ${
            validationResult.isValid ? "valid" : "invalid"
          }`}
        >
          {validationResult.message}
        </motion.div>
      )}
    </motion.div>
  );
}
