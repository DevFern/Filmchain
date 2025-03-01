// src/components/ErrorBoundary.js
import React from 'react';

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
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You could send this error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but there was an error loading this section of the application.</p>
            
            <div className="error-actions">
              <button 
                className="btn-primary" 
                onClick={this.handleReload}
              >
                Reload Page
              </button>
              
              <button 
                className="btn-outline"
                onClick={() => this.setState({ hasError: false })}
              >
                Try Again
              </button>
            </div>
            
            <details className="error-details">
              <summary>Technical Details</summary>
              <p>{this.state.error && this.state.error.toString()}</p>
              <p className="error-stack">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </p>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
