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
            Revolutionizing the film industry through blockchain technology
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Vision</h2>
              <p>
                FilmChain is a revolutionary platform that leverages blockchain technology to transform the film industry.
                Our mission is to create a more transparent, accessible, and equitable ecosystem for filmmakers, investors, and audiences.
              </p>
              <p>
                We envision a future where filmmakers have direct access to funding and distribution channels,
                investors can easily participate in film projects with transparent returns, and audiences can
                engage more deeply with the content they love.
              </p>
            </div>
            <div className="about-image">
