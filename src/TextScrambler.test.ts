import { test, expect } from "bun:test";
import { scrambleText } from "./utils/textScrambler";

test("scrambleText zachowuje pierwsze i ostatnie litery wyrazów", () => {
  const text = "Test przykładowego tekstu";
  const scrambled = scrambleText(text);

  const words = text.split(" ");
  const scrambledWords = scrambled.split(" ");

  words.forEach((word, index) => {
    if (word.length > 1) {
      expect(scrambledWords[index]?.[0]).toBe(word[0]);
      expect(scrambledWords[index]?.[scrambledWords[index]?.length - 1]).toBe(
        word[word.length - 1]
      );
    }
  });
});

test("scrambleText zachowuje znaki interpunkcyjne", () => {
  const text = "Tekst, z interpunkcją! I znakami?";
  const scrambled = scrambleText(text);

  expect(scrambled).toContain(",");
  expect(scrambled).toContain("!");
  expect(scrambled).toContain("?");
});

test("scrambleText zachowuje polskie znaki", () => {
  const text = "Zażółć gęślą jaźń";
  const scrambled = scrambleText(text);

  expect(scrambled).toMatch(/[ążźć]/);
});

test("scrambleText zachowuje wielolinijkowość", () => {
  const text = "Pierwsza linia\nDruga linia\nTrzecia linia";
  const scrambled = scrambleText(text);

  expect(scrambled.split("\n").length).toBe(3);
});
