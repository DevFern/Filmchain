// src/pages/GovernancePage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommunityVoiceSection from '../components/CommunityVoiceSection';
import ErrorBoundary from '../components/ErrorBoundary';
import { useWallet } from '../contexts/WalletContext';
import './GovernancePage.css';

const GovernancePage = () => {
  const { account, connectWallet } = useWallet();
  const [activeTab, setActiveTab] = useState('proposals');

  // Mock data for proposals
  const proposals = [
    {
      id: 1,
      title: "Fund 'The Last Frontier' Sci-Fi Film",
      description: "Allocate 50,000 FILM tokens to support the production of 'The Last Frontier', a sci-fi film exploring the colonization of Mars.",
      proposer: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      status: "active",
      votesFor: 1250000,
      votesAgainst: 450000,
      startDate: "2023-09-15",
      endDate: "2023-09-30",
      quorum: 1000000
    },
    {
      id: 2,
      title: "Increase Creator Royalties to 5%",
      description: "Increase the default creator royalty percentage from 2.5% to 5% for all NFT sales on the marketplace.",
      proposer: "0x8912d35Cc6634C0532925a3b844Bc454e4438f123",
      status: "passed",
      votesFor: 2100000,
      votesAgainst: 350000,
      startDate: "2023-08-20",
      endDate: "2023-09-05",
      quorum: 1000000
    },
    {
      id: 3,
      title: "Add Documentary Film Category",
      description: "Create a dedicated category for documentary films with specialized funding parameters and distribution options.",
      proposer: "0x1242d35Cc6634C0532925a3b844Bc454e4438f987",
      status: "rejected",
      votesFor: 750000,
      votesAgainst: 1250000,
      startDate: "2023-08-01",
      endDate: "2023-08-15",
      quorum: 1000000
    }
  ];

  // Mock data for treasury
  const treasuryData = {
    balance: 5000000,
    allocations: [
      { category: "Film Funding", amount: 2500000, percentage: 50 },
      { category: "Platform Development", amount: 1000000, percentage: 20 },
      { category: "Marketing", amount: 750000, percentage: 15 },
      { category: "Community Rewards", amount: 500000, percentage: 10 },
      { category: "Operational Expenses", amount: 250000, percentage: 5 }
    ]
  };

  // Mock data for voting power
  const votingPowerData = {
    totalSupply: 10000000,
    circulatingSupply: 7500000,
    yourBalance: account ? 25000 : 0,
    yourVotingPower: account ? 0.33 : 0
  };

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'proposals':
        return (
          <div className="proposals-section">
            <div className="section-header-with-action">
              <h2>Active Proposals</h2>
              <button className="btn-primary">Create Proposal</button>
            </div>
            
            <div className="proposals-list">
              {proposals.map(proposal => {
                const totalVotes = proposal.votesFor + proposal.votesAgainst;
                const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
                
                return (
                  <div key={proposal.id} className="proposal-card">
                    <div className="proposal-header">
                      <h3>{proposal.title}</h3>
                      <span className={`status-badge ${proposal.status}`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="proposal-description">{proposal.description}</p>
                    
                    <div className="proposal-stats">
                      <div className="stat-item">
                        <span className="stat-label">Proposer:</span>
                        <span className="stat-value">{`${proposal.proposer.slice(0, 6)}...${proposal.proposer.slice(-4)}`}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">End Date:</span>
                        <span className="stat-value">{proposal.endDate}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Quorum:</span>
                        <span className="stat-value">{(proposal.quorum / 1000000).toFixed(1)}M FILM</span>
                      </div>
                    </div>
                    
                    <div className="voting-progress">
                      <div className="progress-label">
                        <span>For: {(proposal.votesFor / 1000000).toFixed(1)}M FILM ({forPercentage.toFixed(1)}%)</span>
                        <span>Against: {(proposal.votesAgainst / 1000000).toFixed(1)}M FILM ({(100 - forPercentage).toFixed(1)}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-for" style={{ width: `${forPercentage}%` }}></div>
                      </div>
                    </div>
                    
                    {proposal.status === 'active' && account && (
                      <div className="voting-actions">
                        <button className="vote-btn vote-for">Vote For</button>
                        <button className="vote-btn vote-against">Vote Against</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'treasury':
        return (
          <div className="treasury-section">
            <h2>Treasury</h2>
            
            <div className="treasury-balance">
              <div className="balance-card">
                <h3>Total Treasury Balance</h3>
                <div className="balance-amount">{(treasuryData.balance / 1000000).toFixed(1)}M FILM</div>
              </div>
            </div>
            
            <h3>Fund Allocations</h3>
            <div className="allocations-chart">
              {treasuryData.allocations.map((allocation, index) => (
                <div key={index} className="allocation-item">
                  <div className="allocation-info">
                    <span className="allocation-category">{allocation.category}</span>
                    <span className="allocation-amount">{(allocation.amount / 1000000).toFixed(1)}M FILM</span>
                  </div>
                  <div className="allocation-bar">
                    <div 
                      className="allocation-fill" 
                      style={{ 
                        width: `${allocation.percentage}%`,
                        backgroundColor: getColorForCategory(allocation.category)
                      }}
                    ></div>
                  </div>
                  <div className="allocation-percentage">{allocation.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'voting-power':
        return (
          <div className="voting-power-section">
            <h2>Your Voting Power</h2>
            
            {account ? (
              <div className="voting-power-info">
                <div className="info-card">
                  <h3>Your FILM Balance</h3>
                  <div className="info-value">{votingPowerData.yourBalance.toLocaleString()} FILM</div>
                </div>
                <div className="info-card">
                  <h3>Your Voting Power</h3>
                  <div className="info-value">{votingPowerData.yourVotingPower}%</div>
                </div>
                <div className="info-card">
                  <h3>Total Supply</h3>
                  <div className="info-value">{(votingPowerData.totalSupply / 1000000).toFixed(1)}M FILM</div>
                </div>
                <div className="info-card">
                  <h3>Circulating Supply</h3>
                  <div className="info-value">{(votingPowerData.circulatingSupply / 1000000).toFixed(1)}M FILM</div>
                </div>
              </div>
            ) : (
              <div className="connect-wallet-message">
                <p>Connect your wallet to view your voting power</p>
                <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
              </div>
            )}
          </div>
        );
        
      case 'community-voice':
        return (
          <ErrorBoundary>
            <CommunityVoiceSection />
          </ErrorBoundary>
        );
        
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  // Helper function to get color for allocation category
  const getColorForCategory = (category) => {
    const colors = {
      "Film Funding": "#f6851b",
      "Platform Development": "#1976d2",
      "Marketing": "#9c27b0",
      "Community Rewards": "#4caf50",
      "Operational Expenses": "#ff9800"
    };
    
    return colors[category] || "#f6851b";
  };

  return (
    <div className="governance-page">
      <section className="page-header">
        <div className="container">
          <h1>Governance</h1>
          <p className="page-subtitle">
            Participate in platform governance and help shape the future of FilmChain
          </p>
        </div>
      </section>

      <div className="container">
        <div className="governance-tabs">
          <button 
            className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            Proposals
          </button>
          <button 
            className={`tab-btn ${activeTab === 'treasury' ? 'active' : ''}`}
            onClick={() => setActiveTab('treasury')}
          >
            Treasury
          </button>
          <button 
            className={`tab-btn ${activeTab === 'voting-power' ? 'active' : ''}`}
            onClick={() => setActiveTab('voting-power')}
          >
            Voting Power
          </button>
          <button 
            className={`tab-btn ${activeTab === 'community-voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('community-voice')}
          >
            Community Voice
          </button>
        </div>
        
        {!account && activeTab !== 'community-voice' && (
          <div className="connect-wallet-message">
            <p>Connect your wallet to participate in governance</p>
            <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
          </div>
        )}
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GovernancePage;
