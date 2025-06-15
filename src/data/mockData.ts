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
    tags: ['health', 'ai', 'assistant', 'personalized care'],
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
    imageUrl: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['food', 'local', 'restaurants', 'community'],
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

// Added missing properties to mockValidationResponse
export const mockValidationResponse = {
  id: "mock-id",
  idea_id: "mock-idea-id",
  created_at: "2025-06-10T00:00:00Z",
  updated_at: "2025-06-10T00:00:00Z",
  swot_analysis: {
    strengths: [
      "Comprehensive platform integrating discovery, reviews, and application submission",
      "AI-driven personalization enhances user experience and decision-making",
      "Multiple revenue streams (per-application fees + premium subscriptions)",
      "Real-time tracking and interactive dashboard improve user engagement",
      "Community features build trust through peer insights"
    ],
    weaknesses: [
      "High dependency on institutional participation for data accuracy",
      "Requires significant initial data collection and maintenance",
      "Potential chicken-egg problem: needing both students and institutions to attract each other",
      "Per-application revenue model may discourage price-sensitive institutions",
      "Limited differentiation from existing competitors in core features"
    ],
    opportunities: [
      "Growing global demand for higher education (projected 594M students by 2030)",
      "Expansion into vocational training and international student markets",
      "Partnerships with education ministries and scholarship providers",
      "Data monetization through anonymized analytics for institutions",
      "Integration with standardized testing platforms (SAT/ACT)"
    ],
    threats: [
      "Established competitors with larger user bases (e.g., Common App, Niche)",
      "Institutions developing proprietary application portals",
      "Data privacy regulations (GDPR, FERPA) increasing compliance costs",
      "Potential review bias or fake testimonials damaging credibility",
      "Economic downturns reducing education spending"
    ]
  },
  user_personas: [
    {
      name: "Aisha Khan",
      age: "17",
      occupation: "High School Student",
      goals: [
        "Find colleges matching academic interests",
        "Compare admission requirements efficiently",
        "Understand campus culture before applying"
      ],
      pain_points: [
        "Overwhelmed by fragmented information sources",
        "Difficulty assessing teaching quality pre-enrollment",
        "Tracking multiple application deadlines"
      ],
      motivations: [
        "Personalized recommendations saving research time",
        "Peer reviews from current students",
        "Single-platform application management"
      ]
    },
    {
      name: "Dr. Benjamin Wright",
      age: "48",
      occupation: "Admissions Director",
      goals: [
        "Attract qualified applicants efficiently",
        "Reduce marketing costs per applicant",
        "Improve demographic targeting"
      ],
      pain_points: [
        "High customer acquisition costs",
        "Inefficient manual application processing",
        "Difficulty standing out among peer institutions"
      ],
      motivations: [
        "Performance-based applicant sourcing",
        "Premium visibility packages",
        "Data insights on prospective students"
      ]
    },
    {
      name: "Maria Chen",
      age: "19",
      occupation: "International Transfer Student",
      goals: [
        "Find institutions with strong CS programs",
        "Compare international student support services",
        "Connect with current international students"
      ],
      pain_points: [
        "Lack of localized admission requirement information",
        "Unclear visa success rates by institution",
        "Difficulty assessing faculty quality remotely"
      ],
      motivations: [
        "Verified professor reviews",
        "Peer forums for international students",
        "Application fee waivers through platform"
      ]
    }
  ],
  market_analysis: {
    market_size: "Global higher education market valued at $2.2T (2023), with 200M+ prospective students annually",
    target_segments: [
      "College-bound high school students (primary)",
      "Graduate/professional program seekers",
      "International students ($100B+ segment)",
      "Education institutions seeking enrollment growth",
      "Career changers exploring vocational programs"
    ],
    competition: [
      { name: "Common App", strengths: ["application focus"], weaknesses: ["limited discovery"] },
      { name: "Niche", strengths: ["reviews heavy"], weaknesses: ["weak application integration"] },
      { name: "Cappex", strengths: ["scholarship focus"], weaknesses: ["declining market share"] }
    ],
    opportunities: [
      "Monetizing international student recruitment (high-value segment)",
      "Corporate partnerships for sponsored scholarships",
      "Mobile-first expansion in emerging markets",
      "AI-enhanced predictive enrollment tools for institutions",
      "Integration with financial aid/scholarship databases"
    ],
    risks: [
      "High user acquisition costs in saturated markets",
      "Institutions bypassing platform with direct partnerships",
      "Algorithmic bias in recommendations creating legal exposure",
      "Free alternatives reducing conversion to paid services",
      "Ad-blocking technology limiting ad-based revenue potential"
    ]
  },
  investor_readiness_score: 68,
  recommendations: [
    "Develop proprietary data moat through exclusive institution partnerships",
    "Implement blockchain verification for reviews to combat credibility issues",
    "Pilot freemium model: free basic access + premium application support bundles",
    "Prioritize international student segment with localized content/partnerships",
    "Create institutional analytics dashboard as upsell product",
    "Secure pilot agreements with 3+ universities before full launch",
    "Allocate 30% of funding to initial user acquisition testing",
    "Explore integration with existing student information systems (e.g., Naviance)"
  ]
};

// Helper function to get ideas by creator
export const getIdeasByCreator = (creatorId: string): Idea[] => {
  return mockIdeas.filter(idea => idea.creatorId === creatorId);
};

// Helper function to get messages for a user
export const getMessagesForUser = (userId: string): Message[] => {
  return mockMessages.filter(msg => msg.senderId === userId || msg.receiverId === userId);
};