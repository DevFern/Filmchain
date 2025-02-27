import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const BlockOfficeSection = () => {
  const { account, filmBalance, error: walletError } = useWallet();
  
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "The Quantum Effect",
      status: "In Production",
      budget: 2500000,
      raised: 1800000,
      genre: "Sci-Fi Thriller",
      director: "Emma Thompson",
      cast: ["Michael Chen", "Sarah Peters", "David Kumar"],
      timeline: "Q2 2024 - Q4 2024",
      image: "https://i.ibb.co/r2DxzVcT/Quantum-Effect.jpg",
      milestones: [
        { phase: "Pre-production", status: "Completed", percentage: 100 },
        { phase: "Production", status: "In Progress", percentage: 60 },
        { phase: "Post-production", status: "Pending", percentage: 0 }
      ],
      description: "A mind-bending journey through quantum realities as a physicist discovers the ability to see parallel universes, but at a devastating cost to her own reality.",
      distribution: "Theatrical release planned for Q1 2025, followed by streaming platforms.",
      roi: "Projected 25% return on investment within 18 months of release."
    },
    {
      id: 2,
      title: "Desert Winds",
      status: "Pre-production",
      budget: 1800000,
      raised: 900000,
      genre: "Drama",
      director: "Carlos Rodriguez",
      cast: ["Anna Smith", "James Wilson"],
      timeline: "Q3 2024 - Q1 2025",
      image: "https://i.ibb.co/p6S7BPpj/Dessertwinds.jpg",
      milestones: [
        { phase: "Pre-production", status: "In Progress", percentage: 75 },
        { phase: "Production", status: "Pending", percentage: 0 },
        { phase: "Post-production", status: "Pending", percentage: 0 }
      ],
      description: "A powerful drama set in the American Southwest, following a family's struggle to preserve their land and heritage against corporate interests.",
      distribution: "Festival circuit followed by limited theatrical release and streaming.",
      roi: "Projected 18% return on investment within 24 months of release."
    }
  ]);

  const [activeProject, setActiveProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [error, setError] = useState(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    genre: '',
    director: '',
    budget: '',
    description: '',
    timeline: '',
    image: ''
  });

  // In a real app, you would fetch projects from the blockchain
  useEffect(() => {
    // Simulating loading projects from blockchain
    // This would be replaced with actual contract calls
  }, [account]);

  const openProjectDetails = (project) => {
    setActiveProject(project);
    setShowProjectModal(true);
  };

  const handleInvest = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }

    if (parseFloat(investmentAmount) > filmBalance) {
      setError("Insufficient FILM token balance");
      return;
    }

    setIsInvesting(true);
    setError(null);

    try {
      // In a real app, you would call the smart contract here
      // For now, we'll just simulate a successful investment
      
      // Update the project's funding
      setProjects(prev => prev.map(project => 
        project.id === activeProject.id
          ? {...project, raised: project.raised + parseFloat(investmentAmount)}
          : project
      ));

      // Reset form
      setInvestmentAmount('');
      
      // Close modal after successful investment
      // In a real app, you would wait for transaction confirmation
      setTimeout(() => {
        setShowProjectModal(false);
        setIsInvesting(false);
      }, 1500);
      
    } catch (err) {
      console.error("Error investing:", err);
      setError("Transaction failed. Please try again.");
      setIsInvesting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitNewProject = (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    // Validate form
    if (!newProject.title || !newProject.genre || !newProject.director || !newProject.budget) {
      setError("Please fill in all required fields");
      return;
    }

    setIsInvesting(true);
    setError(null);

    try {
      // In a real app, you would call the smart contract here
      // For now, we'll just simulate adding a new project
      
      const projectToAdd = {
        id: projects.length + 1,
        title: newProject.title,
        genre: newProject.genre,
        director: newProject.director,
        budget: parseFloat(newProject.budget),
        raised: 0,
        status: "Pre-production",
        cast: [],
        timeline: newProject.timeline || "TBD",
        image: newProject.image || "https://placehold.co/400x300/9c27b0/ffffff?text=Film",
        description: newProject.description || "No description provided.",
        milestones: [
          { phase: "Pre-production", status: "Pending", percentage: 0 },
          { phase: "Production", status: "Pending", percentage: 0 },
          { phase: "Post-production", status: "Pending", percentage: 0 }
        ],
        distribution: "TBD",
        roi: "TBD"
      };

      setProjects(prev => [...prev, projectToAdd]);
      
      // Reset form
      setNewProject({
        title: '',
        genre: '',
        director: '',
        budget: '',
        description: '',
        timeline: '',
        image: ''
      });
      
      // Close form after successful submission
      setTimeout(() => {
        setShowNewProjectForm(false);
        setIsInvesting(false);
      }, 1500);
      
    } catch (err) {
      console.error("Error submitting project:", err);
      setError("Submission failed. Please try again.");
      setIsInvesting(false);
    }
  };

  return (
    <div className="block-office-container">
      <div className="section-header">
        <h2>Block Office</h2>
        <p>Discover and invest in film projects with transparent production tracking</p>
        <button 
          className="new-project-btn"
          onClick={() => setShowNewProjectForm(true)}
        >
          Submit New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="project-card"
            onClick={() => openProjectDetails(project)}
          >
            <img 
              src={project.image} 
              alt={project.title} 
              className="project-image"
            />
            <div className="project-info">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
              </div>

              <div className="project-details">
                <p className="director">Director: {project.director}</p>
                <p className="genre">Genre: {project.genre}</p>
                
                <div className="funding-progress">
                  <div className="funding-labels">
                    <span>${(project.raised/1000000).toFixed(1)}M</span>
                    <span>${(project.budget/1000000).toFixed(1)}M</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar"
                      style={{width: `${(project.raised/project.budget) * 100}%`}}
                    ></div>
                  </div>
                </div>

                <div className="cast-tags">
                  {project.cast.slice(0, 2).map(actor => (
                    <span key={actor} className="cast-tag">
                      {actor}
                    </span>
                  ))}
                  {project.cast.length > 2 && (
                    <span className="cast-tag">
                      +{project.cast.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      {showProjectModal && activeProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={() => {
                setShowProjectModal(false);
                setActiveProject(null);
                setInvestmentAmount('');
                setError(null);
              }}
            >
              ×
            </button>
            
            <div className="project-details">
              <h2>{activeProject.title}</h2>

              <img 
                src={activeProject.image} 
                alt={activeProject.title} 
                className="project-detail-image"
              />

              <div className="project-meta-grid">
                <div className="meta-item">
                  <h4>Director</h4>
                  <p>{activeProject.director}</p>
                </div>
                <div className="meta-item">
                  <h4>Genre</h4>
                  <p>{activeProject.genre}</p>
                </div>
                <div className="meta-item">
                  <h4>Timeline</h4>
                  <p>{activeProject.timeline}</p>
                </div>
                <div className="meta-item">
                  <h4>Status</h4>
                  <p>{activeProject.status}</p>
                </div>
              </div>

              <div className="project-description">
                <h3>Synopsis</h3>
                <p>{activeProject.description}</p>
              </div>

              <div className="milestones-section">
                <h3>Production Milestones</h3>
                <div className="milestones-list">
                  {activeProject.milestones.map(milestone => (
                    <div key={milestone.phase} className="milestone-item">
                      <div className="milestone-header">
                        <span>{milestone.phase}</span>
                        <span>{milestone.status}</span>
                      </div>
                      <div className="milestone-progress-bar">
                        <div 
                          className="milestone-progress"
                          style={{width: `${milestone.percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cast-section">
                <h3>Cast</h3>
                <div className="cast-list">
                  {activeProject.cast.map(actor => (
                    <span key={actor} className="cast-tag">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="distribution-section">
                <h3>Distribution Plan</h3>
                <p>{activeProject.distribution}</p>
              </div>

              <div className="roi-section">
                <h3>Return on Investment</h3>
                <p>{activeProject.roi}</p>
              </div>

              <div className="investment-section">
                <h3>Invest in Project</h3>
                <div className="wallet-balance">
                  <p>Your FILM Balance: {filmBalance} FILM</p>
                </div>
                <div className="investment-input">
                  <input
                    type="number"
                    placeholder="Enter amount to invest"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min="0"
                  />
                  <button 
                    className="invest-btn"
                    onClick={handleInvest}
                    disabled={isInvesting}
                  >
                    {isInvesting ? 'Processing...' : 'Invest Now'}
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Form Modal */}
      {showNewProjectForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={() => {
                setShowNewProjectForm(false);
                setError(null);
              }}
            >
              ×
            </button>
            
            <div className="new-project-form">
              <h2>Submit New Project</h2>
              
              <form onSubmit={handleSubmitNewProject}>
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    value={newProject.genre}
                    onChange={(e) => setNewProject(prev => ({ ...prev, genre: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Director</label>
                  <input
                    type="text"
                    value={newProject.director}
                    onChange={(e) => setNewProject(prev => ({ ...prev, director: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Budget (USD)</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                    required
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Timeline</label>
                  <input
                    type="text"
