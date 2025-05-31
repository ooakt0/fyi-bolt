import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookmarkPlus, DollarSign, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../store/authStore/supabaseClient';
import { getMessagesForUser } from '../../data/mockData';
import IdeaCard from '../ideas/IdeaCard';
import { useIdeasStore } from '../../store/authStore/ideasStore';

const InvestorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { ideas, loading, fetchIdeas } = useIdeasStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showInvestments, setShowInvestments] = useState(false);

  // Mock investment data
  const mockInvestments = [
    {
      ideaId: '1',//'b5a22b6a-25b1-499b-bde6-502f3f4d2090',
      investedAmount: '$5,000',
      investedDate: '2025-05-01',
      invoiceLink: '/path/to/invoice1.pdf',
    },
    {
      ideaId: '2',//'c1556d0a-284a-49fd-92cf-b94869374b9d',
      investedAmount: '$10,000',
      investedDate: '2025-04-15',
      invoiceLink: '/path/to/invoice2.pdf',
    },
  ];

  // Get messages
  const userMessages = user ? getMessagesForUser(user.id) : [];

  useEffect(() => {
    if (ideas.length === 0) fetchIdeas();
  }, [ideas.length, fetchIdeas]);

  // Fetch saved ideas for the investor
  useEffect(() => {
    const fetchSavedIdeas = async () => {
      if (!user) return;
      setLoadingSaved(true);
      const { data, error } = await supabase
        .from('saved_ideas')
        .select('idea_id, ideas(*)')
        .eq('investor_id', user.id);
      if (!error && data) {
        setSavedIdeas(data.map((row: any) => row.ideas));
      }
      setLoadingSaved(false);
    };
    fetchSavedIdeas();
  }, [user]);

  // Save/Unsave handler
  const handleToggleSave = async (ideaId: string) => {
    if (!user) return;
    const isAlreadySaved = savedIdeas.some((idea) => idea.id === ideaId);
    if (isAlreadySaved) {
      // Unsave: delete from saved_ideas
      await supabase
        .from('saved_ideas')
        .delete()
        .eq('investor_id', user.id)
        .eq('idea_id', ideaId);
    } else {
      // Save: insert into saved_ideas
      await supabase.from('saved_ideas').insert([
        { investor_id: user.id, idea_id: ideaId }
      ]);
    }
    // Refresh saved ideas
    const { data } = await supabase
      .from('saved_ideas')
      .select('idea_id, ideas(*)')
      .eq('investor_id', user.id);
    if (data) setSavedIdeas(data.map((row: any) => row.ideas));
  };

  // Update the filtering logic to use 'title' instead of 'name'
  const filteredIdeas = ideas.filter(idea => {
    const matchesCategory = categoryFilter === 'all' || idea.category === categoryFilter;
    const matchesStage = stageFilter === 'all' || idea.stage === stageFilter;
    const matchesSearch = searchText === '' || idea.title.toLowerCase().includes(searchText.toLowerCase());
    return idea.approved && matchesCategory && matchesStage && matchesSearch;
  });

  // Clear search text
  const clearSearch = () => {
    setSearchText('');
  };

  // Filter invested ideas based on mock investment data
  const investedIdeas = ideas.filter(idea =>
    mockInvestments.some(investment => investment.ideaId === idea.id)
  );

  // Search change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setShowInvestments(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome {user?.role.toUpperCase()}, {user?.name}!</h1>
            <p className="mt-1 text-gray-600">Discover promising ideas and find your next investment opportunity</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Link to="/ideas/saved" className="btn btn-outline inline-flex items-center">
              <BookmarkPlus className="mr-2 h-5 w-5" />
              Saved Ideas
            </Link>
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
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
              <h3 className="text-xl font-bold text-gray-900">{ideas.length}</h3>
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
                {ideas.length > 0 ? `$${Math.round(ideas.reduce((sum, idea) => sum + idea.fundingGoal, 0) / ideas.length).toLocaleString()}` : '$0'}
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
      
      {/* Investment Section */}
      <div className="bg-[#bee0ec] rounded-lg shadow-sm p-6">
        <button
          onClick={() => setShowInvestments(!showInvestments)}
          className="text-lg font-bold text-gray-900 flex items-center"
        >
          {showInvestments ? 'Hide Investment' : 'Check Investment'}
          <span className="ml-2">▼</span>
        </button>

        {showInvestments && investedIdeas.length > 0 && (
          <div className="bg-[#d3eaf2] rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {investedIdeas.map(idea => {
              const investment = mockInvestments.find(inv => inv.ideaId === idea.id);
              return (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  additionalInfo={{
                    investedAmount: investment?.investedAmount,
                    investedDate: investment?.investedDate,
                    invoiceLink: investment?.invoiceLink,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
      
      {/* Ideas Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ideas for You</h2>
          <Link to="/ideas" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            Explore All Ideas
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">Loading ideas...</div>
        ) : filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onSave={() => handleToggleSave(idea.id)}
                isSaved={!!savedIdeas.find((saved) => saved.id === idea.id)}
              />
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
                  setSearchText('');
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
          {ideas
            .sort((a, b) => (b.currentFunding / b.fundingGoal) - (a.currentFunding / a.fundingGoal))
            .slice(0, 3)
            .map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                trending
                onSave={() => handleToggleSave(idea.id)}
                isSaved={!!savedIdeas.find((saved) => saved.id === idea.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;