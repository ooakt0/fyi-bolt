import React, { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import CreatorDashboard from '../components/dashboard/CreatorDashboard';
import InvestorDashboard from '../components/dashboard/InvestorDashboard';
import { useIdeasStore } from '../store/authStore/ideasStore';
import { Zap, Sparkles } from 'lucide-react';

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

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { ideas, loading, fetchIdeas } = useIdeasStore();

  useEffect(() => {
    if (ideas.length === 0) fetchIdeas();
  }, [ideas.length, fetchIdeas]);

  // Only show ideas created by the current user
  const userIdeas = useMemo(
    () => (user ? ideas.filter((idea) => idea.creatorId === user.id) : []),
    [ideas, user]
  );

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

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
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
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
                    Dashboard
                  </motion.h1>
                  <p className="text-xl text-gray-300">
                    Welcome to your {user?.role} dashboard, {user?.name}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  {user?.role === 'creator' ? (
                    <Sparkles className="h-12 w-12 text-blue-400" />
                  ) : (
                    <Zap className="h-12 w-12 text-purple-400" />
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {user?.role === 'creator' ? (
              <CreatorDashboard userIdeas={userIdeas} loadingIdeas={loading} />
            ) : (
              <InvestorDashboard />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;