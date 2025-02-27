import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const HyreBlockSection = () => {
  const { account, error: walletError } = useWallet();
  
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    location: 'all',
    jobType: 'all',
    experience: 'all',
    department: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationFiles, setApplicationFiles] = useState({
    resume: null,
    portfolio: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Sample job data
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior VFX Artist",
      company: "Dreamscape Studios",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      experience: "5+ years",
      department: "Visual Effects",
      description: "Looking for a senior VFX artist to join our award-winning team...",
      requirements: [
        "Proficiency in Maya, Houdini, and Nuke",
        "Experience with particle systems and fluid simulations",
        "Strong understanding of compositing workflows",
        "Portfolio demonstrating high-end VFX work"
      ],
      benefits: [
        "Health, dental, and vision insurance",
        "401(k) matching",
        "Flexible work hours",
        "Remote work options"
      ],
      posted: "2024-03-15",
      deadline: "2024-04-15"
    },
    {
      id: 2,
      title: "Production Coordinator",
      company: "FilmCraft Productions",
      location: "New York, NY",
      type: "Contract",
      salary: "$45,000 - $60,000",
      experience: "2-3 years",
      department: "Production",
      description: "Seeking an experienced production coordinator for upcoming feature film...",
      requirements: [
        "Previous experience in film production",
        "Strong organizational skills",
        "Proficiency in production management software",
        "Excellent communication skills"
      ],
      benefits: [
        "Project completion bonus",
        "Credits on major productions",
        "Networking opportunities",
        "Professional development"
      ],
      posted: "2024-03-10",
      deadline: "2024-04-10"
    }
  ]);

  // Sample talent pool data
  const [talents, setTalents] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      title: "VFX Supervisor",
      experience: "8 years",
      location: "Vancouver, BC",
      skills: ["Houdini", "Maya", "Nuke", "Team Leadership"],
      portfolio: "https://portfolio.sarahchen.com",
      availability: "Available from June 2024",
      bio: "Award-winning VFX supervisor with experience on major blockbuster films..."
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "Production Manager",
      experience: "6 years",
      location: "Atlanta, GA",
      skills: ["Budget Management", "Scheduling", "Team Coordination", "Risk Management"],
      portfolio: "https://linkedin.com/marcusrodriguez",
      availability: "Immediate",
      bio: "Experienced production manager specialized in large-scale productions..."
    }
  ]);

  // In a real app, you would fetch jobs and talents from the blockchain
  useEffect(() => {
    // Simulating loading data from blockchain
    // This would be replaced with actual contract calls
  }, [account]);

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setApplicationFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleApplicationSubmit = (jobId) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!applicationFiles.resume) {
      setError("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you would upload files to IPFS and call the smart contract
      // For now, we'll just simulate a successful application
      
      const newApplication = {
        id: Date.now(),
        jobId,
        status: 'Pending Review',
        submittedAt: new Date().toISOString(),
        ...applicationFiles
      };

      setApplications(prev => [...prev, newApplication]);
      setApplicationFiles({ resume: null, portfolio: null });
      
      // Close form after successful submission
      setTimeout(() => {
        setShowApplicationForm(false);
        setIsSubmitting(false);
      }, 1500);
      
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const JobCard = ({ job }) => {
    const isSaved = savedJobs.includes(job.id);
    
    return (
      <div className="job-card">
        <div className="job-card-header">
          <div className="job-title-section">
            <h3>{job.title}</h3>
            <span className="company-name">{job.company}</span>
          </div>
          <button 
            className={`save-job-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
          >
            <i className={`fas ${isSaved ? 'fa-heart' : 'fa-heart-o'}`}></i>
          </button>
        </div>

        <div className="job-details">
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{job.location}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-briefcase"></i>
            <span>{job.type}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-dollar-sign"></i>
            <span>{job.salary}</span>
          </div>
        </div>

        <div className="job-actions">
          <button 
            className="view-details-btn"
            onClick={() => setSelectedJob(job)}
          >
            View Details
          </button>
          <button 
            className="apply-now-btn"
            onClick={() => {
              setSelectedJob(job);
              setShowApplicationForm(true);
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    );
  };

  const TalentCard = ({ talent }) => {
    return (
      <div className="talent-card">
        <div className="talent-header">
          <h3>{talent.name}</h3>
          <span className="talent-title">{talent.title}</span>
        </div>

        <div className="talent-details">
          <div className="detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{talent.location}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-clock"></i>
            <span>{talent.experience}</span>
          </div>
        </div>

        <div className="talent-skills">
          {talent.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>

        <div className="talent-availability">
          <i className="fas fa-calendar-check"></i>
          <span>{talent.availability}</span>
        </div>

        <div className="talent-actions">
          <a href={talent.portfolio} target="_blank" rel="noopener noreferrer" className="portfolio-btn">
            View Portfolio
          </a>
          <button className="contact-btn">Contact</button>
        </div>
      </div>
    );
  };

  const ApplicationForm = ({ job }) => {
    return (
      <div className="application-form">
        <h3>Apply for {job.title}</h3>
        <div className="form-group">
          <label>Resume/CV</label>
          <div className="file-upload">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e, 'resume')}
            />
            <i className="fas fa-cloud-upload-alt"></i>
            <span>{applicationFiles.resume ? applicationFiles.resume.name : 'Upload Resume'}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Portfolio/Reel (Optional)</label>
          <div className="file-upload">
            <input
              type="file"
              accept=".pdf,.mp4,.zip"
              onChange={(e) => handleFileUpload(e, 'portfolio')}
            />
            <i className="fas fa-cloud-upload-alt"></i>
            <span>{applicationFiles.portfolio ? applicationFiles.portfolio.name : 'Upload Portfolio'}</span>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button 
            className="cancel-btn"
            onClick={() => setShowApplicationForm(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="submit-btn"
            onClick={() => handleApplicationSubmit(job.id)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="hyreblock-container">
      <div className="section-header">
        <h2>HyreBlock</h2>
        <p>Connect with film industry professionals and find your next opportunity</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          Featured Jobs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'talent' ? 'active' : ''}`}
          onClick={() => setActiveTab('talent')}
        >
          Talent Pool
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          My Applications
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filters.location}
          onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
          className="filter-select"
        >
          <option value="all">All Locations</option>
          <option value="los-angeles">Los Angeles</option>
          <option value="new-york">New York</option>
          <option value="vancouver">Vancouver</option>
        </select>
        <select 
          value={filters.jobType}
          onChange={(e) => setFilters(prev => ({...prev, jobType: e.target.value}))}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>

      <div className="content-section">
        {activeTab === 'featured' && (
          <div className="jobs-grid">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {activeTab === 'talent' && (
          <div className="talent-grid">
            {talents.map(talent => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="applications-list">
            {applications.length > 0 ? (
              applications.map(application => (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <h3>{jobs.find(job => job.id === application.jobId)?.title}</h3>
                    <span className={`status ${application.status.toLowerCase().replace(' ', '-')}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="application-details">
                    <span>Submitted: {new Date(application.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>You haven't submitted any applications yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            {showApplicationForm ? (
              <ApplicationForm job={selectedJob} />
            ) : (
              <div className="job-details-modal">
                <button 
                  className="close-btn"
                  onClick={() => setSelectedJob(null)}
                >
                  ×
                </button>
                <h2>{selectedJob.title}</h2>
                <div className="company-info">
                  <span>{selectedJob.company}</span>
                  <span>•</span>
                  <span>{selectedJob.location}</span>
                </div>
                <div className="job-description">
                  <p>{selectedJob.description}</p>
                </div>
                <div className="requirements-section">
                  <h3>Requirements</h3>
                  <ul>
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="benefits-section">
                  <h3>Benefits</h3>
                  <ul>
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <div className="modal-actions">
                  <button 
                    className="apply-btn"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {walletError && <p className="error-message">{walletError}</p>}
    </div>
  );
};

export default HyreBlockSection;
