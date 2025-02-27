import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const CommunityVoiceSection = () => {
  const { account, filmBalance = 1000, error: walletError } = useWallet();
  
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Sustainable Film Production Initiative",
      author: "EcoFilm Collective",
      authorAddress: "0x7890...1234",
      description: "Implementing green practices in film production to reduce environmental impact. This proposal aims to establish a certification system for productions that meet specific environmental standards, including waste reduction, energy efficiency, and sustainable sourcing of materials.",
      category: "Sustainability",
      votes: {
        up: 156,
        down: 23
      },
      status: "Active",
      deadline: "2024-06-30",
      comments: [
        {
          id: 1,
          author: "GreenDirector",
          authorAddress: "0x1234...5678",
          text: "We've successfully implemented similar practices in our last production, reducing waste by 60%. The key was involving department heads early in the planning process and setting clear sustainability goals.",
          timestamp: "2024-03-15T10:30:00",
          likes: 45
        },
        {
          id: 2,
          author: "ProductionPro",
          authorAddress: "0x5678...9012",
          text: "Would love to see specific guidelines for different department heads. Each department has unique challenges when it comes to sustainability.",
          timestamp: "2024-03-16T15:20:00",
          likes: 28
        }
      ],
      milestones: [
        { title: "Proposal Submission", description: "Initial proposal submitted to community", completed: true },
        { title: "Community Review", description: "Feedback gathering and proposal refinement", completed: true },
        { title: "Implementation Plan", description: "Detailed action plan development", completed: false },
        { title: "Pilot Program", description: "Testing with select productions", completed: false }
      ],
      budget: 50000,
      timeline: "6 months"
    },
    {
      id: 2,
      title: "Emerging Filmmakers Mentorship Program",
      author: "Film Education Alliance",
      authorAddress: "0x3456...7890",
      description: "Connecting experienced filmmakers with emerging talent for year-long mentorship. The program will pair established directors, producers, and other film professionals with promising newcomers, providing structured guidance, networking opportunities, and practical experience on real productions.",
      category: "Education",
      votes: {
        up: 234,
        down: 12
      },
      status: "Active",
      deadline: "2024-07-15",
      comments: [
        {
          id: 1,
          author: "MentorMatch",
          authorAddress: "0x2345...6789",
          text: "This could revolutionize how we nurture new talent in the industry. I've seen similar programs work wonders in other creative fields.",
          timestamp: "2024-03-14T09:15:00",
          likes: 67
        }
      ],
      milestones: [
        { title: "Program Structure", description: "Define mentorship framework and expectations", completed: true },
        { title: "Mentor Recruitment", description: "Enlist experienced filmmakers as mentors", completed: false },
        { title: "Participant Selection", description: "Application and selection process", completed: false },
        { title: "Program Launch", description: "Kickoff event and first mentorship matches", completed: false }
      ],
      budget: 75000,
      timeline: "12 months"
    },
    {
      id: 3,
      title: "Blockchain Distribution Platform for Independent Films",
      author: "Indie Chain Collective",
      authorAddress: "0x9012...3456",
      description: "Creating a decentralized platform for independent filmmakers to distribute their work directly to audiences. This platform will eliminate traditional middlemen, allowing creators to retain more control and revenue while providing audiences with transparent pricing and revenue sharing.",
      category: "Distribution",
      votes: {
        up: 189,
        down: 45
      },
      status: "Active",
      deadline: "2024-08-20",
      comments: [
        {
          id: 1,
          author: "BlockchainFilmmaker",
          authorAddress: "0x3456...7890",
          text: "This is exactly what the indie film community needs to break free from traditional gatekeepers.",
          timestamp: "2024-03-12T14:45:00",
          likes: 53
        }
      ],
      milestones: [
        { title: "Platform Design", description: "Technical architecture and UI/UX design", completed: true },
        { title: "Smart Contract Development", description: "Building the core blockchain functionality", completed: false },
        { title: "Beta Testing", description: "Limited release to select filmmakers", completed: false },
        { title: "Public Launch", description: "Full platform release", completed: false }
      ],
      budget: 120000,
      timeline: "9 months"
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showNewProposalForm, setShowNewProposalForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'Distribution',
    deadline: '',
    budget: '',
    timeline: ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    { id: 'all', name: 'All Proposals' },
    { id: 'Distribution', name: 'Distribution' },
    { id: 'Production', name: 'Production' },
    { id: 'Education', name: 'Education' },
    { id: 'Sustainability', name: 'Sustainability' },
    { id: 'Technology', name: 'Technology' }
  ];

  const handleVote = async (proposalId, voteType) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    // Check if user has already voted on this proposal
    if (userVotes[proposalId]) {
      setError("You have already voted on this proposal");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you would call the smart contract here
      // For now, we'll just simulate a successful vote
      
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          const updatedVotes = { ...proposal.votes };
          updatedVotes[voteType] += 1;
          return { ...proposal, votes: updatedVotes };
        }
        return proposal;
      }));

      // Record that user has voted on this proposal
      setUserVotes(prev => ({ ...prev, [proposalId]: voteType }));
      
      // Show success message
      setSuccessMessage(`Your vote has been recorded successfully!`);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error voting:", err);
      setError("Vote failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (proposalId) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you would call the smart contract here
      // For now, we'll just simulate adding a comment
      
      const newComment = {
        id: Date.now(),
        author: account.substring(0, 6) + '...' + account.substring(account.length - 4),
        authorAddress: account,
        text: commentText,
        timestamp: new Date().toISOString(),
        likes: 0
      };

      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          return { ...proposal, comments: [newComment, ...proposal.comments] };
        }
        return proposal;
      }));

      // Reset comment form
      setCommentText('');
      
      // Show success message
      setSuccessMessage("Your comment has been added successfully!");
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Comment submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    // Validate form
    if (!newProposal.title || !newProposal.description || !newProposal.deadline || !newProposal.budget || !newProposal.timeline) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you would call the smart contract here
      // For now, we'll just simulate adding a new proposal
      
      const proposalToAdd = {
        id: proposals.length + 1,
        title: newProposal.title,
        author: account.substring(0, 6) + '...' + account.substring(account.length - 4),
        authorAddress: account,
        description: newProposal.description,
        category: newProposal.category,
        votes: {
          up: 1, // Creator's vote
          down: 0
        },
        status: "Active",
        deadline: newProposal.deadline,
        comments: [],
        milestones: [
          { title: "Proposal Submission", description: "Initial proposal submitted to community", completed: true },
          { title: "Community Review", description: "Feedback gathering and proposal refinement", completed: false },
          { title: "Implementation Plan", description: "Detailed action plan development", completed: false },
          { title: "Execution", description: "Implementation of the proposal", completed: false }
        ],
        budget: parseFloat(newProposal.budget),
        timeline: newProposal.timeline
      };

      setProposals(prev => [...prev, proposalToAdd]);
      
      // Record creator's vote
      setUserVotes(prev => ({ ...prev, [proposalToAdd.id]: 'up' }));
      
      // Reset form
      setNewProposal({
        title: '',
        description: '',
        category: 'Distribution',
        deadline: '',
        budget: '',
        timeline: ''
      });
      
      // Show success message
      setSuccessMessage("Your proposal has been submitted successfully!");
      setShowSuccessModal(true);
      
      // Close form after successful submission
      setTimeout(() => {
        setShowNewProposalForm(false);
        setIsSubmitting(false);
        setShowSuccessModal(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error submitting proposal:", err);
      setError("Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    }
    
    return formatDate(timestamp);
  };

  const likeComment = (proposalId, commentId) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId) {
        const updatedComments = proposal.comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          return comment;
        });
        return { ...proposal, comments: updatedComments };
      }
      return proposal;
    }));
  };

  return (
    <div className="community-voice-container">
      <div className="section-header">
        <h2 className="section-title">Community Voice</h2>
        <p className="section-subtitle">Propose and vote on initiatives to shape the future of FilmChain</p>
      </div>
      
      <div className="tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`tab-button ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid">
        {proposals
          .filter(proposal => activeCategory === 'all' || proposal.category === activeCategory)
          .map(proposal => {
            const totalVotes = proposal.votes.up + proposal.votes.down;
            const approvalPercentage = totalVotes > 0 
              ? Math.round((proposal.votes.up / totalVotes) * 100) 
              : 0;
            
            return (
              <div 
                key={proposal.id} 
                className="card proposal-card"
                onClick={() => {
                  setSelectedProposal(proposal);
                  setShowProposalModal(true);
                  setActiveTab('overview');
                }}
              >
                <div className="card-content">
                  <div className="proposal-header">
                    <h3 className="card-title">{proposal.title}</h3>
                    <span className="category-tag">{proposal.category}</span>
                  </div>
                  
                  <p className="card-subtitle">Proposed by {proposal.author}</p>
                  
                  <p className="proposal-description">{proposal.description.substring(0, 150)}...</p>
                  
                  <div className="funding-progress">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{ width: `${approvalPercentage}%` }}
                      ></div>
                    </div>
                    <div className="funding-stats">
                      <span className="approval-percentage">{approvalPercentage}% Approval</span>
                      <span className="vote-count">{totalVotes} votes</span>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="comment-count">
                      <i className="fas fa-comment"></i>
                      <span>{proposal.comments.length}</span>
                    </div>
                    <div className="deadline">
                      <i className="far fa-calendar-alt"></i>
                      <span>Deadline: {formatDate(proposal.deadline)}</span>
                    </div>
                    <div className={`status-badge ${proposal.status.toLowerCase()}`}>
                      {proposal.status}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <button 
        className="btn-floating"
        onClick={() => setShowNewProposalForm(true)}
        aria-label="Create new proposal"
      >
        <i className="fas fa-plus"></i>
      </button>

      {/* Proposal Details Modal */}
      {showProposalModal && selectedProposal && (
        <div className={`modal-overlay ${showProposalModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{selectedProposal.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowProposalModal(false);
                  setSelectedProposal(null);
                  setCommentText('');
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="proposal-meta">
                <div className="meta-item">
                  <i className="fas fa-user"></i>
                  <span>Proposed by {selectedProposal.author}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-tag"></i>
                  <span>{selectedProposal.category}</span>
                </div>
                <div className="meta-item">
                  <i className="far fa-calendar-alt"></i>
                  <span>Deadline: {formatDate(selectedProposal.deadline)}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-dollar-sign"></i>
                  <span>Budget: ${selectedProposal.budget.toLocaleString()}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>Timeline: {selectedProposal.timeline}</span>
                </div>
              </div>
              
              <div className="proposal-tabs">
                <button 
                  className={`proposal-tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`proposal-tab ${activeTab === 'milestones' ? 'active' : ''}`}
                  onClick={() => setActiveTab('milestones')}
                >
                  Milestones
                </button>
                <button 
                  className={`proposal-tab ${activeTab === 'discussion' ? 'active' : ''}`}
                  onClick={() => setActiveTab('discussion')}
                >
                  Discussion ({selectedProposal.comments.length})
                </button>
                <button 
                  className={`proposal-tab ${activeTab === 'vote' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vote')}
                >
                  Vote
                </button>
              </div>
              
              <div className="proposal-tab-content">
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    <div className="proposal-description">
                      <h4>About the Proposal</h4>
                      <p>{selectedProposal.description}</p>
                    </div>
                    
                    <div className="proposal-stats">
                      <div className="stats-item">
                        <h4>Approval Rating</h4>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar"
                            style={{ width: `${Math.round((selectedProposal.votes.up / (selectedProposal.votes.up + selectedProposal.votes.down)) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="stats-values">
                          <span>{Math.round((selectedProposal.votes.up / (selectedProposal.votes.up + selectedProposal.votes.down)) * 100)}% Approval</span>
                          <span>{selectedProposal.votes.up + selectedProposal.votes.down} Total Votes</span>
                        </div>
                      </div>
                      
                      <div className="stats-item">
                        <h4>Status</h4>
                        <div className={`status-badge large ${selectedProposal.status.toLowerCase()}`}>
                          {selectedProposal.status}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'milestones' && (
                  <div className="milestones-tab">
                    <h4>Project Timeline</h4>
                    <div className="timeline">
                      {selectedProposal.milestones.map((milestone, index) => (
                        <div 
                          key={index}
                          className={`timeline-item ${milestone.completed ? 'completed' : ''}`}
                        >
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <h5>{milestone.title}</h5>
                            <p>{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'discussion' && (
                  <div className="discussion-tab">
                    <div className="comment-form">
                      <h4>Add Your Comment</h4>
                      <textarea
                        placeholder="Share your thoughts on this proposal..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="form-control form-textarea"
                      ></textarea>
                      
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleAddComment(selectedProposal.id)}
                        disabled={isSubmitting || !commentText.trim()}
                      >
                        {isSubmitting ? (
                          <span>
                            <i className="fas fa-spinner fa-spin"></i> Posting...
                          </span>
                        ) : (
                          'Post Comment'
                        )}
                      </button>
                      
                      {error && <p className="form-error">{error}</p>}
                    </div>
                    
                    <div className="comments-list">
                      <h4>Discussion ({selectedProposal.comments.length})</h4>
                      {selectedProposal.comments.length > 0 ? (
                        selectedProposal.comments.map(comment => (
                          <div key={comment.id} className="comment-card">
                            <div className="comment-header">
                              <span className="comment-author">{comment.author}</span>
                              <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                            <div className="comment-actions">
                              <button 
                                className="like-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  likeComment(selectedProposal.id, comment.id);
                                }}
                              >
                                <i className="fas fa-heart"></i>
                                <span>{comment.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <i className="fas fa-comments"></i>
                          <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'vote' && (
                  <div className="vote-tab">
                    <h4>Cast Your Vote</h4>
                    <p>Your vote helps determine which proposals move forward to implementation. Once you vote, it cannot be changed.</p>
                    
                    <div className="vote-stats">
                      <div className="vote-stat">
                        <div className="vote-number">{selectedProposal.votes.up}</div>
                        <div className="vote-label">In Favor</div>
                      </div>
                      <div className="vote-stat">
                        <div className="vote-number">{selectedProposal.votes.down}</div>
                        <div className="vote-label">Against</div>
                      </div>
                    </div>
                    
                    {userVotes[selectedProposal.id] ? (
                      <div className="vote-confirmation">
                        <i className="fas fa-check-circle"></i>
                        <p>You voted {userVotes[selectedProposal.id] === 'up' ? 'in favor of' : 'against'} this proposal</p>
                      </div>
                    ) : (
                      <div className="vote-buttons">
                        <button 
                          className="btn btn-success"
                          onClick={() => handleVote(selectedProposal.id, 'up')}
                          disabled={isSubmitting}
                        >
                          <i className="fas fa-thumbs-up"></i>
                          <span>Vote In Favor</span>
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleVote(selectedProposal.id, 'down')}
                          disabled={isSubmitting}
                        >
                          <i className="fas fa-thumbs-down"></i>
                          <span>Vote Against</span>
                        </button>
                      </div>
                    )}
                    
                    {error && <p className="form-error">{error}</p>}
                    
                    <div className="voting-info">
                      <h5>How Voting Works</h5>
                      <p>Proposals need a majority approval rating to move forward. Voting requires a connected wallet and uses gas-efficient voting mechanisms on the blockchain.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Proposal Form Modal */}
      {showNewProposalForm && (
        <div className={`modal-overlay ${showNewProposalForm ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create New Proposal</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowNewProposalForm(false);
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmitProposal}>
                <div className="form-group">
                  <label className="form-label">Proposal Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a clear, descriptive title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control form-select"
                    value={newProposal.category}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="Distribution">Distribution</option>
                    <option value="Production">Production</option>
                    <option value="Education">Education</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control form-textarea"
                    value={newProposal.description}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide a detailed description of your proposal, including goals and expected outcomes"
                    required
                    rows="5"
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Budget (USD)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newProposal.budget}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="Estimated budget"
                      required
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Timeline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProposal.timeline}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, timeline: e.target.value }))}
                      placeholder="e.g., 6 months, 1 year"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newProposal.deadline}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, deadline: e.target.value }))}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                {error && <p className="form-error">{error}</p>}
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowNewProposalForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>
                        <i className="fas fa-spinner fa-spin"></i> Submitting...
                      </span>
                    ) : (
                      'Submit Proposal'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      {
