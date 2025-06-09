import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, DollarSign, MessageSquare, TrendingUp, Users, Edit, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../store/authStore/supabaseClient';
import IdeaCard from '../ideas/IdeaCard';

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

interface CreatorDashboardProps {
  userIdeas: any[];
  loadingIdeas: boolean;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ userIdeas, loadingIdeas }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !userIdeas.length) {
        setMessages([]);
        setLoadingMessages(false);
        return;
      }
      const ideaIds = userIdeas.map((idea) => idea.id);
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id (id, name), idea:idea_id (id, title)')
        .in('idea_id', ideaIds)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setMessages(data);
      } else {
        setMessages([]);
      }
      setLoadingMessages(false);
    };
    fetchMessages();
  }, [user, userIdeas]);

  const unreadMessages = messages.filter(msg => !msg.read);
  const totalFunding = userIdeas.reduce((sum, idea) => sum + (idea.currentFunding || 0), 0);
  const creatorIdeas = userIdeas.filter(idea => idea.creatorId === user?.id);

  const metrics = [
    {
      icon: TrendingUp,
      label: 'Total Funding',
      value: `$${totalFunding.toLocaleString()}`,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: DollarSign,
      label: 'Active Ideas',
      value: userIdeas.length.toString(),
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: MessageSquare,
      label: 'Unread Messages',
      value: unreadMessages.length.toString(),
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8" hover={false}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h2>
              <p className="text-gray-300 text-lg">Manage your ideas and check your funding status</p>
            </div>
            <div className="mt-6 md:mt-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/ideas/new" 
                  className="btn btn-primary inline-flex items-center px-6 py-3"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Idea
                </Link>
              </motion.div>
            </div>
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
      
      {/* Ideas Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <GlassCard className="p-8" hover={false}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Your Ideas</h2>
            <Link 
              to="/ideas" 
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Explore All Ideas
            </Link>
          </div>
          
          {loadingIdeas ? (
            <div className="text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Zap className="h-12 w-12 text-blue-400" />
              </motion.div>
              <p className="text-gray-300 text-lg">Loading your ideas...</p>
            </div>
          ) : creatorIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creatorIdeas.map((idea, index) => (
                <motion.div 
                  key={idea.id} 
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <IdeaCard idea={idea} />
                  {!idea.approved && (
                    <>
                      <motion.span 
                        className="absolute top-3 right-3 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xl"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Pending Approval
                      </motion.span>
                      <motion.button
                        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-4 py-2 rounded-xl shadow-lg hover:shadow-blue-500/25 z-10"
                        style={{ pointerEvents: 'auto' }}
                        onClick={() => navigate(`/ideas/edit/${idea.id}`)}
                        title="Edit Idea"
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="h-3 w-3 mr-1 inline" />
                        Edit
                      </motion.button>
                    </>
                  )}
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
                <PlusCircle className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">No ideas yet</h3>
              <p className="text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
                You haven't created any ideas yet. Click the button below to get started and share your vision!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/ideas/new" className="btn btn-primary">
                  Create your first idea
                </Link>
              </motion.div>
            </div>
          )}
        </GlassCard>
      </motion.div>
      
      {/* Recent Messages Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <GlassCard className="p-8" hover={false}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Recent Messages</h2>
            <Link 
              to="/messages" 
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all
            </Link>
          </div>
          
          {loadingMessages ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </motion.div>
              <p className="text-gray-300">Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.slice(0, 3).map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    !message.read 
                      ? 'bg-blue-500/10 border-blue-500/30' 
                      : 'bg-white/5 border-white/10'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-white">
                        From: {message.sender?.name || 'Investor'}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        About: <span className="font-semibold text-blue-400">{message.idea?.title || 'Idea'}</span>
                      </p>
                      <p className="text-sm text-gray-300 mb-2">{message.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()} at {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <MessageSquare className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-2">No messages yet</h3>
              <p className="text-gray-300 text-sm">
                When investors contact you about your ideas, messages will appear here.
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default CreatorDashboard;