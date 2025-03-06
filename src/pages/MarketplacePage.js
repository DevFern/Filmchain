// src/pages/MarketplacePage.js
import React from 'react';
import NFTMarketSection from '../components/NFTMarketSection';
import ErrorBoundary from '../components/ErrorBoundary';
import './MarketplacePage.css';

const MarketplacePage = () => {
  return (
    <div className="marketplace-page">
      <section className="page-header">
        <div className="container">
          <h1>NFT Marketplace</h1>
          <p className="page-subtitle">
            Buy, sell, and trade film memorabilia and digital collectibles
          </p>
        </div>
      </section>

      <ErrorBoundary>
        <NFTMarketSection />
      </ErrorBoundary>
    </div>
  );
};

export default MarketplacePage;
