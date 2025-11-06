import { useState, useRef, type ChangeEvent } from "react";
import { scrambleText } from "../utils/textScrambler";

export function TextScramblerPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInputText(text);
      const scrambledText = scrambleText(text);
      setOutputText(scrambledText);
      setIsProcessing(false);
    };

    reader.onerror = () => {
      alert("Błąd podczas wczytywania pliku");
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setInputText(text);
    const scrambledText = scrambleText(text);
    setOutputText(scrambledText);
  };

  const downloadResult = () => {
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tekst-pomieszany.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page text-scrambler">
      <h1>Mieszacz Liter</h1>
      <p>Wgraj plik tekstowy lub wpisz tekst bezpośrednio w pole poniżej.</p>

      <div className="file-upload">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="file-input"
        />
      </div>

      <div className="text-areas">
        <div className="text-area-container">
          <h3>Tekst wejściowy:</h3>
          <textarea
            value={inputText}
            onChange={handleTextAreaChange}
            placeholder="Wpisz lub wklej tekst tutaj..."
            disabled={isProcessing}
          />
        </div>

        <div className="text-area-container">
          <h3>Tekst wyjściowy:</h3>
          <textarea
            value={outputText}
            readOnly
            placeholder="Tu pojawi się przetworzony tekst..."
          />
        </div>
      </div>

      {outputText && (
        <button onClick={downloadResult} className="download-button">
          Pobierz wynik
        </button>
      )}
    </div>
  );
}
