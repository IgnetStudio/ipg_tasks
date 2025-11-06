import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import { Navigation } from "./components/Navigation";
import { PeselValidatorPage } from "./components/PeselValidatorPage";
import { TextScramblerPage } from "./components/TextScramblerPage";
import { UsersPage } from "./components/UsersPage";

function HomePage() {
  return (
    <div className="page">
      <h1>Zadania rekrutacyjne</h1>
      <p>Wybierz zadanie z menu nawigacyjnego</p>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pesel" element={<PeselValidatorPage />} />
          <Route path="/scrambler" element={<TextScramblerPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
