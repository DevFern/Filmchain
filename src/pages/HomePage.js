// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import MetaMaskConnector from '../components/MetaMaskConnector';
import IndieFundSection from '../components/IndieFundSection';
import BlockOfficeSection from '../components/BlockOfficeSection';
import NFTMarketSection from '../components/NFTMarketSection';
import ErrorBoundary from '../components/ErrorBoundary';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <h1>Welcome to FilmChain</h1>
          <p className="hero-subtitle">
            The decentralized platform revolutionizing film financing and distribution
          </p>
          <div className="hero-buttons">
            <Link to="/projects" className="btn-primary">Explore Projects</Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="wallet-section">
        <div className="container">
          <div className="section-header">
            <h2>Connect Your Wallet</h2>
            <p>
              Connect your MetaMask wallet to access all features of the FilmChain platform.
            </p>
          </div>
          <div className="wallet-container">
            <ErrorBoundary>
              <MetaMaskConnector />
            </ErrorBoundary>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Platform Features</h2>
            <p>Discover how FilmChain is transforming the film industry</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-film"></i>
              </div>
              <h3>Decentralized Funding</h3>
              <p>
                Filmmakers can raise funds directly from fans and investors without intermediaries.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Transparent Revenue</h3>
              <p>
                All revenue streams are tracked on the blockchain, ensuring fair distribution to stakeholders.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-palette"></i>
              </div>
              <h3>NFT Collectibles</h3>
              <p>
                Exclusive digital collectibles from your favorite films, owned forever on the blockchain.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community Governance</h3>
              <p>
                Token holders can vote on platform decisions and film project funding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary>
        <IndieFundSection />
      </ErrorBoundary>

      <ErrorBoundary>
        <BlockOfficeSection />
      </ErrorBoundary>

      <ErrorBoundary>
        <NFTMarketSection />
      </ErrorBoundary>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Join the Revolution?</h2>
          <p>Start your journey in decentralized film production and distribution today.</p>
          <div className="cta-buttons">
            <Link to="/projects" className="btn-primary">Browse Projects</Link>
            <Link to="/marketplace" className="btn-secondary">Visit Marketplace</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
