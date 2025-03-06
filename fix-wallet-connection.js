// fix-wallet-connection.js
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function to fix wallet connection
function fixWalletConnection() {
  try {
    log('Starting wallet connection fix...');

    // Create directories if they don't exist
    const dirs = ['src/components', 'src/pages'];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`Created directory: ${dir}`);
      }
    }

    // Create a simplified MetaMaskConnector component
    log('Creating simplified MetaMaskConnector.js...');
    const metaMaskConnectorContent = `import React, { useState, useEffect } from 'react';
import './DesignFixes.css';

const MetaMaskConnector = ({ compact = false }) => {
  const [account, setAccount] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      console.log("Checking for MetaMask...");
      
      if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("MetaMask detected!");
        setIsMetaMaskInstalled(true);
        
        // Check if already connected
        window.ethereum.request({ method: 'eth_accounts' })
          .then(accounts => {
            if (accounts && accounts.length > 0) {
              console.log("Already connected to account:", accounts[0]);
              setAccount(accounts[0]);
            }
            setIsInitializing(false);
          })
          .catch(err => {
            console.error("Error checking accounts:", err);
            setIsInitializing(false);
          });
          
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            console.log("Account changed to:", accounts[0]);
            setAccount(accounts[0]);
          } else {
            console.log("Account disconnected");
            setAccount(null);
          }
        });
      } else {
        console.log("MetaMask not detected");
        setIsMetaMaskInstalled(false);
        setIsInitializing(false);
      }
    };
    
    // Small delay to ensure window.ethereum is available
    setTimeout(checkMetaMask, 1000);
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    setError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        console.log('Connected to account:', accounts[0]);
        setAccount(accounts[0]);
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
      setError(err.message || 'Failed to connect to MetaMask');
    }
  };

  // Disconnect from MetaMask
  const disconnectWallet = () => {
    setAccount(null);
  };

  // If still initializing, show loading state
  if (isInitializing) {
    return (
      <div className={compact ? "metamask-header-container" : "metamask-container"}>
        <div className="status-message">Checking wallet status...</div>
      </div>
    );
  }

  // If MetaMask is not installed
  if (!isMetaMaskInstalled) {
    return (
      <div className={compact ? "metamask-header-container" : "metamask-container"}>
        <div className="status-message">MetaMask is not installed</div>
        <a 
          href="https://metamask.io/download.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="metamask-button"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  // If connected to wallet
  if (account) {
    return (
      <div className={compact ? "metamask-header-container" : "metamask-container"}>
        {compact ? (
          <div className="wallet-address">
            {account.slice(0, 6)}...{account.slice(-4)}
            <button 
              onClick={disconnectWallet}
              className="disconnect-button"
              title="Disconnect wallet"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <>
            <div className="account-info">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            <button 
              onClick={disconnectWallet}
              className="disconnect-button"
            >
              Disconnect Wallet
            </button>
          </>
        )}
        
        {error && (
          <div className={compact ? "wallet-error-tooltip" : "error-message"}>
            {error}
          </div>
        )}
      </div>
    );
  }

  // Not connected yet
  return (
    <div className={compact ? "metamask-header-container" : "metamask-container"}>
      <button 
        onClick={connectWallet}
        className="connect-button"
      >
        Connect Wallet
      </button>
      
      {error && (
        <div className={compact ? "wallet-error-tooltip" : "error-message"}>
          {error}
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnector;`;

    fs.writeFileSync('src/components/MetaMaskConnector.js', metaMaskConnectorContent);
    log('Created MetaMaskConnector.js');

    // Create a simplified HomePage component
    log('Creating simplified HomePage.js...');
    const homePageContent = `import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import MetaMaskConnector from '../components/MetaMaskConnector';

const HomePage = () => {
  const { account } = useWallet();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <h1>Welcome to FilmChain</h1>
          <p>The decentralized platform for the film industry</p>
          
          <div className="wallet-section-large">
            <h3>Connect Your Wallet</h3>
            <p>Connect your MetaMask wallet to access all features</p>
            <MetaMaskConnector />
          </div>
          
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Box Office Analytics</h3>
              <p>Track film performance with blockchain-verified data</p>
            </div>
            <div className="feature-card">
              <h3>Community Governance</h3>
              <p>Vote on proposals and shape the future of film</p>
            </div>
            <div className="feature-card">
              <h3>Film Industry Jobs</h3>
              <p>Find work or talent in the decentralized film economy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;`;

    fs.writeFileSync('src/pages/HomePage.js', homePageContent);
    log('Created HomePage.js');

    // Create a simplified AboutPage component
    log('Creating simplified AboutPage.js...');
    const aboutPageContent = `import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1>About FilmChain</h1>
        <p>FilmChain is a decentralized platform for the film industry, connecting filmmakers, investors, and audiences through blockchain technology.</p>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>We're building a more transparent, accessible, and equitable film industry where creators can connect directly with their audience and investors.</p>
        </section>
        
        <section className="about-section">
          <h2>How It Works</h2>
          <p>FilmChain leverages blockchain technology to create verifiable records of film performance, transparent funding mechanisms, and decentralized governance for the community.</p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;`;

    fs.writeFileSync('src/pages/AboutPage.js', aboutPageContent);
    log('Created AboutPage.js');

    // Create CSS for the MetaMaskConnector
    log('Creating DesignFixes.css...');
    const designFixesCssContent = `/* MetaMask Connector Styles */
.metamask-container {
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  padding: 20px;
  margin: 20px 0;
  max-width: 500px;
  box-shadow: var(--shadow-sm);
}

.metamask-button, .connect-button, .disconnect-button {
  background-color: #f6851b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: none;
  display: inline-block;
}

.metamask-button:hover, .connect-button:hover {
  background-color: #e2761b;
}

.disconnect-button {
  background-color: #dc3545;
  font-size: 12px;
  padding: 5px 10px;
  margin-left: 10px;
}

.disconnect-button:hover {
  background-color: #c82333;
}

.status-message {
  margin: 10px 0;
  font-weight: bold;
}

.error-message {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.account-info {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

/* Header Layout Styles */
.metamask-header-container {
  display: flex;
  align-items: center;
}

.wallet-address {
  background-color: rgba(246, 133, 27, 0.1);
  color: #f6851b;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.wallet-error-tooltip {
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

/* Home page specific styles */
.wallet-section-large {
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  padding: 30px;
  margin: 30px 0;
  text-align: center;
}`;

    fs.writeFileSync('src/components/DesignFixes.css', designFixesCssContent);
    log('Created DesignFixes.css');

    // Create ErrorBoundary component
    log('Creating ErrorBoundary component...');
    const errorBoundaryContent = `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px 0', 
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderRadius: '8px',
          color: '#dc3545'
        }}>
          <h3>Something went wrong</h3>
          <p>This component failed to render properly.</p>
          {this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              <summary>Error details</summary>
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`;

    fs.writeFileSync('src/components/ErrorBoundary.js', errorBoundaryContent);
    log('Created ErrorBoundary.js');

    log('Wallet connection fix completed!');
    log('Try running "npm start" to test the application.');
  } catch (error) {
    log(`Error during wallet connection fix: ${error.message}`);
    process.exit(1);
  }
}

// Run the fix
fixWalletConnection();
