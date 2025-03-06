// src/pages/HyrePage.js
import React from 'react';
import BlockOfficeSection from '../components/BlockOfficeSection';
import ErrorBoundary from '../components/ErrorBoundary';
import './HyrePage.css';

const HyrePage = () => {
  return (
    <div className="hyre-page">
      <section className="page-header">
        <div className="container">
          <h1>Hyre Block</h1>
          <p className="page-subtitle">
            Connect with top film industry talent and opportunities on the blockchain
          </p>
        </div>
      </section>

      <ErrorBoundary>
        <BlockOfficeSection />
      </ErrorBoundary>
    </div>
  );
};

export default HyrePage;
