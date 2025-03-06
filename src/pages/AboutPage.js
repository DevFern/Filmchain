// src/pages/AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <h1>About FilmChain</h1>
          <p className="page-subtitle">
            Revolutionizing film financing and distribution through blockchain technology
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Mission</h2>
              <p>
                FilmChain is dedicated to democratizing the film industry by creating a decentralized platform that connects filmmakers directly with audiences and investors. We believe in a future where creative vision isn't limited by traditional gatekeepers, and where everyone can participate in the success of the films they love.
              </p>
              <p>
                Through blockchain technology, we're making film financing more transparent, efficient, and accessible while ensuring fair compensation for all contributors to a film's success.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" alt="Film production" />
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Team</h2>
            <p>Meet the passionate individuals behind FilmChain</p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2344&q=80" alt="Team member" className="team-image" />
              <div className="team-content">
                <h3 className="team-name">Alex Johnson</h3>
                <p className="team-role">Founder & CEO</p>
                <p className="team-bio">Former film producer with 15 years of industry experience and a passion for blockchain technology.</p>
              </div>
            </div>
            <div className="team-card">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80" alt="Team member" className="team-image" />
              <div className="team-content">
                <h3 className="team-name">Sarah Chen</h3>
                <p className="team-role">CTO</p>
                <p className="team-bio">Blockchain developer and architect with experience building decentralized applications.</p>
              </div>
            </div>
            <div className="team-card">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" alt="Team member" className="team-image" />
              <div className="team-content">
                <h3 className="team-name">Michael Rodriguez</h3>
                <p className="team-role">Head of Partnerships</p>
                <p className="team-bio">Industry veteran with extensive connections in Hollywood and independent film circuits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="roadmap-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Roadmap</h2>
            <p>The journey ahead for FilmChain</p>
          </div>
          <div className="roadmap-timeline">
            <div className="timeline-item">
              <div className="timeline-content">
                <span className="timeline-date">Q1 2023</span>
                <h3 className="timeline-title">Platform Launch</h3>
                <p className="timeline-description">Initial release of the FilmChain platform with core functionality for film funding and NFT marketplace.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <span className="timeline-date">Q3 2023</span>
                <h3 className="timeline-title">Governance Implementation</h3>
                <p className="timeline-description">Introduction of community governance through FILM token voting rights.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <span className="timeline-date">Q1 2024</span>
                <h3 className="timeline-title">Distribution Platform</h3>
                <p className="timeline-description">Launch of decentralized film distribution platform with revenue sharing.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <span className="timeline-date">Q4 2024</span>
                <h3 className="timeline-title">Global Expansion</h3>
                <p className="timeline-description">Partnerships with international film festivals and studios to bring FilmChain worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Join the FilmChain Revolution</h2>
          <p>Be part of the future of film financing and distribution</p>
          <div className="cta-buttons">
            <Link to="/projects" className="btn-primary">Explore Projects</Link>
            <Link to="/marketplace" className="btn-secondary">Visit Marketplace</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
