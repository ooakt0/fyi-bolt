export interface User {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'investor';
  profileImage?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  creatorId: string;
  creatorName: string;
  fundingGoal: number;
  currentFunding: number;
  createdAt: string;
  imageUrl: string;
  tags: string[];
  stage: 'concept' | 'prototype' | 'mvp' | 'growth';
  approved: boolean;
}

export interface IdeasStore {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
  fetchIdeas: () => Promise<void>;
  refreshIdeas: () => Promise<void>;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
