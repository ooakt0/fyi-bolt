import React, { useEffect, useState } from 'react';
import { Search, Filter, Zap, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIdeasStore } from '../store/authStore/ideasStore';
import IdeaCard from '../components/ideas/IdeaCard';

// Animated background component
const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, #030303 0%, #0a0a0a 50%, #030303 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          background: [
            'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </div>
  );
};

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

const Ideas: React.FC = () => {
  const { ideas, loading, error, fetchIdeas } = useIdeasStore();
  const [searchText, setSearchText] = useState('');
  
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
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="relative z-10 pt-32 pb-16">
        <div className="container-custom">
          {/* Header Section */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8" hover={false}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <motion.h1 
                    className="text-4xl md:text-5xl font-bold mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Explore Ideas
                  </motion.h1>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Discover innovative projects seeking funding and support in our futuristic marketplace.
                  </p>
                </div>
                
                {/* Search Bar */}
                <motion.div 
                  className="relative lg:w-96"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search ideas by name..."
                      className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {searchText ? (
                      <motion.button
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    ) : (
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5 text-blue-400" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Results Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Globe className="mr-3 h-6 w-6 text-blue-400" />
                  {filteredIdeas.length} {filteredIdeas.length === 1 ? 'result' : 'results'}
                  {searchText && (
                    <span className="ml-2 text-lg text-gray-400">
                      for "{searchText}"
                    </span>
                  )}
                </h2>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-6 w-6 text-purple-400" />
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Ideas Grid */}
          {loading ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-12" hover={false}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Zap className="h-12 w-12 text-blue-400" />
                </motion.div>
                <p className="text-xl text-gray-300">Loading innovative ideas...</p>
              </GlassCard>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-12" hover={false}>
                <p className="text-xl text-red-400">{error}</p>
              </GlassCard>
            </motion.div>
          ) : filteredIdeas.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {filteredIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="h-full">
                    <IdeaCard idea={idea} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-12" hover={false}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <Search className="h-16 w-16 text-gray-400 mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">No ideas match your search</h3>
                <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                  Try adjusting your search criteria to discover the perfect idea to invest in.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button 
                    onClick={() => setSearchText('')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    Reset search
                  </button>
                </motion.div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ideas;