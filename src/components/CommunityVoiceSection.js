import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const CommunityVoiceSection = () => {
  const { account, filmBalance, error: walletError } = useWallet();
  
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Sustainable Film Production Initiative",
      author: "EcoFilm Collective",
      description: "Implementing green practices in film production to reduce environmental impact.",
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
          text: "We've successfully implemented similar practices in our last production, reducing waste by 60%.",
          timestamp: "2024-03-15T10:30:00",
          likes: 45
        },
        {
          id: 2,
          author: "ProductionPro",
          text: "Would love to see specific guidelines for different department heads.",
          timestamp: "2024-03-16T15:20:00",
          likes: 28
        }
      ],
      milestones: [
        { title: "Proposal Submission", completed: true },
        { title: "Community Review", completed: true },
        { title: "Implementation Plan", completed: false },
        { title: "Pilot Program", completed: false }
      ]
    },
    {
      id: 2,
      title: "Emerging Filmmakers Mentorship Program",
      author: "Film Education Alliance",
      description: "Connecting experienced filmmakers with emerging talent for year-long mentorship.",
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
          text: "This could revolutionize how we nurture new talent in the industry.",
          timestamp: "2024-03-14T09:15:00",
          likes: 67
        }
      ],
      milestones: [
        { title: "Program Structure", completed: true },
        { title: "Mentor Recruitment", completed: false },
        { title: "Participant Selection", completed: false },
        { title: "Program Launch", completed: false }
      ]
    },
    {
      id: 3,
      title: "Blockchain Distribution Platform for Independent Films",
      author: "Indie Chain Collective",
      description: "Creating a decentralized platform for independent filmmakers to distribute their work directly to audiences.",
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
          text: "This is exactly what the indie film community needs to break free from traditional gatekeepers.",
          timestamp: "2024-03-12T14:45:00",
          likes: 53
        }
      ],
      milestones: [
        { title: "Platform Design", completed: true },
        { title: "Smart Contract Development", completed: false },
        { title: "Beta Testing", completed: false },
        { title: "Public Launch", completed: false }
      ]
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
    deadline: ''
  });

  const categories = [
    { id: 'all', name: 'All Proposals' },
    { id: 'Distribution', name: 'Distribution' },
    { id: 'Production', name: 'Production' },
    { id: 'Education', name: 'Education' },
    { id: 'Sustainability', name: 'Sustainability' },
    { id: 'Technology', name: 'Technology' }
  ];

  // In a real app, you would fetch proposals from the blockchain
  useEffect(() => {
    // Simulating loading proposals from blockchain
    // This would be replaced with actual contract calls
  }, [account]);

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
    if (!newProposal.title || !newProposal.description || !newProposal.deadline) {
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
          { title: "Proposal Submission", completed: true },
          { title: "Community Review", completed: false },
          { title: "Implementation Plan", completed: false },
          { title: "Execution", completed: false }
        ]
      };

      setProposals(prev => [...prev, proposalToAdd]);
      
      // Record creator's vote
      setUserVotes(prev => ({ ...prev, [proposalToAdd.id]: 'up' }));
      
      // Reset form
      setNewProposal({
        title: '',
        description: '',
        category: 'Distribution',
        deadline: ''
      });
      
      // Close form after successful submission
      setTimeout(() => {
        setShowNewProposalForm(false);
        setIsSubmitting(false);
      }, 1500);
      
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

  const ProposalCard = ({ proposal }) => {
    const totalVotes = proposal.votes.up + proposal.votes.down;
    const approvalPercentage = totalVotes > 0 
      ? Math.round((proposal.votes.up / totalVotes) * 100) 
      : 0;
    
    const userVote = userVotes[proposal.id];
    
    return (
      <div 
        className="proposal-card"
        onClick={() => {
          setSelectedProposal(proposal);
          setShowProposalModal(true);
        }}
      >
        <div className="proposal-header">
          <h3>{proposal.title}</h3>
          <span className="category-tag">{proposal.category}</span>
        </div>
        
        <p className="proposal-author">Proposed by {proposal.author}</p>
        
        <p className="proposal-description">{proposal.description.substring(0, 150)}...</p>
        
        <div className="proposal-stats">
          <div className="vote-stats">
            <div className="approval-bar-container">
              <div 
                className="approval-bar"
                style={{ width: `${approvalPercentage}%` }}
              ></div>
            </div>
            <span className="approval-percentage">{approvalPercentage}% Approval</span>
          </div>
          
          <div className="comment-count">
            <i className="fas fa-comment"></i>
            <span>{proposal.comments.length}</span>
          </div>
        </div>
        
        <div className="proposal-footer">
          <span className="deadline">Deadline: {formatDate(proposal.deadline)}</span>
          <span className="status-badge">{proposal.status}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="community-voice-container">
      <div className="section-header">
        <h2>Community Voice</h2>
        <p>Propose and vote on initiatives to shape the future of FilmChain</p>
        <button 
          className="new-proposal-btn"
          onClick={() => setShowNewProposalForm(true)}
        >
          Create New Proposal
        </button>
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="proposals-grid">
        {proposals
          .filter(proposal => activeCategory === 'all' || proposal.category === activeCategory)
          .map(proposal => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
      </div>

      {/* Proposal Details Modal */}
      {showProposalModal && selectedProposal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={() => {
                setShowProposalModal(false);
                setSelectedProposal(null);
                setCommentText('');
                setError(null);
              }}
            >
              ×
            </button>
            
            <div className="proposal-details">
              <div className="proposal-header">
                <h2>{selectedProposal.title}</h2>
                <span className="category-tag">{selectedProposal.category}</span>
              </div>
              
              <p className="proposal-author">Proposed by {selectedProposal.author}</p>
              <p className="proposal-deadline">Deadline: {formatDate(selectedProposal.deadline)}</p>
              
              <div className="proposal-description">
                <p>{selectedProposal.description}</p>
              </div>
              
              <div className="voting-section">
                <h3>Cast Your Vote</h3>
                <div className="vote-buttons">
                  <button 
                    className={`vote-btn upvote ${userVotes[selectedProposal.id] === 'up' ? 'voted' : ''}`}
                    onClick={() => handleVote(selectedProposal.id, 'up')}
                    disabled={isSubmitting || userVotes[selectedProposal.id]}
                  >
                    <i className="fas fa-thumbs-up"></i>
                    <span>{selectedProposal.votes.up}</span>
                  </button>
                  <button 
                    className={`vote-btn downvote ${userVotes[selectedProposal.id] === 'down' ? 'voted' : ''}`}
                    onClick={() => handleVote(selectedProposal.id, 'down')}
                    disabled={isSubmitting || userVotes[selectedProposal.id]}
                  >
                    <i className="fas fa-thumbs-down"></i>
                    <span>{selectedProposal.votes.down}</span>
                  </button>
                </div>
                {userVotes[selectedProposal.id] && (
                  <p className="vote-confirmation">
                    You voted {userVotes[selectedProposal.id] === 'up' ? 'in favor of' : 'against'} this proposal
                  </p>
                )}
              </div>
              
              <div className="milestones-section">
                <h3>Proposal Milestones</h3>
                <div className="milestones-list">
                  {selectedProposal.milestones.map((milestone, index) => (
                    <div key={index} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
                      <div className="milestone-indicator"></div>
                      <span>{milestone.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="comments-section">
                <h3>Discussion ({selectedProposal.comments.length})</h3>
                
                <div className="comment-form">
                  <textarea
                    placeholder="Add your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <button 
                    className="submit-comment-btn"
                    onClick={() => handleAddComment(selectedProposal.id)}
                    disabled={isSubmitting || !commentText.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <div className="comments-list">
                  {selectedProposal.comments.map(comment => (
                    <div key={comment.id} className="comment-card">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      <div className="comment-actions">
                        <button className="like-btn">
                          <i className="fas fa-heart"></i>
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Proposal Form Modal */}
      {showNewProposalForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={() => {
                setShowNewProposalForm(false);
                setError(null);
              }}
            >
              ×
            </button>
            
            <div className="new-proposal-form">
              <h2>Create New Proposal</h2>
              
              <form onSubmit={handleSubmitProposal}>
                <div className="form-group">
                  <label>Proposal Title</label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
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
                  <label>Description</label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows="5"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={newProposal.deadline}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, deadline: e.target.value }))}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowNewProposalForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      )}
      
      {walletError && <p className="error-message">{walletError}</p>}
    </div>
  );
};

export default CommunityVoiceSection;
