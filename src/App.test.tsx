import { test, expect } from "bun:test";
import { validatePESEL } from "./utils/peselValidator";

test("validatePESEL validates correct PESEL number", () => {
  // This is a valid PESEL number (example from official documentation)
  const result = validatePESEL("44051401458");
  expect(result.isValid).toBe(true);
  expect(result.message).toBe("PESEL jest prawidłowy");
});

test("validatePESEL rejects incorrect length", () => {
  const result = validatePESEL("1234567890"); // 10 digits
  expect(result.isValid).toBe(false);
  expect(result.message).toBe("PESEL musi składać się z dokładnie 11 cyfr");
});

test("validatePESEL rejects non-numeric input", () => {
  const result = validatePESEL("9001011234A");
  expect(result.isValid).toBe(false);
  expect(result.message).toBe("PESEL musi składać się z dokładnie 11 cyfr");
});

test("validatePESEL rejects incorrect checksum", () => {
  const result = validatePESEL("90010112346"); // Changed last digit
  expect(result.isValid).toBe(false);
  expect(result.message).toBe("Nieprawidłowa suma kontrolna");
});

test("validatePESEL rejects invalid date", () => {
  const result = validatePESEL("90023112345"); // February 31st
  expect(result.isValid).toBe(false);
  expect(result.message).toBe("Nieprawidłowa data");
});
