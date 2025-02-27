function App() {
  const [activeTab, setActiveTab] = React.useState('jobs');
  const [selectedJob, setSelectedJob] = React.useState(null);
  const [selectedTalent, setSelectedTalent] = React.useState(null);
  const [filters, setFilters] = React.useState({
    location: 'all',
    jobType: 'all',
    experience: 'all',
    department: 'all'
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [savedJobs, setSavedJobs] = React.useState([1]);
  const [savedTalents, setSavedTalents] = React.useState([2]);
  const [applications, setApplications] = React.useState([]);
  const [showApplicationForm, setShowApplicationForm] = React.useState(false);
  const [showTalentModal, setShowTalentModal] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('grid');
  const [showNotification, setShowNotification] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const [notificationType, setNotificationType] = React.useState('success');

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
      logo: "https://placehold.co/100x100/6a1b9a/ffffff?text=DS",
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
      logo: "https://placehold.co/100x100/9c27b0/ffffff?text=FC",
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
      logo: "https://placehold.co/100x100/e91e63/ffffff?text=VF",
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
      image: "https://placehold.co/100x100/6a1b9a/ffffff?text=AJ",
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
      image: "https://placehold.co/100x100/9c27b0/ffffff?text=SW",
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
      image: "https://placehold.co/100x100/e91e63/ffffff?text=EP",
      verified: false
    }
  ];

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

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Job Card Component
  const JobCard = ({ job }) => (
    <div className={`job-card ${viewMode === 'list' ? 'list-view' : ''}`}>
      <div className="job-card-header">
        <div className="company-logo">
          <img src={job.logo} alt={job.company} />
        </div>
        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.company}</p>
          <div className="job-meta">
            <span className="job-location"><i className="fas fa-map-marker-alt"></i> {job.location}</span>
            <span className="job-type"><i className="fas fa-briefcase"></i> {job.type}</span>
          </div>
        </div>
        <button
          className={`save-btn ${savedJobs.includes(job.id) ? 'saved' : ''}`}
          onClick={(e) => toggleSaveJob(job.id, e)}
          aria-label={savedJobs.includes(job.id) ? "Unsave job" : "Save job"}
        >
          <i className={`${savedJobs.includes(job.id) ? 'fas' : 'far'} fa-heart`}></i>
        </button>
      </div>

      <div className="job-card-body">
        <div className="job-tags">
          <span className="job-department">{job.department}</span>
          <span className="job-experience">{job.experience}</span>
          <span className="job-salary">{job.salary}</span>
        </div>

        <p className="job-description">{job.description}</p>

        <div className="job-skills">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {job.skills.length > 3 && (
            <span className="more-skills">+{job.skills.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-stats">
          <span className="job-posted"><i className="far fa-calendar-alt"></i> Posted: {formatDate(job.posted)}</span>
          <span className="job-deadline"><i className="fas fa-hourglass-half"></i> Deadline: {formatDate(job.deadline)}</span>
        </div>

        <button className="apply-btn">Apply Now</button>
      </div>
    </div>
  );

  // Talent Card Component
  const TalentCard = ({ talent }) => (
    <div className={`talent-card ${viewMode === 'list' ? 'list-view' : ''}`}>
      <div className="talent-card-header">
        <div className="talent-avatar">
          <img src={talent.image} alt={talent.name} />
          {talent.verified && (
            <div className="verified-badge" title="Verified Professional">
              <i className="fas fa-check"></i>
            </div>
          )}
        </div>
        <div className="talent-info">
          <h3 className="talent-name">{talent.name}</h3>
          <p className="talent-title">{talent.title}</p>
          <div className="talent-meta">
            <span className="talent-location"><i className="fas fa-map-marker-alt"></i> {talent.location}</span>
            <span className="talent-experience"><i className="fas fa-clock"></i> {talent.experience}</span>
          </div>
        </div>
        <button
          className={`save-btn ${savedTalents.includes(talent.id) ? 'saved' : ''}`}
          onClick={(e) => toggleSaveTalent(talent.id, e)}
          aria-label={savedTalents.includes(talent.id) ? "Unsave talent" : "Save talent"}
        >
          <i className={`${savedTalents.includes(talent.id) ? 'fas' : 'far'} fa-heart`}></i>
        </button>
      </div>

      <div className="talent-card-body">
        <p className="talent-bio">{talent.bio}</p>

        <div className="talent-skills">
          {talent.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <div className="talent-card-footer">
        <div className="talent-stats">
          <span className="talent-availability"><i className="far fa-calendar-check"></i> {talent.availability}</span>
        </div>

        <button className="contact-btn">View Profile</button>
      </div>
    </div>
  );

  return (
    <div className="hyreblock-container">
      <div className="section-header">
        <h2 className="section-title">HyreBlock</h2>
        <p className="section-subtitle">Connect with film industry professionals and find your next opportunity</p>
      </div>

      <div className="tabs-container">
        <div className="tabs-nav">
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
        </div>

        <div className="search-filters">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder={`Search ${activeTab === 'jobs' ? 'jobs, companies, or skills' : 'talents, roles, or skills'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-container">
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
              className="filter-select"
            >
              <option value="all">All Locations</option>
              <option value="Los Angeles, CA">Los Angeles</option>
              <option value="New York, NY">New York</option>
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
                  <option value="Camera">Camera</option>
                  <option value="Post-Production">Post-Production</option>
                </select>
              </>
            )}

            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>

            <select className="sort-select">
              <option value="recent">Most Recent</option>
              <option value="relevant">Most Relevant</option>
              <option value="salary-high">Highest Salary</option>
              <option value="salary-low">Lowest Salary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className={`jobs-container ${viewMode}`}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
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
        <div className={`talents-container ${viewMode}`}>
          {filteredTalents.length > 0 ? (
            filteredTalents.map(talent => (
              <TalentCard key={talent.id} talent={talent} />
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
              className={`saved-tab ${!selectedTalent ? 'active' : ''}`}
              onClick={() => setSelectedTalent(null)}
            >
              Saved Jobs ({savedJobs.length})
            </button>
            <button
              className={`saved-tab ${selectedTalent ? 'active' : ''}`}
              onClick={() => setSelectedTalent(talents[0])}
            >
              Saved Talents ({savedTalents.length})
            </button>
          </div>

          <div className={`saved-items-container ${viewMode}`}>
            {!selectedTalent ? (
              // Saved Jobs
              savedJobs.length > 0 ? (
                jobs.filter(job => savedJobs.includes(job.id)).map(job => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="empty-state">
                  <i className="far fa-heart"></i>
                  <h3>No saved jobs</h3>
                  <p>Jobs you save will appear here for easy access.</p>
                  <button
                    className="btn-primary"
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
                  <TalentCard key={talent.id} talent={talent} />
                ))
              ) : (
                <div className="empty-state">
                  <i className="far fa-heart"></i>
                  <h3>No saved talents</h3>
                  <p>Talents you save will appear here for easy access.</p>
                  <button
                    className="btn-primary"
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
              {/* Application items would go here */}
              <p>Your applications will appear here.</p>
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-file-alt"></i>
              <h3>No applications yet</h3>
              <p>When you apply for jobs, they will appear here for tracking.</p>
              <button
                className="btn-primary"
                onClick={() => setActiveTab('jobs')}
              >
                Browse Jobs
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <i className={`fas ${notificationType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{notificationMessage}</span>
        </div>
      )}
    </div>
  );
}
