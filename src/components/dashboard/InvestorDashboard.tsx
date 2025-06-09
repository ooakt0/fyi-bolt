import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookmarkPlus, DollarSign, Briefcase, TrendingUp, ArrowRight, Zap, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../store/authStore/supabaseClient';
import { getMessagesForUser } from '../../data/mockData';
import IdeaCard from '../ideas/IdeaCard';
import { useIdeasStore } from '../../store/authStore/ideasStore';

const MotionLink = motion(Link);

// Glassmorphism card component
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      whileHover={hover ? {
        scale: 1.02,
        boxShadow: '0 12px 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
      } : undefined}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const InvestorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { ideas, loading, fetchIdeas } = useIdeasStore();
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showInvestments, setShowInvestments] = useState(false);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loadingInvestments, setLoadingInvestments] = useState(false);

  const userMessages = user ? getMessagesForUser(user.id) : [];

  useEffect(() => {
    if (ideas.length === 0) fetchIdeas();
  }, [ideas.length, fetchIdeas]);

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

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;
      setLoadingInvestments(true);
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('invested_by', user.id);
      if (!error && data) {
        setInvestments(data);
      }
      setLoadingInvestments(false);
    };
    fetchInvestments();
  }, [user]);

  const handleToggleSave = async (ideaId: string) => {
    if (!user) return;
    const isAlreadySaved = savedIdeas.some((idea) => idea.id === ideaId);
    if (isAlreadySaved) {
      await supabase
        .from('saved_ideas')
        .delete()
        .eq('investor_id', user.id)
        .eq('idea_id', ideaId);
    } else {
      await supabase.from('saved_ideas').insert([
        { investor_id: user.id, idea_id: ideaId }
      ]);
    }
    const { data } = await supabase
      .from('saved_ideas')
      .select('idea_id, ideas(*)')
      .eq('investor_id', user.id);
    if (data) setSavedIdeas(data.map((row: any) => row.ideas));
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = searchText === '' || idea.title.toLowerCase().includes(searchText.toLowerCase());
    return idea.approved && matchesSearch;
  });

  const clearSearch = () => {
    setSearchText('');
  };

  const investedIdeas = ideas.filter(idea =>
    investments.some(investment => investment.idea_id === idea.id)
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setShowInvestments(false);
  };

  const metrics = [
    {
      icon: Briefcase,
      label: 'Available Ideas',
      value: ideas.length.toString(),
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: DollarSign,
      label: 'Avg. Funding Goal',
      value: ideas.length > 0 ? `$${Math.round(ideas.reduce((sum, idea) => sum + idea.fundingGoal, 0) / ideas.length).toLocaleString()}` : '$0',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      label: 'Messages Sent',
      value: userMessages.filter(msg => msg.senderId === user?.id).length.toString(),
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* ───────── Search Section ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 w-full" hover={false}>
          <div className="flex flex-col md:flex-row md:items-center">
            {/* ─── Search input (takes all free space) ─── */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Search ideas by name..."
                className="
            block w-full pl-12 pr-12 py-3
            bg-white/5 backdrop-blur-xl
            border border-white/20 rounded-xl
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            sm:text-sm transition-all duration-300
          "
              />
              {/* search icon – centred */}
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

              {searchText ? (
                <motion.button
                  onClick={clearSearch}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </motion.button>
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute right-4 inset-y-0 my-auto flex items-center justify-center"
                >
                  <Zap className="h-5 w-5 text-blue-400" />
                </motion.div>
              )}
            </div>

            {/* ─── Saved Ideas button (now RIGHT) ─── */}
            <MotionLink
              to="/ideas/saved"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
          group inline-flex items-center
          px-6 py-3 mt-6 md:mt-0 md:ml-6
          rounded-xl border border-white/20
          bg-white/5 backdrop-blur-xl
          text-white transition-all duration-300
          hover:bg-white/10
          hover:shadow-[0_0_12px_rgba(0,255,255,0.8)]
        "
            >
              <motion.span
                animate={{ rotate: [0, -20, 20, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="mr-2 flex"
              >
                <BookmarkPlus className="h-5 w-5 text-blue-400" />
              </motion.span>
              Saved&nbsp;Ideas
            </MotionLink>
          </div>
        </GlassCard>
      </motion.div>





      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center">
                <motion.div
                  className={`p-3 rounded-xl bg-gradient-to-r ${metric.gradient}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <metric.icon className="h-6 w-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">{metric.label}</p>
                  <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Investment Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <GlassCard className="p-8" hover={false}>
          <motion.button
            onClick={() => setShowInvestments(!showInvestments)}
            className="text-2xl font-bold text-white flex items-center group"
            whileHover={{ x: 5 }}
          >
            {showInvestments ? 'Hide Investment' : 'Check Investment'}
            <motion.span
              className="ml-3"
              animate={{ rotate: showInvestments ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.button>

          {showInvestments && investedIdeas.length > 0 && (
            <motion.div
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.6 }}
            >
              {investedIdeas.map((idea, index) => {
                const investment = investments.find(inv => inv.idea_id === idea.id);
                return (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <IdeaCard
                      idea={idea}
                      additionalInfo={investment ? {
                        investedAmount: investment.invested_amount ? `$${Number(investment.invested_amount).toLocaleString()}` : undefined,
                        investedDate: investment.invested_date,
                        invoiceLink: investment.invoice_link,
                      } : undefined}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </GlassCard>
      </motion.div>

      {/* Ideas Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <GlassCard className="p-8" hover={false}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Ideas for You</h2>
            <Link
              to="/ideas"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group"
            >
              Explore All Ideas
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Globe className="h-12 w-12 text-blue-400" />
              </motion.div>
              <p className="text-gray-300 text-lg">Loading ideas...</p>
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <IdeaCard
                    idea={idea}
                    onSave={() => handleToggleSave(idea.id)}
                    isSaved={!!savedIdeas.find((saved) => saved.id === idea.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Search className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">No ideas match your filters</h3>
              <p className="text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
                Try adjusting your search or filter criteria to find the perfect idea to invest in.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => {
                    setSearchText('');
                  }}
                  className="btn btn-primary"
                >
                  Reset filters
                </button>
              </motion.div>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Hot Ideas Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <GlassCard className="p-8" hover={false}>
          <h2 className="text-2xl font-bold text-white mb-8">Trending Ideas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas
              .sort((a, b) => (b.currentFunding / b.fundingGoal) - (a.currentFunding / a.fundingGoal))
              .slice(0, 3)
              .map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <IdeaCard
                    idea={idea}
                    trending
                    onSave={() => handleToggleSave(idea.id)}
                    isSaved={!!savedIdeas.find((saved) => saved.id === idea.id)}
                  />
                </motion.div>
              ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default InvestorDashboard;