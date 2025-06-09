import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import { useAuthStore } from '../store/authStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore/supabaseClient';
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

const Login: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for access_token in URL hash (for Supabase email confirmation)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      setChecking(true);
      // Supabase will automatically handle the session, just wait for auth state
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          setChecking(false);
          navigate('/dashboard', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          setChecking(false);
          setError('Session expired or invalid. Please log in again.');
        }
      });
      // Also check session directly in case already set
      supabase.auth.getSession().then(async ({ data, error }) => {
        if (data?.session && data.session.user) {
          setChecking(false);
          navigate('/dashboard', { replace: true });
        } else if (error?.message === "Session from session_id claim in JWT does not exist") {
          setChecking(false);
          setError('Session not found. Logging out...');
          await useAuthStore.getState().logout(); // Log the user out
        } else if (error) {
          setChecking(false);
          setError('Could not complete sign in. Please try again.');
        }
      });
      return () => {
        listener?.subscription.unsubscribe();
      };
    }
  }, [navigate]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (checking) {
    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Zap className="h-12 w-12 text-blue-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Completing sign in...</h2>
            <p className="text-gray-300">Please wait while we verify your credentials</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div 
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-6"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            
            <h1 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Welcome Back
            </h1>
            <p className="text-gray-300">Sign in to continue your innovation journey</p>
          </motion.div>

          {error && (
            <motion.div 
              className="mb-6 p-4 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {error}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <LoginForm />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;