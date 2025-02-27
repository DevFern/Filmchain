import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const IndieFundSection = () => {
  const { account, filmBalance = 1000, error: walletError } = useWallet();
  
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "The Last Symphony",
      director: "Maria Chen",
      genre: "Drama",
      currentFunding: 250000,
      fundingGoal: 500000,
      image: "https://i.ibb.co/VpHHLnYM/Last-Symphony.jpg",
      description: "A touching story about a deaf musician's journey to compose her final masterpiece. Set against the backdrop of 1950s Paris, this emotional drama explores themes of perseverance, artistic expression, and finding one's voice in a world of silence.",
      deadline: "2024-12-31",
      milestones: [
        { title: "Pre-production", description: "Script finalization and crew hiring", date: "2024-06-01", completed: true },
        { title: "Production", description: "Principal photography", date: "2024-08-01", completed: false },
        { title: "Post-production", description: "Editing and sound design", date: "2024-10-01", completed: false },
        { title: "Release", description: "Festival circuit and theatrical release", date: "2024-12-01", completed: false }
      ],
      updates: [
        { id: 1, title: "Director Announcement", content: "We're thrilled to announce Maria Chen as our director! With her background in musical composition and award-winning short films, Maria brings a unique perspective to this emotional story.", date: "2024-02-15", expanded: false },
        { id: 2, title: "Casting Complete", content: "After an extensive search, we've finalized our main cast. Award-winning actress Sophia Laurent will play our lead, with supporting roles filled by James Wilson and Elena Petrov.", date: "2024-03-01", expanded: false }
      ],
      team: [
        { name: "Maria Chen", role: "Director", image: "https://i.ibb.co/kGjhMX8/director1.jpg" },
        { name: "Thomas Wright", role: "Producer", image: "https://i.ibb.co/kGjhMX8/producer1.jpg" },
        { name: "Sophia Laurent", role: "Lead Actress", image: "https://i.ibb.co/kGjhMX8/actress1.jpg" }
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
      description: "A mind-bending journey through parallel universes and quantum realities. When physicist Dr. Alex Mercer discovers a way to access alternate dimensions, he finds himself caught in a web of different versions of his own life, forcing him to confront the consequences of choices he never made.",
      deadline: "2024-11-30",
      milestones: [
        { title: "Pre-production", description: "VFX planning and storyboards", date: "2024-05-01", completed: true },
        { title: "Production", description: "Principal photography", date: "2024-07-01", completed: false },
        { title: "Post-production", description: "VFX and sound design", date: "2024-09-01", completed: false },
        { title: "Release", description: "Theatrical release", date: "2024-11-01", completed: false }
      ],
      updates: [
        { id: 1, title: "VFX Team Assembled", content: "We've brought together a team of visual effects artists from major studios including veterans who worked on 'Inception' and 'Interstellar'.", date: "2024-02-20", expanded: false },
        { id: 2, title: "Location Scouting", content: "Our team has secured filming locations in Tokyo, Japan for the futuristic scenes. The neon-lit streets and advanced architecture provide the perfect backdrop for our quantum reality sequences.", date: "2024-03-10", expanded: false }
      ],
      team: [
        { name: "James Wilson", role: "Director", image: "https://i.ibb.co/kGjhMX8/director2.jpg" },
        { name: "Sarah Johnson", role: "VFX Supervisor", image: "https://i.ibb.co/kGjhMX8/vfx1.jpg" },
        { name: "Michael Chen", role: "Lead Actor", image: "https://i.ibb.co/kGjhMX8/actor1.jpg" }
      ]
    },
    {
      id: 3,
      title: "Echoes of Tomorrow",
      director: "Elena Petrov",
      genre: "Thriller",
      currentFunding: 350000,
      fundingGoal: 700000,
      image: "https://i.ibb.co/RT0vfKzb/The-Last-Sunset.jpg",
      description: "In a near-future society where memories can be digitally stored and traded, a memory detective uncovers a conspiracy that threatens to destabilize the entire system. As she delves deeper, she discovers her own memories may have been altered.",
      deadline: "2025-01-15",
      milestones: [
        { title: "Script Development", description: "Finalizing screenplay", date: "2024-06-15", completed: true },
        { title: "Pre-production", description: "Casting and location scouting", date: "2024-08-15", completed: false },
        { title: "Production", description: "Principal photography", date: "2024-10-15", completed: false },
        { title: "Post-production", description: "Editing and sound design", date: "2024-12-15", completed: false }
      ],
      updates: [
        { id: 1, title: "Script Completed", content: "Award-winning screenwriter David Mercer has completed the final draft of the screenplay, which has already garnered attention from several major production companies.", date: "2024-03-05", expanded: false }
      ],
      team: [
        { name: "Elena Petrov", role: "Director", image: "https://i.ibb.co/kGjhMX8/director3.jpg" },
        { name: "David Mercer", role: "Screenwriter", image: "https://i.ibb.co/kGjhMX8/writer1.jpg" }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [projectedReturn, setProjectedReturn] = useState(null);
  const [isInvesting, setIsInvesting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      
      // Show success modal
      setTimeout(() => {
        setIsInvesting(false);
        setShowSuccessModal(true);
      }, 1500);
      
    } catch (err) {
      console.error("Error investing:", err);
      setError("Transaction failed. Please try again.");
      setIsInvesting(false);
    }
  };

  return (
    <div className="indie-fund-container">
      <div className="section-header">
        <h2 className="section-title">IndieFund</h2>
        <p className="section-subtitle">Invest in the next generation of independent films and earn returns from box office success</p>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending Projects
        </button>
        <button 
          className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Arrivals
        </button>
        <button 
          className={`tab-button ${activeTab === 'ending' ? 'active' : ''}`}
          onClick={() => setActiveTab('ending')}
        >
          Ending Soon
        </button>
        {account && (
          <button 
            className={`tab-button ${activeTab === 'invested' ? 'active' : ''}`}
            onClick={() => setActiveTab('invested')}
          >
            My Investments
          </button>
        )}
      </div>
      
      <div className="grid">
        {projects.map(project => (
          <div key={project.id} className="card project-card">
            <div className="card-image">
              <img src={project.image} alt={project.title} />
              <div className="card-badge">
                {project.genre}
              </div>
            </div>
            <div className="card-content">
              <h3 className="card-title">{project.title}</h3>
              <p className="card-subtitle">Directed by {project.director}</p>
              
              <div className="funding-progress">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar"
                    style={{ width: `${(project.currentFunding / project.fundingGoal) * 100}%` }}
                  ></div>
                </div>
                <div className="funding-stats">
                  <span className="funding-raised">${project.currentFunding.toLocaleString()}</span>
                  <span className="funding-goal">of ${project.fundingGoal.toLocaleString()}</span>
                  <span className="funding-percentage">
                    {Math.round((project.currentFunding / project.fundingGoal) * 100)}%
                  </span>
                </div>
              </div>
              
              <p className="deadline">
                <i className="far fa-calendar-alt"></i> Deadline: {new Date(project.deadline).toLocaleDateString()}
              </p>
              
              <button 
                className="btn btn-primary btn-block"
                onClick={() => setSelectedProject(project)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Project Details Modal */}
      {selectedProject && (
        <div className={`modal-overlay ${selectedProject ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{selectedProject.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setSelectedProject(null);
                  setActivePhase(0);
                  setInvestmentAmount(0);
                  setProjectedReturn(null);
                  setError(null);
                  setActiveTab('overview');
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="project-header">
                <div className="project-image">
                  <img src={selectedProject.image} alt={selectedProject.title} />
                </div>
                <div className="project-meta">
                  <div className="meta-item">
                    <i className="fas fa-film"></i>
                    <span>{selectedProject.genre}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-user"></i>
                    <span>Director: {selectedProject.director}</span>
                  </div>
                  <div className="meta-item">
                    <i className="far fa-calendar-alt"></i>
                    <span>Deadline: {new Date(selectedProject.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="funding-progress">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar"
                    style={{ width: `${(selectedProject.currentFunding / selectedProject.fundingGoal) * 100}%` }}
                  ></div>
                </div>
                <div className="funding-stats">
                  <div className="funding-raised">
                    <span className="label">Raised</span>
                    <span className="value">${selectedProject.currentFunding.toLocaleString()}</span>
                  </div>
                  <div className="funding-goal">
                    <span className="label">Goal</span>
                    <span className="value">${selectedProject.fundingGoal.toLocaleString()}</span>
                  </div>
                  <div className="funding-percentage">
                    <span className="label">Progress</span>
                    <span className="value">
                      {Math.round((selectedProject.currentFunding / selectedProject.fundingGoal) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="project-tabs">
                <button 
                  className={`project-tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`project-tab ${activeTab === 'team' ? 'active' : ''}`}
                  onClick={() => setActiveTab('team')}
                >
                  Team
                </button>
                <button 
                  className={`project-tab ${activeTab === 'updates' ? 'active' : ''}`}
                  onClick={() => setActiveTab('updates')}
                >
                  Updates
                </button>
                <button 
                  className={`project-tab ${activeTab === 'invest' ? 'active' : ''}`}
                  onClick={() => setActiveTab('invest')}
                >
                  Invest
                </button>
              </div>
              
              <div className="project-tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    <div className="project-description">
                      <h4>About the Project</h4>
                      <p>{selectedProject.description}</p>
                    </div>
                    
                    <div className="project-milestones">
                      <h4>Project Timeline</h4>
                      <div className="timeline">
                        {selectedProject.milestones.map((milestone, index) => (
                          <div 
                            key={index}
                            className={`timeline-item ${milestone.completed ? 'completed' : ''} ${index === activePhase ? 'active' : ''}`}
                            onClick={() => setActivePhase(index)}
                          >
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <h5>{milestone.title}</h5>
                              <p>{milestone.description}</p>
                              <span className="timeline-date">{milestone.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'team' && (
                  <div className="team-tab">
                    <h4>Project Team</h4>
                    <div className="team-grid">
                      {selectedProject.team.map((member, index) => (
                        <div key={index} className="team-member">
                          <div className="member-avatar">
                            <img src={member.image} alt={member.name} />
                          </div>
                          <h5 className="member-name">{member.name}</h5>
                          <p className="member-role">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'updates' && (
                  <div className="updates-tab">
                    <h4>Project Updates</h4>
                    <div className="updates-list">
                      {selectedProject.updates.map(update => (
                        <div key={update.id} className="update-card">
                          <div className="update-header">
                            <h5>{update.title}</h5>
                            <span className="update-date">{update.date}</span>
                          </div>
                          <p className="update-content">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'invest' && (
                  <div className="invest-tab">
                    <div className="investment-calculator">
                      <h4>Investment Calculator</h4>
                      <p>Calculate your potential returns based on projected box office performance.</p>
                      
                      <div className="form-group">
                        <label className="form-label">Investment Amount (FILM)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          min="100"
                          step="100"
                          placeholder="Enter amount (min. 100 FILM)"
                        />
                      </div>
                      
                      <button 
                        className="btn btn-secondary"
                        onClick={calculateReturns}
                        disabled={isInvesting}
                      >
                        Calculate Potential Returns
                      </button>
                      
                      {projectedReturn && (
                        <div className="returns-preview">
                          <h5>Projected Returns</h5>
                          <div className="returns-value">{projectedReturn.toLocaleString()} FILM</div>
                          <p className="returns-note">
                            *Based on projected box office performance. Actual returns may vary.
                          </p>
                        </div>
                      )}
                      
                      <div className="wallet-balance">
                        <i className="fas fa-wallet"></i>
                        <span>Your FILM Balance: {filmBalance.toLocaleString()} FILM</span>
                      </div>
                      
                      <button 
                        className="btn btn-primary btn-block"
                        onClick={() => handleInvest(selectedProject.id)}
                        disabled={isInvesting || !investmentAmount || investmentAmount <= 0}
                      >
                        {isInvesting ? (
                          <span>
                            <i className="fas fa-spinner fa-spin"></i> Processing...
                          </span>
                        ) : (
                          'Invest Now'
                        )}
                      </button>
                      
                      {error && <p className="form-error">{error}</p>}
                    </div>
                    
                    <div className="investment-info">
                      <h4>How It Works</h4>
                      <div className="info-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <h5>Choose Your Investment</h5>
                          <p>Decide how many FILM tokens you want to invest in this project.</p>
                        </div>
                      </div>
                      <div className="info-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <h5>Receive Ownership Tokens</h5>
                          <p>Get project-specific tokens representing your share of the film.</p>
                        </div>
                      </div>
                      <div className="info-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                          <h5>Earn Returns</h5>
                          <p>Receive a share of the film's revenue proportional to your investment.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className={`modal-overlay ${showSuccessModal ? 'active' : ''}`}>
          <div className="modal-content success-modal">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Investment Successful!</h3>
            <p>Your investment has been processed successfully. You can track your investments in the "My Investments" tab.</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedProject(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {walletError && <p className="form-error">{walletError}</p>}
    </div>
  );
};

export default IndieFundSection;
