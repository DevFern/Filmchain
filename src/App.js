// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import MetaMaskConnector from './components/MetaMaskConnector';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import MarketplacePage from './pages/MarketplacePage';
import GovernancePage from './pages/GovernancePage';
import HyrePage from './pages/HyrePage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <WalletProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <div className="container">
              <div className="header-content">
                <div className="logo">
                  <Link to="/">FilmChain</Link>
                </div>
                
                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                  <span className="menu-icon"></span>
                </button>
                
                <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
                  <ul className="nav-list">
                    <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link></li>
                    <li><Link to="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</Link></li>
                    <li><Link to="/governance" onClick={() => setMenuOpen(false)}>Governance</Link></li>
                    <li><Link to="/hyre" onClick={() => setMenuOpen(false)}>Hyre</Link></li>
                    <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
                  </ul>
                </nav>
                
                <div className="wallet-connect">
                  <ErrorBoundary>
                    <MetaMaskConnector compact={true} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </header>

          <main className="app-main">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/governance" element={<GovernancePage />} />
                <Route path="/hyre" element={<HyrePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
          </main>

          <footer className="app-footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-logo">
                  <Link to="/">FilmChain</Link>
                </div>
                <div className="footer-links">
                  <div className="footer-section">
                    <h4>Navigation</h4>
                    <ul>
                      <li><Link to="/">Home</Link></li>
                      <li><Link to="/projects">Projects</Link></li>
                      <li><Link to="/marketplace">Marketplace</Link></li>
                      <li><Link to="/governance">Governance</Link></li>
                      <li><Link to="/hyre">Hyre</Link></li>
                      <li><Link to="/about">About</Link></li>
                    </ul>
                  </div>
                  <div className="footer-section">
                    <h4>Resources</h4>
                    <ul>
                      <li><a href="#">Documentation</a></li>
                      <li><a href="#">FAQ</a></li>
                      <li><a href="#">Support</a></li>
                    </ul>
                  </div>
                  <div className="footer-section">
                    <h4>Legal</h4>
                    <ul>
                      <li><a href="#">Terms of Service</a></li>
                      <li><a href="#">Privacy Policy</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} FilmChain. All rights reserved.</p>
                <div className="social-links">
                  <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href="#" aria-label="Discord"><i className="fab fa-discord"></i></a>
                  <a href="#" aria-label="Medium"><i className="fab fa-medium"></i></a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </WalletProvider>
  );
}

// 404 page component
function NotFoundPage() {
  return (
    <div className="container">
      <div className="not-found-section">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );
}

export default App;
