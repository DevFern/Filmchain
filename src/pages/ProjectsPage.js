// src/pages/ProjectsPage.js
import React from 'react';
import IndieFundSection from '../components/IndieFundSection';
import ErrorBoundary from '../components/ErrorBoundary';
import './ProjectsPage.css';

const ProjectsPage = () => {
  return (
    <div className="projects-page">
      <section className="page-header">
        <div className="container">
          <h1>Film Projects</h1>
          <p className="page-subtitle">
            Discover and invest in innovative film projects from around the world
          </p>
        </div>
      </section>

      <ErrorBoundary>
        <IndieFundSection />
      </ErrorBoundary>
    </div>
  );
};

export default ProjectsPage;
