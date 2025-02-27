import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

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
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedTalents, setSavedTalents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showTalentModal, setShowTalentModal] = useState(false);
  const [applicationFiles, setApplicationFiles] = useState({
    resume: null,
    portfolio: null,
    coverLetter: null
  });
  const [applicationNote, setApplicationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sample job data
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior VFX Artist",
      company: "Dreamscape Studios",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "\$90,000 - \$120,000",
      experience: "5+ years",
      department: "Visual Effects",
      logo: "https://i.ibb.co/kGjhMX8/company1.jpg",
      description: "Looking for a senior VFX artist to join our award-winning team working on high-profile feature films and streaming content. The ideal candidate will have extensive experience with particle systems, fluid simulations, and photorealistic rendering.",
      responsibilities: [
        "Create high-quality visual effects for feature films and streaming content",
        "Collaborate with the art department to achieve the director's vision",
        "Develop and maintain efficient VFX workflows",
        "Mentor junior artists and provide technical guidance"
      ],
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
      salary: "\$45,000 - \$60,000",
      experience: "2-3 years",
      department: "Production",
      logo: "https://i.ibb.co/kGjhMX8/company2.jpg",
      description: "Seeking an experienced production coordinator for upcoming feature film. The coordinator will be responsible for managing day-to-day operations, coordinating with various departments, and ensuring smooth production workflow.",
      responsibilities: [
        "Coordinate daily production activities and schedules",
        "Prepare and distribute call sheets, production reports, and other documents",
        "Assist with budget tracking and expense management",
        "Facilitate communication between departments"
      ],
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
    },
    {
      id: 3,
      title: "Screenwriter",
      company: "Horizon Pictures",
      location: "Remote",
      type: "Freelance",
      salary: "Negotiable",
      experience: "3+ years",
      department: "Creative",
      logo: "https://i.ibb.co/kGjhMX8/company3.jpg",
      description: "Horizon Pictures is seeking a talented screenwriter for an upcoming sci-fi thriller. The writer will work closely with the director to develop a compelling screenplay based on an existing treatment.",
      responsibilities: [
        "Develop a feature-length screenplay from an existing treatment",
        "Collaborate with the director on story development",
        "Revise and refine the script through multiple drafts",
        "Participate in script readings and feedback sessions"
      ],
      requirements: [
        "Previous screenwriting experience with produced credits",
        "Strong understanding of three-act structure and character development",
        "Experience in the sci-fi genre preferred",
        "Ability to meet deadlines and incorporate feedback"
      ],
      benefits: [
        "Competitive pay",
        "Screen credit",
        "Potential for future collaborations",
        "Flexible working arrangements"
      ],
      posted: "2024-03-05",
      deadline: "2024-04-05"
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
      bio: "Award-winning VFX supervisor with experience on major blockbuster films including 'Cosmic Odyssey' and 'The Dark Frontier'. Specialized in complex simulations and photorealistic environments.",
      image: "https://i.ibb.co/kGjhMX8/talent1.jpg",
      projects: [
        { title: "Cosmic Odyssey", role: "VFX Supervisor", year: "2022" },
        { title: "The Dark Frontier", role: "Senior VFX Artist", year: "2020" },
        { title: "Eternal Shadows", role: "VFX Artist", year: "2018" }
      ],
      verified: true
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
      bio: "Experienced production manager specialized in large-scale productions with budgets exceeding \$50M. Strong track record of bringing projects in on time and under budget while maintaining creative vision.",
      image: "https://i.ibb.co/kGjhMX8/talent2.jpg",
      projects: [
        { title: "City of Dreams", role: "Production Manager", year: "2023" },
        { title: "The Last Stand", role: "Assistant Production Manager", year: "2021" },
        { title: "Whispers in the Dark", role: "Production Coordinator", year: "2019" }
      ],
      verified: true
    },
    {
      id: 3,
      name: "Elena Petrov",
      title: "Cinematographer",
      experience: "10 years",
      location: "Los Angeles, CA",
      skills: ["Lighting Design", "Camera Operation", "Visual Storytelling", "Color Theory"],
      portfolio: "https://elenapetrovjdp.com",
      availability: "Available from May 2024",
      bio: "Award-winning cinematographer known for distinctive visual style and innovative lighting techniques. Experienced in both narrative features and commercial work with a focus on creating emotionally resonant imagery.",
      image: "https://i.ibb.co/kGjhMX8/talent3.jpg",
      projects: [
        { title: "The Silent Hour", role: "Director of Photography", year: "2023" },
        { title: "Neon Dreams", role: "Cinematographer", year: "2021" },
        { title: "Echoes of Tomorrow", role: "Camera Operator", year: "2019" }
      ],
      verified: false
    }
  ]);

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
        jobTitle: jobs.find(job => job.id === jobId)?.title,
        company: jobs.find(job => job.id === jobId)?.company,
        status: 'Pending Review',
        submittedAt: new Date().toISOString(),
        note: applicationNote,
        ...applicationFiles
      };

      setApplications(prev => [...prev, newApplication]);
      
      // Reset form
      setApplicationFiles({ resume: null, portfolio: null, coverLetter: null });
      setApplicationNote('');
      
      // Show success message
      setSuccessMessage("Your application has been submitted successfully!");
      setShowSuccessModal(true);
      
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

  const toggleSaveTalent = (talentId) => {
    setSavedTalents(prev => 
      prev.includes(talentId)
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredJobs = jobs.filter(job => {
    // Apply search filter
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !job.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply location filter
    if (filters.location !== 'all' && job.location !== filters.location) {
      return false;
    }
    
    // Apply job type filter
    if (filters.jobType !== 'all' && job.type !== filters.jobType) {
      return false;
    }
    
    // Apply department filter
    if (filters.department !== 'all' && job.department !== filters.department) {
      return false;
    }
    
    return true;
  });

  const filteredTalents = talents.filter(talent => {
    // Apply search filter
    if (searchTerm && !talent.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !talent.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply location filter
    if (filters.location !== 'all' && talent.location !== filters.location) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="hyreblock-container">
      <div className="section-header">
        <h2 className="section-title">HyreBlock</h2>
        <p className="section-subtitle">Connect with film industry professionals and find your next opportunity</p>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <i className="fas fa-briefcase"></i> Browse Jobs
        </button>
        <button 
          className={`tab-button ${activeTab === 'talent' ? 'active' : ''}`}
          onClick={() => setActiveTab('talent')}
        >
          <i className="fas fa-users"></i> Talent Pool
        </button>
        {account && (
          <>
            <button 
              className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <i className="fas fa-heart"></i> Saved
            </button>
            <button 
              className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <i className="fas fa-file-alt"></i> My Applications
            </button>
          </>
        )}
      </div>
      
      <div className="filters-section">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search jobs, skills, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filters.location}
            onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
            className="filter-select"
          >
            <option value="all">All Locations</option>
            <option value="Los Angeles, CA">Los Angeles</option>
            <option value="New York, NY">New York</option>
            <option value="Vancouver, BC">Vancouver</option>
            <option value="Atlanta, GA">Atlanta</option>
            <option value="Remote">Remote</option>
          </select>
          
          {activeTab === 'jobs' && (
            <>
              <select 
                value={filters.jobType}
                onChange={(e) => setFilters(prev => ({...prev, jobType: e.target.value}))}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Part-time">Part-time</option>
              </select>
              
              <select 
                value={filters.department}
                onChange={(e) => setFilters(prev => ({...prev, department: e.target.value}))}
                className="filter-select"
              >
                <option value="all">All Departments</option>
                <option value="Visual Effects">Visual Effects</option>
                <option value="Production">Production</option>
                <option value="Creative">Creative</option>
                <option value="Post-Production">Post-Production</option>
                <option value="Camera">Camera</option>
              </select>
            </>
          )}
          
          {activeTab === 'talent' && (
            <select 
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({...prev, experience: e.target.value}))}
              className="filter-select"
            >
              <option value="all">All Experience</option>
              <option value="0-2 years">0-2 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
              <option value="10+ years">10+ years</option>
            </select>
          )}
        </div>
      </div>
      
      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="card">
                <div className="card-content">
                  <div className="job-header">
                    <div className="company-logo">
                      <img src={job.logo} alt={job.company} />
                    </div>
                    <div className="job-title-container">
                      <h3 className="card-title">{job.title}</h3>
                      <p className="card-subtitle">{job.company}</p>
                    </div>
                    <button 
                      className={`save-btn ${savedJobs.includes(job.id) ? 'saved' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job.id);
                      }}
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
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>Posted: {formatDate(job.posted)}</span>
                    </div>
                  </div>
                  
                  <p className="job-description">{job.description.substring(0, 150)}...</p>
                  
                  <div className="card-footer">
                    <button 
                      className="btn btn-outline"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowApplicationForm(true);
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <h3>No jobs found</h3>
              <p>Try adjusting your search filters or check back later for new opportunities.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Talent Tab */}
      {activeTab === 'talent' && (
        <div className="grid">
          {filteredTalents.length > 0 ? (
            filteredTalents.map(talent => (
              <div key={talent.id} className="card talent-card">
                <div className="card-content">
                  <div className="talent-header">
                    <div className="talent-avatar">
                      <img src={talent.image} alt={talent.name} />
                      {talent.verified && (
                        <div className="verified-badge" title="Verified Professional">
                          <i className="fas fa-check"></i>
                        </div>
                      )}
                    </div>
                    <div className="talent-info">
                      <h3 className="card-title">{talent.name}</h3>
                      <p className="card-subtitle">{talent.title}</p>
                    </div>
                    <button 
                      className={`save-btn ${savedTalents.includes(talent.id) ? 'saved' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveTalent(talent.id);
                      }}
                      aria-label={savedTalents.includes(talent.id) ? "Unsave talent" : "Save talent"}
                    >
                      <i className={`${savedTalents.includes(talent.id) ? 'fas' : 'far'} fa-heart`}></i>
                    </button>
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
                    <div className="detail-item">
                      <i className="fas fa-calendar-check"></i>
                      <span>{talent.availability}</span>
                    </div>
                  </div>
                  
                  <div className="talent-skills">
                    {talent.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="card-footer">
                    <a 
                      href={talent.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline"
                    >
                      Portfolio
                    </a>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedTalent(talent);
                        setShowTalentModal(true);
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-users"></i>
              <h3>No talents found</h3>
              <p>Try adjusting your search filters or check back later for new professionals.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Saved Tab */}
      {activeTab === 'saved' && (
        <div className="saved-content">
          <div className="saved-tabs">
            <button 
              className={`saved-tab ${activeTab === 'saved' && !selectedTalent ? 'active' : ''}`}
              onClick={() => setSelectedTalent(null)}
            >
              Saved Jobs ({savedJobs.length})
            </button>
            <button 
              className={`saved-tab ${activeTab === 'saved' && selectedTalent ? 'active' : ''}`}
              onClick={() => setSelectedTalent(talents[0])}
            >
              Saved Talents ({savedTalents.length})
            </button>
          </div>
          
          <div className="grid">
            {!selectedTalent ? (
              // Saved Jobs
              savedJobs.length > 0 ? (
                jobs.filter(job => savedJobs.includes(job.id)).map(job => (
                  <div key={job.id} className="card">
                    <div className="card-content">
                      <div className="job-header">
                        <div className="company-logo">
                          <img src={job.logo} alt={job.company} />
                        </div>
                        <div className="job-title-container">
                          <h3 className="card-title">{job.title}</h3>
                          <p className="card-subtitle">{job.company}</p>
                        </div>
                        <button 
                          className="save-btn saved"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job.id);
                          }}
                          aria-label="Unsave job"
                        >
                          <i className="fas fa-heart"></i>
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
                      
                      <div className="card-footer">
                        <button 
                          className="btn btn-outline"
                          onClick={() => setSelectedJob(job)}
                        >
                          View Details
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedJob(job);
                            setShowApplicationForm(true);
                          }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="far fa-heart"></i>
                  <h3>No saved jobs</h3>
                  <p>Jobs you save will appear here for easy access.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('jobs')}
                  >
                    Browse Jobs
                  </button>
                </div>
              )
            ) : (
              // Saved Talents
              savedTalents.length > 0 ? (
                talents.filter(talent => savedTalents.includes(talent.id)).map(talent => (
                  <div key={talent.id} className="card talent-card">
                    <div className="card-content">
                      <div className="talent-header">
                        <div className="talent-avatar">
                          <img src={talent.image} alt={talent.name} />
                          {talent.verified && (
                            <div className="verified-badge" title="Verified Professional">
                              <i className="fas fa-check"></i>
                            </div>
                          )}
                        </div>
                        <div className="talent-info">
                          <h3 className="card-title">{talent.name}</h3>
                          <p className="card-subtitle">{talent.title}</p>
                        </div>
                        <button 
                          className="save-btn saved"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveTalent(talent.id);
                          }}
                          aria-label="Unsave talent"
                        >
                          <i className="fas fa-heart"></i>
                        </button>
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
                      
                      <div className="card-footer">
                        <a 
                          href={talent.portfolio} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-outline"
                        >
                          Portfolio
                        </a>
                        <button 
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedTalent(talent);
                            setShowTalentModal(true);
                          }}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="far fa-heart"></i>
                  <h3>No saved talents</h3>
                  <p>Talents you save will appear here for easy access.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('talent')}
                  >
                    Browse Talents
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
      
      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="applications-container">
          {applications.length > 0 ? (
            <div className="applications-list">
              {applications.map(application => (
                <div key={application.id} className="application-card">
                  <div className="application-header">
                    <div className="application-title">
                      <h3>{application.jobTitle}</h3>
                      <p>{application.company}</p>
                    </div>
                    <div className={`application-status ${application.status.toLowerCase().replace(' ', '-')}`}>
                      {application.status}
                    </div>
                  </div>
                  
                  <div className="application-details">
                    <div className="detail-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Applied: {formatDate(application.submittedAt)}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-file-alt"></i>
                      <span>Resume: {application.resume ? application.resume.name : 'Not provided'}</span>
                    </div>
                    {application.portfolio && (
                      <div className="detail-item">
                        <i className="fas fa-images"></i>
                        <span>Portfolio: {application.portfolio.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {application.note && (
                    <div className="application-note">
                      <h4>Your Note:</h4>
                      <p>{application.note}</p>
                    </div>
                  )}
                  
                  <div className="application-actions">
                    <button className="btn btn-outline btn-sm">
                      <i className="fas fa
