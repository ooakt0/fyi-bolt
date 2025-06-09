import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../store/authStore/supabaseClient';
import IdeaCard from '../components/ideas/IdeaCard';
import { BookmarkPlus, ArrowLeft, Zap } from 'lucide-react';

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

const SavedIdeas: React.FC = () => {
  const { user } = useAuthStore();
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedIdeas = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_ideas')
        .select('idea_id, ideas(*)')
        .eq('investor_id', user.id);
      if (!error && data) {
        setSavedIdeas(data.map((row: any) => row.ideas));
      }
      setLoading(false);
    };
    fetchSavedIdeas();
  }, [user]);

  const handleToggleSave = async (ideaId: string) => {
    if (!user || user.role !== 'investor') {
      alert('You must be logged in as an investor to save ideas.');
      return;
    }
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

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="relative z-10 pt-32 pb-16">
        <div className="container-custom">
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8" hover={false}>
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1 
                    className="text-4xl md:text-5xl font-bold mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Saved Ideas
                  </motion.h1>
                  <p className="text-xl text-gray-300">Your bookmarked ideas for future investment</p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <BookmarkPlus className="h-12 w-12 text-blue-400" />
                </motion.div>
              </div>
              
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  Back to dashboard
                </motion.button>
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* Content */}
          {loading ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-16" hover={false}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <Zap className="h-16 w-16 text-blue-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Loading saved ideas...</h2>
                <p className="text-gray-300">Please wait while we fetch your bookmarked ideas</p>
              </GlassCard>
            </motion.div>
          ) : savedIdeas.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {savedIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <IdeaCard
                    idea={idea}
                    isSaved
                    onSave={() => handleToggleSave(idea.id)}
                  />
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
              <GlassCard className="p-16" hover={false}>
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-8"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <BookmarkPlus className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">No saved ideas yet</h3>
                <p className="text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
                  Click the bookmark icon on any idea to save it for later. Your saved ideas will appear here.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    onClick={() => window.location.href = '/ideas'}
                    className="btn btn-primary"
                  >
                    Explore Ideas
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

export default SavedIdeas;