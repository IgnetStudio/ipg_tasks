import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

import { Navigation } from "./components/Navigation";
import { PeselValidatorPage } from "./components/PeselValidatorPage";
import { TextScramblerPage } from "./components/TextScramblerPage";
import { UsersPage } from "./components/UsersPage";

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page"
    >
      <h1>Zadania IPG</h1>
      <p>Wybierz zadanie z menu nawigacyjnego</p>
    </motion.div>
  );
}

export function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pesel" element={<PeselValidatorPage />} />
            <Route path="/scrambler" element={<TextScramblerPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
