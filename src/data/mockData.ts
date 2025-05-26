import { Idea, Message } from '../types';

export const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'EcoTrack - Sustainable Living App',
    description: 'An app that helps users track and reduce their carbon footprint through daily lifestyle choices. Features include carbon calculator, eco-challenges, and community sharing.',
    category: 'Mobile App',
    creatorId: '1',
    creatorName: 'John Creator',
    fundingGoal: 50000,
    currentFunding: 15000,
    createdAt: '2023-11-15T10:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/3698534/pexels-photo-3698534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['sustainability', 'mobile', 'lifestyle', 'eco-friendly'],
    stage: 'prototype',
    approved: false,
  },
  {
    id: '2',
    title: 'HealthBuddy - AI Health Assistant',
    description: 'An AI-powered health assistant that provides personalized health recommendations, medication reminders, and connects users with healthcare professionals.',
    category: 'Healthcare',
    creatorId: '3',
    creatorName: 'Maria Health',
    fundingGoal: 75000,
    currentFunding: 45000,
    createdAt: '2023-10-20T14:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/8376566/pexels-photo-8376566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    stage: 'mvp',
    approved: false,
  },
  {
    id: '3',
    title: 'LocalEats - Support Local Restaurants',
    description: 'A platform connecting food enthusiasts with local, independent restaurants. Features include discovery, reviews, and special deals from nearby establishments.',
    category: 'Food & Beverage',
    creatorId: '4',
    creatorName: 'Alex Foodie',
    fundingGoal: 35000,
    currentFunding: 8000,
    createdAt: '2023-12-05T09:15:00Z',
    stage: 'concept',
    approved: false,
  },
  {
    id: '4',
    title: 'LearnQuest - Interactive Educational Platform',
    description: 'An interactive learning platform that gamifies education for K-12 students. The platform adapts to each student\'s learning style and pace.',
    category: 'Education',
    creatorId: '5',
    creatorName: 'Emily Educator',
    fundingGoal: 60000,
    currentFunding: 42000,
    stage: 'growth',
    approved: false,
    createdAt: '2023-09-10T11:20:00Z',
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['education', 'interactive', 'gamification', 'k-12'],
  },
  {
    id: '5',
    title: 'RemoteCollab - Virtual Team Workspace',
    description: 'A virtual workspace platform designed for remote teams, featuring real-time collaboration tools, project management, and team-building activities.',
    category: 'Productivity',
    creatorId: '6',
    creatorName: 'David Developer',
    fundingGoal: 55000,
    currentFunding: 25000,
    createdAt: '2023-10-30T16:10:00Z',
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['remote work', 'collaboration', 'productivity', 'saas'],
    stage: 'prototype',
    approved: false,
  },
  {
    id: '6',
    title: 'GreenCommute - Sustainable Transportation Network',
    description: 'A platform that encourages and facilitates sustainable commuting options, including carpooling, bike-sharing, and public transit optimization.',
    category: 'Transportation',
    creatorId: '7',
    creatorName: 'Lisa Commuter',
    fundingGoal: 40000,
    currentFunding: 12000,
    createdAt: '2023-11-25T13:50:00Z',
    imageUrl: 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['transportation', 'sustainability', 'urban mobility', 'sharing economy'],
    stage: 'concept',
    approved: false,
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hi, I\'m really interested in your EcoTrack app. Could you tell me more about your monetization strategy?',
    timestamp: '2023-11-20T09:45:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'Thanks for your interest! We plan to use a freemium model with premium features for businesses and eco-conscious consumers. Would you like to see our business plan?',
    timestamp: '2023-11-20T10:15:00Z',
    read: true,
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: 'That sounds promising. Yes, I\'d love to see the business plan and discuss potential investment opportunities.',
    timestamp: '2023-11-20T10:30:00Z',
    read: true,
  },
  {
    id: '4',
    senderId: '1',
    receiverId: '2',
    content: 'Great! I\'ll prepare a detailed document and share it with you by tomorrow. Looking forward to your feedback.',
    timestamp: '2023-11-20T10:45:00Z',
    read: false,
  },
];

// Helper function to get ideas by creator
export const getIdeasByCreator = (creatorId: string): Idea[] => {
  return mockIdeas.filter(idea => idea.creatorId === creatorId);
};

// Helper function to get messages for a user
export const getMessagesForUser = (userId: string): Message[] => {
  return mockMessages.filter(msg => msg.senderId === userId || msg.receiverId === userId);
};