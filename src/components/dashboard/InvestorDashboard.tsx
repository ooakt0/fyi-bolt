import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookmarkPlus, DollarSign, Briefcase, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { mockIdeas, getMessagesForUser } from '../../data/mockData';
import IdeaCard from '../ideas/IdeaCard';

const InvestorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  
  // Get messages
  const userMessages = user ? getMessagesForUser(user.id) : [];
  
  // Get ideas with filters
  const filteredIdeas = mockIdeas.filter(idea => {
    const matchesCategory = categoryFilter === 'all' || idea.category === categoryFilter;
    const matchesStage = stageFilter === 'all' || idea.stage === stageFilter;
    return matchesCategory && matchesStage;
  });
  
  // Get unique categories and stages for filters
  const categories = ['all', ...new Set(mockIdeas.map(idea => idea.category))];
  const stages = ['all', ...new Set(mockIdeas.map(idea => idea.stage))];
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-1 text-gray-600">Discover promising ideas and find your next investment opportunity</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/ideas/saved" className="btn btn-outline inline-flex items-center">
              <BookmarkPlus className="mr-2 h-5 w-5" />
              Saved Ideas
            </Link>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-primary-100 text-primary-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available Ideas</p>
              <h3 className="text-xl font-bold text-gray-900">{mockIdeas.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-secondary-100 text-secondary-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Funding Goal</p>
              <h3 className="text-xl font-bold text-gray-900">
                ${Math.round(mockIdeas.reduce((sum, idea) => sum + idea.fundingGoal, 0) / mockIdeas.length).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-accent-100 text-accent-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Messages Sent</p>
              <h3 className="text-xl font-bold text-gray-900">{userMessages.filter(msg => msg.senderId === user?.id).length}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search ideas by keyword..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">Filters:</span>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="select"
            >
              <option value="all">All Stages</option>
              {stages.filter(s => s !== 'all').map(stage => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Ideas Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ideas for You</h2>
        
        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No ideas match your filters</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find the perfect idea to invest in.
            </p>
            <div className="mt-6">
              <button 
                onClick={() => {
                  setCategoryFilter('all');
                  setStageFilter('all');
                }}
                className="btn btn-primary"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Hot Ideas Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Trending Ideas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockIdeas
            .sort((a, b) => b.currentFunding / b.fundingGoal - a.currentFunding / a.fundingGoal)
            .slice(0, 3)
            .map((idea) => (
              <IdeaCard key={idea.id} idea={idea} trending />
            ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;