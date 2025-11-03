import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Navigation() {
  return (
    <nav className="navigation">
      <motion.div 
        className="nav-links"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/">
          <motion.span whileHover={{ scale: 1.1 }}>Strona główna</motion.span>
        </Link>
        <Link to="/pesel">
          <motion.span whileHover={{ scale: 1.1 }}>Walidator PESEL</motion.span>
        </Link>
        <Link to="/scrambler">
          <motion.span whileHover={{ scale: 1.1 }}>Mieszacz Tekstu</motion.span>
        </Link>
      </motion.div>
    </nav>
  );
}