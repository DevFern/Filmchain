import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const CommunityVoiceSection = () => {
  const { account, error: walletError } = useWallet();
  
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Sustainable Film Production Initiative",
      author: "EcoFilm Collective",
      description: "Implementing green practices in film production to reduce environmental impact.",
      category: "Sustainability",
      votes: {
        up: 156,
        down: 23
      },
      status: "Active",
      deadline: "2024-06-30",
      comments: [
        {
          id: 1,
          author: "GreenDirector",
          text: "We've successfully implemented similar practices in our last production, reducing waste by 60%.",
          timestamp: "2024-03-15T10:30:00",
          likes: 45
        },
        {
          id: 2,
          author: "ProductionPro",
          text: "Would love to see specific guidelines for different department heads.",
          timestamp: "2024-03-16T15:20:00",
          likes: 28
        }
      ],
      milestones: [
        { title: "Proposal Submission", completed: true },
        { title: "Community Review", completed: true },
        { title: "Implementation Plan", completed: false },
        { title: "Pilot Program", completed: false }
      ]
    },
    {
      id: 2,
      title: "Emerging Filmmakers Mentorship Program",
      author: "Film Education Alliance",
      description: "Connecting experienced filmmakers with emerging talent for year-long mentorship.",
      category: "Education",
      votes: {
        up: 234,
        down: 12
      },
      status: "Active",
      deadline: "2024-07-15",
      comments: [
        {
          id: 1,
          author: "MentorMatch",
          text: "This could revolutionize how we nurture new talent in the industry.",
          timestamp: "2024-03-14T09:15:00",
          likes: 67
        }
      ],
      milestones: [
        { title: "Program Structure", completed: true },
        { title: "Mentor Recruitment", completed: false },
        { title: "Participant Selection", completed: false },
        { title:
