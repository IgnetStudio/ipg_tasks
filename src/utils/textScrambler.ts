// Funkcja do mieszania liter w pojedynczym wyrazie
const scrambleWord = (word: string): string => {
  if (word.length <= 3) return word;

  // Zachowujemy pierwszą i ostatnią literę
  const first = word[0];
  const last = word[word.length - 1];
  const middle = word.slice(1, -1).split("");

  // Mieszamy środkowe litery
  for (let i = middle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [middle[i], middle[j]] = [middle[j], middle[i]];
  }

  return first + middle.join("") + last;
};

// Funkcja pomocnicza do sprawdzania, czy znak jest polską literą
const isPolishLetter = (char: string): boolean => {
  return /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(char);
};

// Funkcja pomocnicza do sprawdzania, czy znak jest częścią wyrazu
const isWordCharacter = (char: string): boolean => {
  return /\p{L}/u.test(char) || isPolishLetter(char);
};

// Główna funkcja do przetwarzania tekstu
export const scrambleText = (text: string): string => {
  // Dzielimy tekst na linie
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
          // Jeśli mamy zebrany wyraz, mieszamy go i dodajemy do wyniku
          if (currentWord) {
            result += scrambleWord(currentWord);
            currentWord = "";
          }
          result += char; // Dodajemy znak interpunkcyjny lub spację
        }
        i++;
      }

      // Obsługa ostatniego wyrazu w linii
      if (currentWord) {
        result += scrambleWord(currentWord);
      }

      return result;
    })
    .join("\n");
};
