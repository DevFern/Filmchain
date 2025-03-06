// src/pages/HomePage.js
import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Import your section components
// Uncomment these as you fix each component
// import BlockOfficeSection from '../components/BlockOfficeSection';
// import CommunityVoiceSection from '../components/CommunityVoiceSection';
// import HyreBlockSection from '../components/HyreBlockSection';

const HomePage = () => {
  const { account } = useWallet();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <h1>Welcome to FilmChain</h1>
          <p>The decentralized platform for the film industry</p>
          
          {/* This section will always show regardless of wallet connection */}
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Box Office Analytics</h3>
              <p>Track film performance with blockchain-verified data</p>
            </div>
            <div className="feature-card">
              <h3>Community Governance</h3>
              <p>Vote on proposals and shape the future of film</p>
            </div>
            <div className="feature-card">
              <h3>Film Industry Jobs</h3>
              <p>Find work or talent in the decentralized film economy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wrap each section in ErrorBoundary to prevent one broken component from crashing the whole page */}
      <ErrorBoundary>
        <div className="placeholder-section">
          <h2>Box Office Analytics</h2>
          <p>This section will display film performance data.</p>
          {!account && <p>Connect your wallet to see detailed analytics</p>}
        </div>
        {/* <BlockOfficeSection /> */}
      </ErrorBoundary>

      <ErrorBoundary>
        <div className="placeholder-section">
          <h2>Community Voice</h2>
          <p>This section will display governance proposals.</p>
          {!account && <p>Connect your wallet to participate in governance</p>}
        </div>
        {/* <CommunityVoiceSection /> */}
      </ErrorBoundary>

      <ErrorBoundary>
        <div className="placeholder-section">
          <h2>HyreBlock</h2>
          <p>This section will display film industry jobs.</p>
          {!account && <p>Connect your wallet to apply for jobs or post listings</p>}
        </div>
        {/* <HyreBlockSection /> */}
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
