import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import './CommunityVoice.css';

const CommunityVoiceSection = () => {
  const { account, filmBalance = 1000, error: walletError } = useWallet();
  
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Establish a Film Preservation Fund",
      category: "Funding",
      author: "Alex Johnson",
      description: "Create a dedicated fund to restore and preserve classic independent films, ensuring they remain accessible for future generations.",
      upvotes: 156,
      downvotes: 23,
      comments: 42,
      deadline: "2024-05-15",
      status: "Active",
      createdAt: "2024-03-01"
    },
    {
      id: 2,
      title: "Implement Quarterly Community Grants",
      category: "Policy",
      author: "Maria Rodriguez",
      description: "Establish a quarterly grant program where community members can vote on which emerging filmmakers receive funding for their projects.",
      upvotes: 203,
      downvotes: 18,
      comments: 57,
      deadline: "2024-04-30",
      status: "Active",
      createdAt: "2024-02-15"
    },
    {
      id: 3,
      title: "Create a Mentorship Program",
      category: "Education",
      author: "David Kim",
      description: "Develop a structured mentorship program connecting established industry professionals with emerging talent in the FilmChain community.",
      upvotes: 178,
      downvotes: 12,
      comments: 35,
      deadline: "2024-06-01",
      status: "Active",
      createdAt: "2024-03-10"
    }
  ]);

  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showNewProposalForm, setShowNewProposalForm] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [commentText, setCommentText] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    sortBy: 'newest'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter proposals based on current filters and search term
  const filteredProposals = proposals.filter(proposal => {
    // Apply category filter
    if (filters.category !== 'all' && proposal.category !== filters.category) return false;
    
    // Apply status filter
    if (filters.status !== 'all' && proposal.status !== filters.status) return false;
    
    // Apply search term
    if (searchTerm && !proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !proposal.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'mostVotes':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'mostComments':
        return b.comments - a.comments;
      default:
        return 0;
    }
  });

  const handleVote = (proposalId, voteType) => {
    if (!account) {
      alert("Please connect your wallet to vote");
      return;
    }
    
    // Check if user has already voted
    const currentVote = userVotes[proposalId];
    
    // Update user votes
    if (currentVote === voteType) {
      // User is removing their vote
      const newUserVotes = { ...userVotes };
      delete newUserVotes[proposalId];
      setUserVotes(newUserVotes);
      
      // Update proposal votes
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            [voteType === 'upvote' ? 'upvotes' : 'downvotes']: proposal[voteType === 'upvote' ? 'upvotes' : 'downvotes'] - 1
          };
        }
        return proposal;
      }));
    } else {
      // User is changing their vote or voting for the first time
      setUserVotes(prev => ({
        ...prev,
        [proposalId]: voteType
      }));
      
      // Update proposal votes
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          let updatedProposal = { ...proposal };
          
          // If changing vote, decrement the previous vote type
          if (currentVote) {
            updatedProposal[currentVote === 'upvote' ? 'upvotes' : 'downvotes'] -= 1;
          }
          
          // Increment the new vote type
          updatedProposal[voteType === 'upvote' ? 'upvotes' : 'downvotes'] += 1;
          
          return updatedProposal;
        }
        return proposal;
      }));
    }
  };

  return (
    <div className="community-voice-container">
      {/* Section Header with Description - Separated from listings */}
      <div className="section-header">
        <h2 className="section-title">Community Voice</h2>
        <p className="section-subtitle">
          Propose and vote on initiatives to shape the future of FilmChain
        </p>
      </div>
      
      {/* Enhanced Filters Section */}
      <div className="filters-section">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="all">All Categories</option>
          <option value="Funding">Funding</option>
          <option value="Policy">Policy</option>
          <option value="Education">Education</option>
          <option value="Technology">Technology</option>
        </select>
        
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Implemented">Implemented</option>
        </select>
        
        <select
          className="filter-select"
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="mostVotes">Most Votes</option>
          <option value="mostComments">Most Comments</option>
        </select>
      </div>
      
      {/* Create New Proposal Button */}
      <div className="new-proposal-container">
        <button
          className="new-proposal-btn"
          onClick={() => setShowNewProposalForm(true)}
        >
          <i className="fas fa-plus"></i> Create New Proposal
        </button>
      </div>
      
      {/* Proposals Grid */}
      <div className="proposals-grid">
        {filteredProposals.length > 0 ? (
          filteredProposals.map(proposal => {
            const approvalPercentage = Math.round((proposal.upvotes / (proposal.upvotes + proposal.downvotes)) * 100) || 0;
            
            return (
              <div
                key={proposal.id}
                className="proposal-card"
                onClick={() => {
                  setSelectedProposal(proposal);
                  setShowProposalModal(true);
                }}
              >
                <div className="proposal-header">
                  <h3 className="proposal-title">{proposal.title}</h3>
                  <span className="category-tag">{proposal.category}</span>
                </div>
                
                <p className="proposal-author">Proposed by: {proposal.author}</p>
                
                <p className="proposal-description">{proposal.description}</p>
                
                <div className="proposal-stats">
                  <div className="vote-stats">
                    <div className="approval-bar-container">
                      <div
                        className="approval-bar"
                        style={{ width: `${approvalPercentage}%` }}
                      ></div>
                    </div>
                    <div className="approval-percentage">
                      <span>{approvalPercentage}% Approval</span>
                      <span>{proposal.upvotes + proposal.downvotes} votes</span>
                    </div>
                  </div>
                  
                  <div className="comment-count">
                    <i className="far fa-comment"></i>
                    <span>{proposal.comments} comments</span>
                  </div>
                </div>
                
                <div className="proposal-footer">
                  <span className="deadline">Deadline: {proposal.deadline}</span>
                  <span className="status-badge">{proposal.status}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No proposals match your current filters. Try adjusting your search criteria or create a new proposal.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityVoiceSection;
