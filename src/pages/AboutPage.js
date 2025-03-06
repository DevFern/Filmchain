// src/pages/AboutPage.js
import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About FilmChain</h1>
        <p>FilmChain is a decentralized platform for the film industry, connecting filmmakers, investors, and audiences through blockchain technology.</p>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>We're building a more transparent, accessible, and equitable film industry where creators can connect directly with their audience and investors.</p>
        </section>
        
        <section className="about-section">
          <h2>How It Works</h2>
          <p>FilmChain leverages blockchain technology to create verifiable records of film performance, transparent funding mechanisms, and decentralized governance for the community.</p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
