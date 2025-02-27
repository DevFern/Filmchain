import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';

const HyreBlockSection = () => {
  const { account, error: walletError } = useWallet();
  const fileInputRef = useRef(null);
  
  // State management
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
  const [showFilters, setShowFilters] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showPostJobForm, setShowPostJobForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('newest');
  const [userProfile, setUserProfile] = useState(null);
  const [jobPostForm, setJobPostForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    department: 'Production',
    experience: 'Entry Level',
    salary: '',
    description: '',
    requirements: '',
    deadline: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    bio: '',
    experience: [],
    skills: [],
    education: [],
    portfolio: '',
    availability: 'Available',
    rateRange: '',
    location: ''
  });
  
  // Sample data for jobs
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Director of Photography",
      company: "Horizon Studios",
      logo: "https://i.ibb.co/kGjhMX8/studio1.jpg",
      location: "Los Angeles, CA",
      type: "Full-time",
      department: "Production",
      experience: "Senior Level",
      salary: "\$80,000 - \$120,000",
      posted: "2024-03-01",
      deadline: "2024-04-15",
      description: "Horizon Studios is seeking an experienced Director of Photography for our upcoming feature film. The ideal candidate will have a strong visual style and experience shooting narrative features.",
      requirements: "- 5+ years experience as DP on narrative projects\n- Strong portfolio of cinematic work\n- Experience with Arri Alexa and RED camera systems\n- Ability to work collaboratively with director and production team",
      skills: ["Cinematography", "Lighting", "Camera Operation", "Visual Storytelling"],
      applicants: 24,
      saved: 45,
      views: 230,
      status: "Active"
    },
    {
      id: 2,
      title: "Post-Production Supervisor",
      company: "Dreamscape Productions",
      logo: "https://i.ibb.co/kGjhMX8/studio2.jpg",
      location: "New York, NY",
      type: "Contract",
      department: "Post-Production",
      experience: "Mid Level",
      salary: "\$65,000 - \$85,000",
      posted: "2024-03-05",
      deadline: "2024-04-05",
      description: "Dreamscape Productions is looking for a Post-Production Supervisor to oversee the post-production process for our documentary series. The role involves coordinating with editors, sound designers, and colorists to ensure timely delivery.",
      requirements: "- 3+ years experience in post-production\n- Strong knowledge of post-production workflows\n- Experience with Avid Media Composer and Adobe Premiere\n- Excellent communication and organizational skills",
      skills: ["Post-Production", "Project Management", "Editing", "Workflow Optimization"],
      applicants: 18,
      saved: 32,
      views: 175,
      status: "Active"
    },
    {
      id: 3,
      title: "Screenwriter",
      company: "Stellar Entertainment",
      logo: "https://i.ibb.co/kGjhMX8/studio3.jpg",
      location: "Remote",
      type: "Freelance",
      department: "Creative",
      experience: "Entry Level",
      salary: "Negotiable",
      posted: "2024-03-10",
      deadline: "2024-03-31",
      description: "Stellar Entertainment is seeking a talented screenwriter to develop a script for a short film. The project is a character-driven drama exploring themes of identity and belonging.",
      requirements: "- Strong storytelling abilities\n- Understanding of screenplay format and structure\n- Ability to incorporate feedback\n- Portfolio of writing samples",
      skills: ["Screenwriting", "Story Development", "Character Creation", "Dialogue Writing"],
      applicants: 42,
      saved: 28,
      views: 310,
      status: "Active"
    },
    {
      id: 4,
      title: "VFX Artist",
      company: "Digital Dimensions",
      logo: "https://i.ibb.co/kGjhMX8/studio4.jpg",
      location: "Vancouver, Canada",
      type: "Full-time",
      department: "Visual Effects",
      experience: "Senior Level",
      salary: "\$90,000 - \$130,000",
      posted: "2024-03-08",
      deadline: "2024-04-20",
      description: "Digital Dimensions is looking for a skilled VFX Artist to join our team working on high-end visual effects for feature films. The ideal candidate will have experience with complex compositing and 3D integration.",
      requirements: "- 5+ years experience in VFX for film or television\n- Proficiency in Nuke, Maya, and Houdini\n- Strong understanding of compositing techniques\n- Experience with particle systems and fluid simulations",
      skills: ["Compositing", "3D Modeling", "Particle Effects", "Rotoscoping"],
      applicants: 15,
      saved: 38,
      views: 205,
      status: "Active"
    }
  ]);
  
  // Sample data for talent
  const [talents, setTalents] = useState([
    {
      id: 1,
      name: "Alex Chen",
      title: "Cinematographer",
      avatar: "https://i.ibb.co/kGjhMX8/talent1.jpg",
      location: "Los Angeles, CA",
      experience: "8 years",
      bio: "Award-winning cinematographer with experience on feature films, commercials, and music videos. Known for creating visually striking images with a distinct style.",
      skills: ["Cinematography", "Lighting Design", "Camera Operation", "Color Theory"],
      portfolio: "https://alexchen-dp.com",
      availability: "Available from June 2024",
      rateRange: "\$800 - \$1,200/day",
      featured: true,
      verified: true
    },
    {
      id: 2,
      name: "Maya Johnson",
      title: "Film Editor",
      avatar: "https://i.ibb.co/kGjhMX8/talent2.jpg",
      location: "New York, NY",
      experience: "5 years",
      bio: "Experienced editor specializing in documentary and narrative features. Passionate about storytelling through thoughtful and rhythmic editing.",
      skills: ["Avid Media Composer", "Adobe Premiere Pro", "DaVinci Resolve", "Sound Editing"],
      portfolio: "https://mayaedits.com",
      availability: "Available for remote work",
      rateRange: "\$65 - \$85/hour",
      featured: false,
      verified: true
    },
    {
      id: 3,
      name: "David Park",
      title: "Production Designer",
      avatar: "https://i.ibb.co/kGjhMX8/talent3.jpg",
      location: "Toronto, Canada",
      experience: "12 years",
      bio: "Production designer with extensive experience creating immersive worlds for film and television. Specializing in period pieces and science fiction.",
      skills: ["Set Design", "Art Direction", "Prop Styling", "Concept Art"],
      portfolio: "https://davidparkdesigns.com",
      availability: "Available from May 2024",
      rateRange: "\$900 - \$1,500/day",
      featured: true,
      verified: true
    },
    {
      id: 4,
      name: "Sophia Rodriguez",
      title: "Sound Designer",
      avatar: "https://i.ibb.co/kGjhMX8/talent4.jpg",
      location: "Austin, TX",
      experience: "7 years",
      bio: "Sound designer and mixer with a passion for creating immersive audio experiences. Experience in feature films, documentaries, and interactive media.",
      skills: ["Sound Design", "Foley Recording", "Pro Tools", "Spatial Audio"],
      portfolio: "https://sophiasound.com",
      availability: "Available for project-based work",
      rateRange: "\$70 - \$90/hour",
      featured: false,
      verified: true
    }
  ]);
  
  // Filter jobs based on search and filters
  const filteredJobs = () => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesLocation = filters.location === 'all' || job.location.includes(filters.location);
      const matchesJobType = filters.jobType === 'all' || job.type === filters.jobType;
      const matchesExperience = filters.experience === 'all' || job.experience === filters.experience;
      const matchesDepartment = filters.department === 'all' || job.department === filters.department;
      
      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesDepartment;
    }).sort((a, b) => {
      switch(sortOption) {
        case 'newest':
          return new Date(b.posted) - new Date(a.posted);
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'popularity':
          return b.views - a.views;
        default:
          return new Date(b.posted) - new Date(a.posted);
      }
    });
  };
  
  // Filter talents based on search and filters
  const filteredTalents = () => {
    return talents.filter(talent => {
      const matchesSearch = 
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesLocation = filters.location === 'all' || talent.location.includes(filters.location);
      const matchesExperience = filters.experience === 'all' || 
        (filters.experience === 'Entry Level' && parseInt(talent.experience) < 3) ||
        (filters.experience === 'Mid Level' && parseInt(talent.experience) >= 3 && parseInt(talent.experience) < 7) ||
        (filters.experience === 'Senior Level' && parseInt(talent.experience) >= 7);
      
      return matchesSearch && matchesLocation && matchesExperience;
    }).sort((a, b) => {
      switch(sortOption) {
        case 'featured':
          return b.featured - a.featured;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        default:
          return b.featured - a.featured;
      }
    });
  };
  
  // Toggle saved job
  const toggleSaveJob = (jobId) => {
    if (!account) {
      setError("Please connect your wallet to save jobs");
      showNotificationWithTimeout("Please connect your wallet to save jobs", "error");
      return;
    }
    
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      showNotificationWithTimeout("Job removed from saved items", "success");
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      showNotificationWithTimeout("Job saved successfully", "success");
    }
  };
  
  // Toggle saved talent
  const toggleSaveTalent = (talentId) => {
    if (!account) {
      setError("Please connect your wallet to save talents");
      showNotificationWithTimeout("Please connect your wallet to save talents", "error");
      return;
    }
    
    if (savedTalents.includes(talentId)) {
      setSavedTalents(prev => prev.filter(id => id !== talentId));
      showNotificationWithTimeout("Talent removed from saved items", "success");
    } else {
      setSavedTalents(prev => [...prev, talentId]);
      showNotificationWithTimeout("Talent saved successfully", "success");
    }
  };
  
  // Show notification with timeout
  const showNotificationWithTimeout = (message, type = "success") => {
    setNotificationMessage({ text: message, type });
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  // Handle job application
  const handleApplyJob = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your wallet to apply for jobs");
      return;
    }
    
    if (!resumeFile) {
      setError("Please upload your resume");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add to applications
      setApplications(prev => [...prev, selectedJob.id]);
      
      // Show success message
      setSuccess("Your application has been submitted successfully!");
      showNotificationWithTimeout("Application submitted successfully", "success");
      
      // Reset form
      setResumeFile(null);
      setCoverLetter('');
      
      // Close modal after delay
      setTimeout(() => {
        setShowApplicationForm(false);
        setSelectedJob(null);
        setIsSubmitting(false);
        setSuccess(null);
      }, 2000);
      
    } catch (err) {
      console.error("Error submitting application:", err);
      setError("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // Handle job posting
  const handlePostJob = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your wallet to post jobs");
      return;
    }
    
    // Validate form
    if (!jobPostForm.title || !jobPostForm.company || !jobPostForm.description || !jobPostForm.requirements) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new job
      const newJob = {
        id: jobs.length + 1,
        title: jobPostForm.title,
        company: jobPostForm.company,
        logo: "https://i.ibb.co/kGjhMX8/studio" + Math.floor(Math.random() * 4 + 1) + ".jpg",
        location: jobPostForm.location,
        type: jobPostForm.type,
        department: jobPostForm.department,
        experience: jobPostForm.experience,
        salary: jobPostForm.salary,
        posted: new Date().toISOString().split('T')[0],
        deadline: jobPostForm.deadline,
        description: jobPostForm.description,
        requirements: jobPostForm.requirements,
        skills: jobPostForm.requirements.split('\n').map(req => req.replace('- ', '')).filter(req => req.trim() !== ''),
        applicants: 0,
        saved: 0,
        views: 0,
        status: "Active"
      };
      
      setJobs(prev => [newJob, ...prev]);
      
      // Show success message
      setSuccess("Your job has been posted successfully!");
      showNotificationWithTimeout("Job posted successfully", "success");
      
      // Reset form
      setJobPostForm({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        department: 'Production',
        experience: 'Entry Level',
        salary: '',
        description: '',
        requirements: '',
        deadline: ''
      });
      
      // Close modal after delay
      setTimeout(() => {
        setShowPostJobForm(false);
        setIsSubmitting(false);
        setSuccess(null);
      }, 2000);
      
    } catch (err) {
      console.error("Error posting job:", err);
      setError("Failed to post job. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // Handle profile creation
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    
    if (!account) {
      setError("Please connect your wallet to create a profile");
      return;
    }
    
    // Validate form
    if (!profileForm.name || !profileForm.title || !profileForm.bio) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create profile
      const newProfile = {
        id: talents.length + 1,
        name: profileForm.name,
        title: profileForm.title,
        avatar: "https://i.ibb.co/kGjhMX8/talent" + Math.floor(Math.random() * 4 + 1) + ".jpg",
        location: profileForm.location,
        experience: profileForm.experience.length > 0 ? profileForm.experience[0].years : "0 years",
        bio: profileForm.bio,
        skills: profileForm.skills,
        portfolio: profileForm.portfolio,
        availability: profileForm.availability,
        rateRange: profileForm.rateRange,
        featured: false,
        verified: false
      };
      
      setUserProfile(newProfile);
      setTalents(prev => [newProfile, ...prev]);
      
      // Show success message
      setSuccess("Your profile has been created successfully!");
      showNotificationWithTimeout("Profile created successfully", "success");
      
      // Close modal after delay
      setTimeout(() => {
        setShowProfileForm(false);
        setIsSubmitting(false);
        setSuccess(null);
      }, 2000);
      
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("Failed to create profile. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days left
  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Last day";
    return `${diffDays} days left`;
  };
  
  // Job Card Component
  const JobCard = ({ job }) => (
    <motion.div 
      className={`job-card ${viewMode === 'list' ? 'list-view' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveJob(job.id);
          }}
        >
          <i className={`${savedJobs.includes(job.id) ? 'fas' : 'far'} fa-bookmark`}></i>
        </button>
      </div>
      
      <div className="job-card-body">
        <div className="job-tags">
          <span className="job-department">{job.department}</span>
          <span className="job-experience">{job.experience}</span>
          {job.salary && <span className="job-salary">{job.salary}</span>}
        </div>
        
        <p className="job-description">{job.description.substring(0, 150)}...</p>
        
        <div className="job-skills">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {job.skills.length > 3 && <span className="more-skills">+{job.skills.length - 3}</span>}
        </div>
      </div>
      
      <div className="job-card-footer">
        <div className="job-stats">
          <span className="job-posted">Posted: {formatDate(job.posted)}</span>
          <span className="job-deadline">{getDaysLeft(job.deadline)}</span>
        </div>
        
        <button 
          className="apply-btn"
          onClick={() => {
            setSelectedJob(job);
            setShowApplicationForm(true);
          }}
          disabled={applications.includes(job.id)}
        >
          {applications.includes(job.id) ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    </motion.div>
  );
  
  // Talent Card Component
  const TalentCard = ({ talent }) => (
    <motion.div 
      className={`talent-card ${viewMode === 'list' ? 'list-view' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="talent-card-header">
        <div className="talent-avatar">
          <img src={talent.avatar} alt={talent.name} />
          {talent.verified && <div className="verified-badge"><i className="fas fa-check"></i></div>}
        </div>
        <div className="talent-info">
          <h3 className="talent-name">{talent.name}</h3>
          <p className="talent-title">{talent.title}</p>
          <div className="talent-meta">
            <span className="talent-location"><i className="fas fa-map-marker-alt"></i> {talent.location}</span>
            <span className="talent-experience"><i className="fas fa-star"></i> {talent.experience}</span>
          </div>
        </div>
        <button 
          className={`save-btn ${savedTalents.includes(talent.id) ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveTalent(talent.id);
          }}
        >
          <i className={`${savedTalents.includes(talent.id) ? 'fas' : 'far'} fa-bookmark`}></i>
        </button>
      </div>
      
      <div className="talent-card-body">
        <p className="talent-bio">{talent.bio.substring(0, 150)}...</p>
        
        <div className="talent-skills">
          {talent.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {talent.skills.length > 4 && <span className="more-skills">+{talent.skills.length - 4}</span>}
        </div>
      </div>
      
      <div className="talent-card-footer">
        <div className="talent-availability">
          <i className="fas fa-calendar-check"></i>
          <span>{talent.availability}</span>
        </div>
        
        <div className="talent-rate">
          <i className="fas fa-money-bill-wave"></i>
          <span>{talent.rateRange}</span>
        </div>
        
        <button 
          className="contact-btn"
          onClick={() => setSelectedTalent(talent)}
        >
          View Profile
        </button>
      </div>
    </motion.div>
  );
  
  // Application Form Modal
  const ApplicationFormModal = () => (
    <AnimatePresence>
      {showApplicationForm && selectedJob && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modal-content application-modal"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="modal-header">
              <h3>Apply for {selectedJob.title}</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowApplicationForm(false);
                  setSelectedJob(null);
                  setResumeFile(null);
                  setCoverLetter('');
                  setError(null);
                  setSuccess(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="job-summary">
                <div className="company-logo">
                  <img src={selectedJob.logo} alt={selectedJob.company} />
                </div>
                <div className="job-details">
                  <h4>{selectedJob.title}</h4>
                  <p className="company-name">{selectedJob.company}</p>
                  <div className="job-meta">
                    <span><i className="fas fa-map-marker-alt"></i> {selectedJob.location}</span>
                    <span><i className="fas fa-briefcase"></i> {selectedJob.type}</span>
                    <span><i className="fas fa-layer-group"></i> {selectedJob.department}</span>
                  </div>
                </div>
              </div>
              
              {success ? (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <p>{success}</p>
                </div>
              ) : (
                <form onSubmit={handleApplyJob}>
                  <div className="form-group">
                    <label>Resume/CV</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                      />
                      <div className="file-upload-btn" onClick={() => fileInputRef.current.click()}>
                        <i className="fas fa-upload"></i>
                        <span>{resumeFile ? resumeFile.name : 'Upload Resume/CV'}</span>
                      </div>
                      <p className="file-format">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Cover Letter (Optional)</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Introduce yourself and explain why you're a good fit for this position..."
                      rows="6"
                    ></textarea>
                  </div>
                  
                  {error && <p className="error-message">{error}</p>}
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setShowApplicationForm(false);
                        setSelectedJob(null);
                        setResumeFile(null);
                        setCoverLetter('');
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="loading-spinner">
                          <i className="fas fa-spinner fa-spin"></i> Submitting...
                        </span>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  // Post Job Modal
  const PostJobModal = () => (
    <AnimatePresence>
      {showPostJobForm && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modal-content post-job-modal"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
