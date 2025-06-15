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
  stage: 'concept' | 'prototype' | 'mvp' | 'growth' | 'production';
  approved: boolean;
  about_this_idea?: string;
  key_features?: string[];
  market_opportunity?: string;
  supporting_doc?: string;
  supporting_doc_url?: string;
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

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface UserPersona {
  name: string;
  age: string;
  occupation: string;
  pain_points: string[];
  goals: string[];
  motivations: string[];
}

export interface MarketAnalysis {
  market_size: string;
  target_segments: string[];
  competition: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  opportunities: string[];
  risks: string[];
}

export interface IdeaValidation {
  id: string;
  idea_id: string;
  swot_analysis: SWOTAnalysis;
  user_personas: UserPersona[];
  market_analysis: MarketAnalysis;
  investor_readiness_score: number;
  recommendations: string[];
  created_at: string;
  updated_at: string;
}

export interface AIValidationResponse {
  validation: IdeaValidation;
  success: boolean;
  message?: string;
}

export interface IdeaData {
  title: string;
  description: string;
  aboutThisIdea: string;
  keyFeatures: string;
  marketOpportunity: string;
  category: string;
  fundingGoal: number;
  stage: 'concept' | 'prototype' | 'mvp' | 'growth' | 'production';
  tags: string[];
}