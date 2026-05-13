import { useState } from 'react';
import './Header.css';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <i className="fas fa-globe"></i>
          <span>DomainCheck</span>
        </div>
        <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <a href="#search" className="nav-link">Domain Ara</a>
          <a href="#ai" className="nav-link">AI Öneri</a>
          <a href="#pricing" className="nav-link">Fiyatlar</a>
          <a href="#extensions" className="nav-link">Uzantılar</a>
          <a href="#faq" className="nav-link">SSS</a>
        </nav>
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü aç/kapat"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </header>
  );
}

export default Header;
