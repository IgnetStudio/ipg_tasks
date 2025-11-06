import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link to="/">
          <span>Strona główna</span>
        </Link>
        <Link to="/pesel">
          <span>Walidator PESEL</span>
        </Link>
        <Link to="/scrambler">
          <span>Mieszacz Tekstu</span>
        </Link>
        <Link to="/users">
          <span>Użytkownicy</span>
        </Link>
      </div>
    </nav>
  );
}
