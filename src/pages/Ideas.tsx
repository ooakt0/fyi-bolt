import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useIdeasStore } from '../store/authStore/ideasStore';
import IdeaCard from '../components/ideas/IdeaCard';

const Ideas: React.FC = () => {
  // Fetch ideas from the store
  // and handle loading and error states
  const { ideas, loading, error, fetchIdeas } = useIdeasStore();
  const [searchText, setSearchText] = useState('');
  
  
  // Clear search text
  const clearSearch = () => {
    setSearchText('');
  };

  useEffect(() => {
    if (ideas.length === 0) fetchIdeas();
  }, [ideas.length, fetchIdeas]);

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = searchText === '' || idea.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Ideas</h1>
              <p className="text-gray-600">Discover innovative projects seeking funding and support.</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search ideas by name..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {searchText ? (
                  <button
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                ) : (
                  <Search className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredIdeas.length} {filteredIdeas.length === 1 ? 'result' : 'results'}
          </h2>
        </div>
        {/* Ideas Grid */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">Loading ideas...</div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm text-red-500">{error}</div>
        ) : filteredIdeas.length > 0 ? (
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
                  setSearchText('');
                }}
                className="btn btn-primary"
              >
                Reset search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;