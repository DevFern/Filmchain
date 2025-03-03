import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const IndieFundSection = () => {
  const { account, filmBalance = 1000, error: walletError } = useWallet();
  
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "The Last Horizon",
      director: "Maria Rodriguez",
      genre: "Sci-Fi Drama",
      description: "A thought-provoking exploration of humanity's future as Earth becomes uninhabitable and a team of scientists searches for a new home among the stars.",
      image: "https://placehold.co/600x400/6a11cb/ffff?text=The+Last+Horizon",
      fundingGoal: 250000,
      fundingRaised: 175000,
      deadline: "2024-06-30",
      investors: 128,
      updates: [
        { title: "Principal Photography Complete", date: "2024-03-01", content: "We've wrapped principal photography and are moving into post-production. Thanks to all our investors for making this possible!" },
        { title: "VFX Team Assembled", date: "2024-02-15", content: "We've partnered with Stellar VFX to bring our vision to life with cutting-edge visual effects." }
      ],
      timeline: [
        { title: "Development", description: "Script finalization and pre-production planning", date: "2023-12-15", completed: true },
        { title: "Pre-Production", description: "Casting, location scouting, and crew assembly", date: "2024-01-30", completed: true },
        { title: "Production", description: "Principal photography", date: "2024-03-01", completed: true },
        { title: "Post-Production", description: "Editing, VFX, sound design, and color grading", date: "2024-07-15", completed: false },
        { title: "Distribution", description: "Festival submissions and distribution deals", date: "2024-10-01", completed: false }
      ],
      team: [
        { name: "Maria Rodriguez", role: "Director", bio: "Award-winning director known for visually stunning narratives", image: "https://placehold.co/100x100/6a11cb/ffff?text=MR" },
        { name: "James Chen", role: "Producer", bio: "Experienced producer with a track record of successful indie films", image: "https://placehold.co/100x100/6a11cb/ffff?text=JC" },
        { name: "Sophia Patel", role: "Cinematographer", bio: "Innovative DP known for creating immersive visual experiences", image: "https://placehold.co/100x100/6a11cb/ffff?text=SP" }
      ],
      projectedReturn: "15-20%",
      category: "Feature Film"
    },
    {
      id: 2,
      title: "Echoes of Tomorrow",
      director: "David Kim",
      genre: "Documentary",
      description: "An intimate look at how emerging technologies are reshaping communities around the world, told through the stories of innovators and everyday people.",
      image: "https://placehold.co/600x400/2575fc/ffff?text=Echoes+of+Tomorrow",
      fundingGoal: 120000,
      fundingRaised: 85000,
      deadline: "2024-05-15",
      investors: 76,
      updates: [
        { title: "International Filming Complete", date: "2024-02-28", content: "We've finished filming in Tokyo, Lagos, and San Francisco, capturing diverse perspectives on technological change." }
      ],
      timeline: [
        { title: "Research", description: "Subject identification and story development", date: "2023-11-01", completed: true },
        { title: "Production", description: "International filming and interviews", date: "2024-02-28", completed: true },
        { title: "Post-Production", description: "Editing and sound design", date: "2024-06-15", completed: false },
        { title: "Release", description: "Festival circuit and streaming release", date: "2024-09-01", completed: false }
      ],
      team: [
        { name: "David Kim", role: "Director", bio: "Documentary filmmaker focused on social impact stories", image: "https://placehold.co/100x100/2575fc/ffff?text=DK" },
        { name: "Aisha Johnson", role: "Producer", bio: "Producer specializing in documentary and non-fiction content", image: "https://placehold.co/100x100/2575fc/ffff?text=AJ" }
      ],
      projectedReturn: "10-15%",
      category: "Documentary"
    },
    {
      id: 3,
      title: "Midnight Melody",
      director: "Thomas Wright",
      genre: "Musical Drama",
      description: "A passionate tale of a jazz pianist and a classical violinist who find harmony in their contrasting worlds, set against the backdrop of New Orleans' vibrant music scene.",
      image: "https://placehold.co/600x400/e91e63/ffff?text=Midnight+Melody",
      fundingGoal: 180000,
      fundingRaised: 45000,
      deadline: "2024-07-20",
      investors: 32,
      updates: [
        { title: "Soundtrack Production Begins", date: "2024-03-10", content: "Grammy-winning composer Marcus Johnson has joined the team to create our original soundtrack." }
      ],
      timeline: [
        { title: "Development", description: "Script and music composition", date: "2024-01-15", completed: true },
        { title: "Pre-Production", description: "Casting and location scouting", date: "2024-04-01", completed: false },
        { title: "Production", description: "Filming in New Orleans", date: "2024-08-15", completed: false },
        { title: "Post-Production", description: "Editing and sound mixing", date: "2024-11-01", completed: false }
      ],
      team: [
        { name: "Thomas Wright", role: "Director", bio: "Director with background in music videos and performance films", image: "https://placehold.co/100x100/e91e63/ffff?text=TW" },
        { name: "Elena Diaz", role: "Music Director", bio: "Composer and music producer with experience in film scoring", image: "https://placehold.co/100x100/e91e63/ffff?text=ED" }
      ],
      projectedReturn: "12-18%",
      category: "Feature Film"
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [calculatedReturn, setCalculatedReturn] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    fundingStatus: 'all',
    genre: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects based on current filters and search term
  const filteredProjects = projects.filter(project => {
    // Apply category filter
    if (filters.category !== 'all' && project.category !== filters.category) return false;
    
    // Apply funding status filter
    if (filters.fundingStatus === 'funded' && project.fundingRaised < project.fundingGoal) return false;
    if (filters.fundingStatus === 'in-progress' && project.fundingRaised >= project.fundingGoal) return false;
    
    // Apply genre filter
    if (filters.genre !== 'all' && project.genre !== filters.genre) return false;
    
    // Apply search term
    if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !project.director.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const calculateReturn = () => {
    if (!investmentAmount || isNaN(investmentAmount) || investmentAmount <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }
    
    // Simple calculation for demonstration purposes
    // In a real app, this would be more complex based on the project's financial model
    const amount = parseFloat(investmentAmount);
    const projectedReturnRate = selectedProject.projectedReturn.split('-').map(rate => parseFloat(rate.replace('%', '')) / 100);
    const minReturn = amount * (1 + projectedReturnRate[0]);
    const maxReturn = amount * (1 + projectedReturnRate[1]);
    
    setCalculatedReturn({
      min: minReturn.toFixed(2),
      max: maxReturn.toFixed(2)
    });
    
    setError(null);
  };

  const handleInvest = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!investmentAmount || isNaN(investmentAmount) || investmentAmount <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }
    
    const amount = parseFloat(investmentAmount);
    
    if (amount > filmBalance) {
      setError("Insufficient balance");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, you would call the smart contract here
      // For now, we'll just simulate a successful investment
      
      setTimeout(() => {
        // Update the project's funding
        setProjects(prev => prev.map(project => {
          if (project.id === selectedProject.id) {
            return {
              ...project,
              fundingRaised: project.fundingRaised + amount,
              investors: project.investors + 1
            };
          }
          return project;
        }));
        
        // Show success message
        alert(`Successfully invested ${amount} FILM in ${selectedProject.title}`);
        
        // Reset form
        setInvestmentAmount('');
        setCalculatedReturn(null);
        
        // Close modal
        setShowProjectModal(false);
        setSelectedProject(null);
        setIsSubmitting(false);
      }, 2000);
      
    } catch (err) {
      console.error("Error investing:", err);
      setError("Investment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="indie-fund-container">
      {/* Section Header with Description - Separated from listings */}
      <div className="section-header">
        <h2 className="section-title">Indie Fund</h2>
        <p className="section-subtitle">
          Invest in the next generation of films and earn returns from box office success
        </p>
      </div>
      
      {/* Enhanced Filters Section */}
      <div className="filters-section">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search projects..."
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
          <option value="Feature Film">Feature Film</option>
          <option value="Documentary">Documentary</option>
          <option value="Short Film">Short Film</option>
          <option value="Animation">Animation</option>
        </select>
        
        <select
          className="filter-select"
          value={filters.fundingStatus}
          onChange={(e) => setFilters(prev => ({ ...prev, fundingStatus: e.target.value }))}
        >
          <option value="all">All Funding Status</option>
          <option value="funded">Fully Funded</option>
          <option value="in-progress">In Progress</option>
        </select>
        
        <select
          className="filter-select"
          value={filters.genre}
          onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
        >
          <option value="all">All Genres</option>
          <option value="Sci-Fi Drama">Sci-Fi Drama</option>
          <option value="Documentary">Documentary</option>
          <option value="Musical Drama">Musical Drama</option>
        </select>
      </div>
      
      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => {
            const fundingPercentage = Math.min(Math.round((project.fundingRaised / project.fundingGoal) * 100), 100);
            
            return (
              <div
                key={project.id}
                className="project-card"
                onClick={() => {
                  setSelectedProject(project);
                  setShowProjectModal(true);
                  setActiveTab('overview');
                  setInvestmentAmount('');
                  setCalculatedReturn(null);
                  setError(null
