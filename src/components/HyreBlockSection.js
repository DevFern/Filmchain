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
  const [applicationFiles, setApplicationFiles] = useState({
    resume: null,
    portfolio: null
  });
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

    try
