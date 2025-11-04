// Function for scrambling letters in a single word
const scrambleWord = (word: string): string => {
  if (word.length <= 3) return word;

  // Preserve the first and last letter
  const first = word[0];
  const last = word[word.length - 1];
  const middle = word.slice(1, -1).split("");

  // Scramble middle letters
  for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [middle[i], middle[j]] = [middle[j], middle[i]];
  }

  return first + middle.join("") + last;
};

// Helper function to check if a character is a Polish letter
const isPolishLetter = (char: string): boolean => {
  return /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(char);
};

// Helper function to check if a character is part of a word
const isWordCharacter = (char: string): boolean => {
  return /\p{L}/u.test(char) || isPolishLetter(char);
};

// Main function for processing text
export const scrambleText = (text: string): string => {
  // Split text into lines
  return text
    .split("\n")
    .map((line) => {
      let result = "";
      let currentWord = "";
      let i = 0;

      while (i < line.length) {
        const char = line[i];

        if (isWordCharacter(char)) {
          currentWord += char;
        } else {
          // If we have a collected word, scramble it and add to result
          if (currentWord) {
            result += scrambleWord(currentWord);
            currentWord = "";
          }
          result += char; // Add punctuation mark or space
        }
        i++;
      }

      // Handle the last word in the line
      if (currentWord) {
        result += scrambleWord(currentWord);
      }

      return result;
    })
    .join("\n");
};
