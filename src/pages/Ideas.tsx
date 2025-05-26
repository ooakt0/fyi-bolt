import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useIdeasStore } from '../store/authStore/ideasStore';
import IdeaCard from '../components/ideas/IdeaCard';

const Ideas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const { ideas, loading, error, fetchIdeas } = useIdeasStore();

  useEffect(() => {
    if (ideas.length === 0) fetchIdeas();
  }, [ideas.length, fetchIdeas]);

  // Get unique categories and stages for filters
  const categories = ['all', ...new Set(ideas.map(idea => idea.category))];
  const stages = ['all', ...new Set(ideas.map(idea => idea.stage))];
  
  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = searchTerm === '' || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || idea.category === categoryFilter;
    const matchesStage = stageFilter === 'all' || idea.stage === stageFilter;
    
    return idea.approved && matchesSearch && matchesCategory && matchesStage;
  });
  
  // Sort ideas
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'funding':
        return b.currentFunding - a.currentFunding;
      case 'progress':
        return (b.currentFunding / b.fundingGoal) - (a.currentFunding / a.fundingGoal);
      default:
        return 0;
    }
  });
  
  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Ideas</h1>
          <p className="text-gray-600">Discover innovative projects seeking funding and support.</p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search ideas..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select"
              >
                <option value="newest">Newest</option>
                <option value="funding">Most Funded</option>
                <option value="progress">Funding Progress</option>
              </select>
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="select"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(c => c !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="stage-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  id="stage-filter"
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
              
              <div className="sm:col-span-2 flex items-end justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setStageFilter('all');
                    setSortBy('newest');
                  }}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {sortedIdeas.length} {sortedIdeas.length === 1 ? 'result' : 'results'}
          </h2>
        </div>
        
        {/* Ideas Grid */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">Loading ideas...</div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm text-red-500">{error}</div>
        ) : sortedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any ideas matching your search criteria. 
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;