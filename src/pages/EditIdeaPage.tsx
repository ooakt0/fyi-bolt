import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import IdeaForm from './IdeaForm';
import { supabase } from '../store/authStore/supabaseClient';
import { Zap } from 'lucide-react';

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
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {children}
    </motion.div>
  );
};

const EditIdeaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchIdea = async () => {
      const { data, error } = await supabase.from('ideas').select('*').eq('id', id).single();
      if (!error && data) setIdea(data);
      setLoading(false);
    };
    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <GlassCard className="p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Zap className="h-12 w-12 text-blue-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading idea...</h2>
            <p className="text-gray-300">Please wait while we fetch the idea details</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <GlassCard className="p-12 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Idea not found</h2>
            <p className="text-gray-300">The idea you're looking for doesn't exist or has been removed.</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return <IdeaForm ideaToEdit={idea} />;
};

export default EditIdeaPage;