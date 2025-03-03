import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
import './HyreBlock.css';

const HyreBlockSection = () => {
  const { account, error: walletError } = useWallet();
  
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [filters, setFilters] = useState({
    location: 'all',
    jobType: 'all',
    experience: 'all',
    department: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState([1]);
  const [savedTalents, setSavedTalents] = useState([2]);
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showTalentModal, setShowTalentModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Sample job data
  const jobs = [
    {
      id: 1,
      title: "Senior VFX Artist",
      company: "Dreamscape Studios",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      experience: "5+ years",
      department: "Visual Effects",
      logo: "https://placehold.co/100x100/6a1b9a/ffff?text=DS",
      description: "Looking for a senior VFX artist to join our award-winning team working on high-profile feature films and streaming content.",
      skills: ["Maya", "Houdini", "Nuke", "Particle FX", "Compositing"],
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
      logo: "https://placehold.co/100x100/9c27b0/ffff?text=FC",
      description: "Seeking an experienced production coordinator for upcoming feature film to manage day-to-day operations.",
      skills: ["Scheduling", "Budgeting", "Communication", "MS Office", "Production Software"],
      posted: "2024-03-10",
      deadline: "2024-04-10"
    },
    {
      id: 3,
      title: "Cinematographer",
      company: "Visionary Films",
      location: "Atlanta, GA",
      type: "Freelance",
      salary: "$500 - $800/day",
      experience: "5+ years",
      department: "Camera",
      logo: "https://placehold.co/100x100/e91e63/ffff?text=VF",
      description: "Talented cinematographer needed for indie feature film shooting in Atlanta this summer.",
      skills: ["Lighting", "Composition", "Arri Alexa", "RED", "Color Theory"],
      posted: "2024-03-05",
      deadline: "2024-04-05"
    }
  ];

  // Sample talent data
  const talents = [
    {
      id: 1,
      name: "Alex Johnson",
      title: "VFX Supervisor",
      experience: "10+ years",
      location: "Los Angeles, CA",
      skills: ["3D Modeling", "Animation", "Compositing", "Team Leadership"],
      portfolio: "#",
      availability: "Available from June 2024",
      bio: "Award-winning VFX supervisor with experience on major studio films and streaming series.",
      image: "https://placehold.co/100x100/6a1b9a/ffff?text=AJ",
      verified: true
    },
    {
      id: 2,
      name: "Sarah Williams",
      title: "Production Manager",
      experience: "7 years",
      location: "New York, NY",
      skills: ["Scheduling", "Budgeting", "Team Management", "Problem Solving"],
      portfolio: "#",
      availability: "Available now",
      bio: "Experienced production manager with a track record of delivering projects on time and under budget.",
      image: "https://placehold.co/100x100/9c27b0/ffff?text=SW",
      verified: true
    },
    {
      id: 3,
      name: "Elena Petrov",
      title: "Cinematographer",
      experience: "8 years",
      location: "Atlanta, GA",
      skills: ["Lighting Design", "Camera Operation", "Visual Storytelling", "Color Theory"],
      portfolio: "#",
      availability: "Available from May 2024",
      bio: "Award-winning cinematographer known for distinctive visual style and innovative lighting techniques.",
      image: "https://placehold.co/100x100/e91e63/ffff?text=EP",
      verified: false
    }
  ];

  // Filter jobs based on current filters and search term
  const filteredJobs = jobs.filter(job => {
    // Apply location filter
    if (filters.location !== 'all' && job.location !== filters.location) return false;
    
    // Apply job type filter
    if (filters.jobType !== 'all' && job.type !== filters.jobType) return false;
    
    // Apply experience filter
    if (filters.experience !== 'all' && job.experience !== filters.experience) return false;
    
    // Apply department filter
    if (filters.department !== 'all' && job.department !== filters.department) return false;
    
    // Apply search term
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !job.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !job.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Filter talents based on current filters and search term
  const filteredTalents = talents.filter(talent => {
    // Apply location filter
    if (filters.location !== 'all' && talent.location !== filters.location) return false;
    
    // Apply experience filter
    if (filters.experience !== 'all' && talent.experience !== filters.experience) return false;
    
    // Apply search term
    if (searchTerm && !talent.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !talent.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !talent.bio.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const toggleSaveJob = (jobId, e) => {
    e.stopPropagation();
    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );

    // Show notification
    setNotificationMessage(
      savedJobs.includes(jobId)
        ? "Job removed from saved items"
        : "Job saved successfully"
    );
    setNotificationType(savedJobs.includes(jobId) ? "error" : "success");
    setShowNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const toggleSaveTalent = (talentId, e) => {
    e.stopPropagation();
    setSavedTalents(prev =>
      prev.includes(talentId)
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    );

    // Show notification
    setNotificationMessage(
      savedTalents.includes(talentId)
        ? "Talent removed from saved items"
        : "Talent saved successfully"
    );
    setNotificationType(savedTalents.includes(talentId) ? "error" : "success");
    setShowNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="hyreblock-container">
      {/* Section Header with Description - Separated from listings */}
      <div className="section-header">
        <h2 className="section-title">Hyre Block</h2>
        <p className="section-subtitle">
          Connect with top film industry talent and opportunities on the blockchain
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button
          className={`tab-btn ${activeTab === 'talents' ? 'active' : ''}`}
          onClick={() => setActiveTab('talents')}
        >
          Talents
        </button>
        <button
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </button>
        <button
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
      </div>
      
      {/* Jobs Tab Content */}
      {activeTab === 'jobs' && (
        <div className="jobs-tab-content">
          {/* Enhanced Filters Section */}
          <div className="filters-section">
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="filter-select"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            >
              <option value="all">All Locations</option>
              <option value="Los Angeles, CA">Los Angeles, CA</option>
              <option value="New York, NY">New York, NY</option>
              <option value="Atlanta, GA">Atlanta, GA</option>
            </select>
            
            <select
              className="filter-select"
              value={filters.jobType}
              onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
            >
              <option value="all">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
            
            <select
              className="filter-select"
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
            >
              <option value="all">All Experience Levels</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2-3 years">2-3 years</option>
              <option value="5+ years">5+ years</option>
            </select>
            
            <select
              className="filter-select"
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            >
              <option value="all">All Departments</option>
              <option value="Visual Effects">Visual Effects</option>
              <option value="Production">Production</option>
              <option value="Camera">Camera</option>
            </select>
            
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
          
          {/* Jobs Grid */}
          <div className={`jobs-container ${viewMode}`}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div
                  key={job.id}
                  className={`job-card ${viewMode === 'list' ? 'list-view' : ''}`}
                  onClick={() => {
                    setSelectedJob(job);
                    setShowApplicationForm(true);
                  }}
                >
                  <div className="job-card-header">
                    <div className="job-title-section">
                      <h3 className="job-title">{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                    </div>
                    <button
                      className={`save-job-btn ${savedJobs.includes(job.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSaveJob(job.id, e)}
                      aria-label={savedJobs.includes(job.id) ? "Unsave job" : "Save job"}
                    >
                      <i className={`${savedJobs.includes(job.id) ? 'fas' : 'far'} fa-heart`}></i>
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
                  
                  <p className="job-description">{job.description}</p>
                  
                  <div className="skills-container">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="job-footer">
                    <div className="posted-date">
                      <i className="far fa-calendar-alt"></i>
                      <span>Posted: {job.posted}</span>
                    </div>
                    <div className="deadline">
                      <i className="fas fa-hourglass-half"></i>
                      <span>Apply by: {job.deadline}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No jobs match your current filters. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Rest of the component remains the same */}
      
      {/* Notification */}
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <i className={`fas ${notificationType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <p>{notificationMessage}</p>
        </div>
      )}
    </div>
  );
};

export default HyreBlockSection;
