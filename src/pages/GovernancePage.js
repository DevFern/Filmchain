// src/pages/GovernancePage.js
import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import ErrorBoundary from '../components/ErrorBoundary';
import './GovernancePage.css';

const GovernancePage = () => {
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState('proposals');
  
  // Sample data for governance page
  const proposals = [
    {
      id: 1,
      title: "Increase funding allocation for documentary films",
      description: "This proposal aims to increase the percentage of platform funds allocated to documentary film projects from 15% to 25%.",
      proposer: "0x1234...5678",
      status: "Active",
      votesFor: 1250000,
      votesAgainst: 450000,
      deadline: "2024-04-15",
      created: "2024-03-01"
    },
    {
      id: 2,
      title: "Add support for international film festivals",
      description: "Allocate 10% of the community fund to sponsor independent films at major international film festivals.",
      proposer: "0x8765...4321",
      status: "Active",
      votesFor: 980000,
      votesAgainst: 320000,
      deadline: "2024-04-20",
      created: "2024-03-05"
    },
    {
      id: 3,
      title: "Implement revenue sharing for platform contributors",
      description: "Create a mechanism to share 5% of platform revenue with active contributors based on their participation metrics.",
      proposer: "0x2468...1357",
      status: "Passed",
      votesFor: 1750000,
      votesAgainst: 250000,
      deadline: "2024-02-28",
      created: "2024-02-01"
    }
  ];
  
  const treasury = {
    totalBalance: 5000000,
    allocations: [
      { category: "Film Projects", amount: 2500000, percentage: 50 },
      { category: "Platform Development", amount: 1000000, percentage: 20 },
      { category: "Marketing", amount: 750000, percentage: 15 },
      { category: "Community Rewards", amount: 500000, percentage: 10 },
      { category: "Emergency Reserve", amount: 250000, percentage: 5 }
    ]
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
            className={`tab-btn ${activeTab === 'voting' ? 'active' : ''}`}
            onClick={() => setActiveTab('voting')}
          >
            My Voting Power
          </button>
        </div>

        {activeTab === 'proposals' && (
          <div className="proposals-section">
            <div className="section-header-with-action">
              <h2>Active Proposals</h2>
              <button className="btn-primary">Create Proposal</button>
            </div>
            
            <div className="proposals-list">
              {proposals.map(proposal => (
                <div key={proposal.id} className="proposal-card">
                  <div className="proposal-header">
                    <h3>{proposal.title}</h3>
                    <span className={`status-badge ${proposal.status.toLowerCase()}`}>
                      {proposal.status}
                    </span>
                  </div>
                  
                  <p className="proposal-description">{proposal.description}</p>
                  
                  <div className="proposal-stats">
                    <div className="stat-item">
                      <span className="stat-label">Proposer:</span>
                      <span className="stat-value">{proposal.proposer}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Created:</span>
                      <span className="stat-value">{proposal.created}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Deadline:</span>
                      <span className="stat-value">{proposal.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="voting-progress">
                    <div className="progress-label">
                      <span>For: {proposal.votesFor.toLocaleString()} FILM</span>
                      <span>Against: {proposal.votesAgainst.toLocaleString()} FILM</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-for"
                        style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {proposal.status === 'Active' && (
                    <div className="voting-actions">
                      <button className="vote-btn vote-for">Vote For</button>
                      <button className="vote-btn vote-against">Vote Against</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'treasury' && (
          <div className="treasury-section">
            <h2>Treasury Overview</h2>
            
            <div className="treasury-balance">
              <div className="balance-card">
                <h3>Total Balance</h3>
                <div className="balance-amount">{treasury.totalBalance.toLocaleString()} FILM</div>
              </div>
            </div>
            
            <h3>Allocations</h3>
            <div className="allocations-chart">
              {treasury.allocations.map((allocation, index) => (
                <div key={index} className="allocation-item">
                  <div className="allocation-info">
                    <span className="allocation-category">{allocation.category}</span>
                    <span className="allocation-amount">{allocation.amount.toLocaleString()} FILM</span>
                  </div>
                  <div className="allocation-bar">
                    <div 
                      className="allocation-fill"
                      style={{ 
                        width: `${allocation.percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                      }}
                    ></div>
                  </div>
                  <div className="allocation-percentage">{allocation.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'voting' && (
          <div className="voting-power-section">
            <h2>My Voting Power</h2>
            
            {account ? (
              <div className="voting-power-info">
                <div className="info-card">
                  <h3>FILM Balance</h3>
                  <div className="info-value">1,250 FILM</div>
                </div>
                
                <div className="info-card">
                  <h3>Voting Power</h3>
                  <div className="info-value">1,250 Votes</div>
                </div>
                
                <div className="info-card">
                  <h3>Proposals Voted</h3>
                  <div className="info-value">7</div>
                </div>
                
                <div className="info-card">
                  <h3>Proposals Created</h3>
                  <div className="info-value">1</div>
                </div>
              </div>
            ) : (
              <div className="connect-wallet-message">
                <p>Connect your wallet to view your voting power and participation history.</p>
                <ErrorBoundary>
                  <MetaMaskConnector />
                </ErrorBoundary>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernancePage;
