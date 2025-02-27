import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

const IndieFundSection = () => {
  const { account, provider, filmTokenContract, filmBalance, error: walletError } = useWallet();
  
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "The Last Symphony",
      director: "Maria Chen",
      genre: "Drama",
      currentFunding: 250000,
      fundingGoal: 500000,
      image: "https://i.ibb.co/VpHHLnYM/Last-Symphony.jpg",
      description: "A touching story about a deaf musician's journey to compose her final masterpiece.",
      deadline: "2024-12-31",
      milestones: [
        { title: "Pre-production", description: "Script finalization and crew hiring", date: "2024-06-01", completed: true },
        { title: "Production", description: "Principal photography", date: "2024-08-01", completed: false },
        { title: "Post-production", description: "Editing and sound design", date: "2024-10-01", completed: false },
        { title: "Release", description: "Festival circuit and theatrical release", date: "2024-12-01", completed: false }
      ],
      updates: [
        { id: 1, title: "Director Announcement", content: "We're thrilled to announce Maria Chen as our director!", date: "2024-02-15", expanded: false },
        { id: 2, title: "Casting Complete", content: "Main cast has been finalized after extensive auditions.", date: "2024-03-01", expanded: false }
      ]
    },
    {
      id: 2,
      title: "Quantum Dreams",
      director: "James Wilson",
      genre: "Sci-Fi",
      currentFunding: 800000,
      fundingGoal: 1200000,
      image: "https://i.ibb.co/d4zkmt45/Quantum-Dreams.jpg",
      description: "A mind-bending journey through parallel universes and quantum realities.",
      deadline: "2024-11-30",
      milestones: [
        { title: "Pre-production", description: "VFX planning and storyboards", date: "2024-05-01", completed: true },
        { title: "Production", description: "Principal photography", date: "2024-07-01", completed: false },
        { title: "Post-production", description: "VFX and sound design", date: "2024-09-01", completed: false },
        { title: "Release", description: "Theatrical release", date: "2024-11-01", completed: false }
      ],
      updates: [
        { id: 1, title: "VFX Team Assembled", content: "Top artists from major studios join the project!", date: "2024-02-20", expanded: false },
        { id: 2, title: "Location Scouting", content: "Perfect futuristic locations found in Tokyo.", date: "2024-03-10", expanded: false }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [projectedReturn, setProjectedReturn] = useState(null);
  const [isInvesting, setIsInvesting] = useState(false);
  const [error, setError] = useState(null);

  // In a real app, you would fetch projects from the blockchain
  useEffect(() => {
    // Simulating loading projects from blockchain
    // This would be replaced with actual contract calls
  }, [account, provider]);

  const calculateReturns = () => {
    if (!investmentAmount || investmentAmount <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }
    
    // Simple ROI calculation - in a real app this would be more sophisticated
    const projectedReturn = investmentAmount * 1.5;
    setProjectedReturn(projectedReturn);
    setError(null);
  };

  const handleInvest = async (projectId) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!investmentAmount || investmentAmount <= 0) {
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
        project.id === projectId
          ? {...project, currentFunding: project.currentFunding + parseFloat(investmentAmount)}
          : project
      ));

      // Reset form
      setInvestmentAmount(0);
      setProjectedReturn(null);
      
      // Close modal after successful investment
      // In a real app, you would wait for transaction confirmation
      setTimeout(() => {
        setSelectedProject(null);
        setIsInvesting(false);
      }, 1500);
      
    } catch (err) {
      console.error("Error investing:", err);
      setError("Transaction failed. Please try again.");
      setIsInvesting(false);
    }
  };

  const ProjectCard = ({ project }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    
    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const rotateX = (y - rect.height / 2) / 10;
      const rotateY = (rect.width / 2 - x) / 10;
      
      setRotation({ x: rotateX, y: rotateY });
    };

    const percentage = (project.currentFunding / project.fundingGoal) * 100;

    return (
      <div 
        className="project-card"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotation({ x: 0, y: 0 })}
        onClick={() => setSelectedProject(project)}
      >
        <img src={project.image} alt={project.title} className="project-image" />
        <div className="project-info">
          <h3>{project.title}</h3>
          <p className="director">Directed by {project.director}</p>
          <p className="genre">{project.genre}</p>
          
          <div className="funding-progress-container">
            <div 
              className="funding-bar"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <p className="funding-details">
            ${project.currentFunding.toLocaleString()} of ${project.fundingGoal.toLocaleString()}
          </p>
          
          <p className="deadline">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
        </div>
      </div>
    );
  };

  const ProjectDetails = ({ project }) => {
    return (
      <div className="project-details-modal">
        <div className="modal-content">
          <button 
            className="close-btn"
            onClick={() => setSelectedProject(null)}
          >
            ×
          </button>
          
          <h2>{project.title}</h2>
          <p className="project-description">{project.description}</p>
          
          <div className="project-meta">
            <div className="meta-item">
              <span className="meta-label">Director:</span>
              <span className="meta-value">{project.director}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Genre:</span>
              <span className="meta-value">{project.genre}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Deadline:</span>
              <span className="meta-value">{new Date(project.deadline).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="funding-section">
            <h3>Funding Progress</h3>
            <div className="funding-progress-container">
              <div 
                className="funding-bar"
                style={{ width: `${(project.currentFunding / project.fundingGoal) * 100}%` }}
              ></div>
            </div>
            <p className="funding-details">
              ${project.currentFunding.toLocaleString()} of ${project.fundingGoal.toLocaleString()}
            </p>
          </div>
          
          <div className="timeline-container">
            {project.milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`timeline-node ${index <= activePhase ? 'completed' : ''}`}
                onClick={() => setActivePhase(index)}
              >
                <div className="milestone-content">
                  <h4>{milestone.title}</h4>
                  <p>{milestone.description}</p>
                  <span className="date">{milestone.date}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="investment-simulator">
            <h3>Investment Calculator</h3>
            <div className="input-group">
              <label>Investment Amount (FILM)</label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <button 
              onClick={calculateReturns} 
              className="calculate-btn"
              disabled={isInvesting}
            >
              Calculate Potential Returns
            </button>
            {projectedReturn && (
              <div className="returns-preview">
                <h4>Projected Returns</h4>
                <p>{projectedReturn.toLocaleString()} FILM</p>
              </div>
            )}
            
            <button 
              onClick={() => handleInvest(project.id)} 
              className="invest-btn"
              disabled={isInvesting || !investmentAmount || investmentAmount <= 0}
            >
              {isInvesting ? 'Processing...' : 'Invest Now'}
            </button>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="wallet-balance">
              <p>Your FILM Balance: {filmBalance} FILM</p>
            </div>
          </div>
          
          <div className="updates-section">
            <h3>Project Updates</h3>
            {project.updates.map(update => (
              <div key={update.id} className="update-card">
                <h4>{update.title}</h4>
                <p>{update.content}</p>
                <span className="date">{update.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="indie-fund-container">
      <div className="section-header">
        <h2 className="section-title">Featured Projects</h2>
        <p>Invest in the next generation of independent films</p>
      </div>
      
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {selectedProject && <ProjectDetails project={selectedProject} />}
      
      {walletError && <p className="error-message">{walletError}</p>}
    </div>
  );
};

export default IndieFundSection;
