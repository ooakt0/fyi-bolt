import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, DollarSign, MessageSquare, Bookmark, Calendar, BarChart, Tag, AlertCircle, ArrowLeft, Zap, Globe, Star } from 'lucide-react';
import { Facebook, Instagram, Twitter, Linkedin, Copy } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../store/authStore/supabaseClient';
import ValidationResults from '../components/ideas/ValidationResults';
import { IdeaData, IdeaValidation } from '../types';
import AIValidationStep from '../components/ideas/AIValidationStep';

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

const IdeaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [idea, setIdea] = useState<any>(location.state?.idea || null);
  const [loading, setLoading] = useState(!location.state?.idea);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [validation, setValidation] = useState<IdeaValidation | null>(null);
  const [ideaData, setIdeaData] = useState<IdeaData | null>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!idea && id) {
        setLoading(true);
        const { data } = await supabase.from('ideas').select('*').eq('id', id).single();
        if (data) setIdea(data);
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id, idea]);

  useEffect(() => {
    const fetchSavedIdeas = async () => {
      if (!user || user.role !== 'investor') return;
      const { data, error } = await supabase
        .from('saved_ideas')
        .select('idea_id')
        .eq('investor_id', user.id);
      if (!error && data) {
        setSavedIdeas(data.map((row: any) => row.idea_id));
      }
    };
    fetchSavedIdeas();
  }, [user]);

  useEffect(() => {
    const fetchPaymentLink = async () => {
      if (!idea?.id) return;

      const { data, error } = await supabase
        .from('payment_links')
        .select('*')
        .eq('idea_id', idea.id)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setPaymentLink(data);
      }
    };

    if (idea?.id) {
      fetchPaymentLink();
    }
  }, [idea?.id]);

  useEffect(() => {
    const fetchValidationAndIdeaData = async () => {
      try {
        const { data: validationData, error: validationError } = await supabase
          .from('idea_validations')
          .select('*')
          .eq('idea_id', id)
          .single();

        if (validationError) {
          console.error('Error fetching validation:', validationError);
        } else {
          setValidation(validationData);
        }

        const { data: ideaDataResult, error: ideaDataError } = await supabase
          .from('ideas')
          .select('*')
          .eq('id', id)
          .single();

        if (ideaDataError) {
          console.error('Error fetching idea data:', ideaDataError);
        } else {
          setIdeaData(ideaDataResult);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchValidationAndIdeaData();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user || user.role !== 'investor') {
      alert('You must be logged in as an investor to save ideas.');
      return;
    }
    setSaving(true);
    const isAlreadySaved = idea && savedIdeas.includes(idea.id);
    if (isAlreadySaved) {
      await supabase
        .from('saved_ideas')
        .delete()
        .eq('investor_id', user.id)
        .eq('idea_id', idea.id);
    } else if (idea) {
      await supabase.from('saved_ideas').insert([
        { investor_id: user.id, idea_id: idea.id }
      ]);
    }
    const { data } = await supabase
      .from('saved_ideas')
      .select('idea_id')
      .eq('investor_id', user.id);
    if (data) setSavedIdeas(data.map((row: any) => row.idea_id));
    setSaving(false);
  };

  const handleInvestment = async () => {
    if (!user || user.role !== 'investor') {
      alert('You must be logged in as an investor to invest in ideas.');
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      if (!paymentLink) {
        const { data, error } = await supabase
          .from('payment_links')
          .select('*')
          .eq('idea_id', idea.id)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          throw new Error('Payment link not available for this idea');
        }

        setPaymentLink(data);
        window.open(data.payment_url, '_blank', 'noopener,noreferrer');
      } else {
        window.open(paymentLink.payment_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Unable to process payment at this time'
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!loading && !idea) {
    return <Navigate to="/ideas" />;
  }

  const fundingPercentage = idea && idea.fundingGoal ? Math.min(Math.round((idea.currentFunding / idea.fundingGoal) * 100), 100) : 0;
  const createdDate = idea?.createdAt ? new Date(idea.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'investor') {
      alert('You must be logged in as an investor to send messages.');
      return;
    }
    const recipientId = idea?.creatorId;
    if (!recipientId) {
      alert('Creator information not found.');
      return;
    }
    const { error } = await supabase.from('messages').insert([
      {
        idea_id: idea.id,
        sender_id: user.id,
        recipient_id: recipientId,
        content: message,
      },
    ]);
    if (error) {
      alert('Failed to send message. Please try again.');
      return;
    }
    alert('Message sent successfully!');
    setMessage('');
    setShowContactForm(false);
  };

  const shareUrl = idea ? window.location.origin + `/ideas/${idea.id}` : '';
  const shareText = idea ? `Check out this idea on Fund Your Idea: ${idea.title} - ${idea.about_this_idea}\nSee more: ${shareUrl}` : '';

  const handleShare = (platform: string) => {
    if (!idea) return;
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        alert('Instagram does not support direct web sharing. Copy the link and share it on your Instagram profile or story.');
        return;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        return;
      default:
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  React.useEffect(() => {
    if (!showShareMenu) return;
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById('share-menu');
      if (menu && !menu.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showShareMenu]);

  if (loading || !idea) {
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
            <p className="text-gray-300">Please wait while we fetch the details</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10 pt-32 pb-16">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8"> {/* Full width container */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8"> {/* Adjusted grid for column proportions */}
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8"> {/* 20% width */}
              {/* Funding Status */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="p-8" hover={false}>
                  <h3 className="text-xl font-bold text-white mb-6">Funding Status</h3>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-3xl font-bold text-white">${idea.currentFunding?.toLocaleString?.() ?? '0'}</span>
                        <span className="text-sm text-gray-400 ml-2">raised</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        of ${idea.fundingGoal?.toLocaleString?.() ?? '0'} goal
                      </div>
                    </div>

                    <div className="mt-4 w-full bg-gray-700/50 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${fundingPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>

                    <div className="mt-3 flex justify-between text-sm">
                      <span className="font-medium text-white">{fundingPercentage}% funded</span>
                    </div>
                  </div>

                  {/* Investment Button */}
                  {isAuthenticated && user?.role === 'investor' && (
                    <div className="space-y-4">
                      {paymentError && (
                        <motion.div
                          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-red-400 font-medium mb-1">Payment Error</p>
                              <p className="text-red-300">{paymentError}</p>
                              <p className="text-red-300 mt-2">
                                Please contact our support team at{' '}
                                <a
                                  href="mailto:support@fundyouridea.com"
                                  className="underline hover:text-red-200"
                                >
                                  support@fundyouridea.com
                                </a>{' '}
                                for further assistance.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.button
                        className="btn btn-primary w-full py-4"
                        onClick={handleInvestment}
                        disabled={paymentLoading}
                        whileHover={{ scale: paymentLoading ? 1 : 1.02 }}
                        whileTap={{ scale: paymentLoading ? 1 : 0.98 }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {paymentLoading ? 'Processing...' : 'Invest in this Idea'}
                      </motion.button>

                      {paymentLink && (
                        <p className="text-xs text-gray-400 text-center">
                          Secure payment powered by Fund Your Idea via {paymentLink.payment_provider}
                        </p>
                      )}
                    </div>
                  )}

                  {(!isAuthenticated || user?.role !== 'investor') && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={isAuthenticated ? '/dashboard' : '/signup'}
                        className="btn btn-primary w-full py-4"
                      >
                        {isAuthenticated ? 'Go to Dashboard' : 'Sign Up to Invest'}
                      </Link>
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>

              {/* Creator Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="p-8" hover={false}>
                  <h3 className="text-xl font-bold text-white mb-6">About the Creator</h3>

                  <div className="flex items-center mb-6">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mr-4"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {idea.creatorName?.charAt?.(0) || '?'}
                    </motion.div>
                    <div>
                      <p className="text-lg font-bold text-white">{idea.creatorName || 'Unknown'}</p>
                      <p className="text-sm text-gray-400">Creator</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                    Passionate entrepreneur with expertise in {idea.category?.toLowerCase?.() || 'unknown'} and a
                    vision to create impactful solutions for real-world problems.
                  </p>

                  {isAuthenticated && user?.role === 'investor' && !showContactForm && (
                    <motion.button
                      onClick={() => setShowContactForm(true)}
                      className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Contact Creator
                    </motion.button>
                  )}

                  {showContactForm && (
                    <motion.form
                      onSubmit={handleSubmitMessage}
                      className="mt-6 space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Message
                      </label>
                      <textarea
                        rows={4}
                        className="input resize-none"
                        placeholder="Hi, I'm interested in your idea..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                      <div className="flex space-x-3">
                        <motion.button
                          type="submit"
                          className="btn btn-primary flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Send Message
                        </motion.button>
                        <motion.button
                          type="button"
                          className="btn btn-outline flex-1"
                          onClick={() => setShowContactForm(false)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.form>
                  )}
                </GlassCard>
              </motion.div>

              {/* Idea Stats */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GlassCard className="p-8" hover={false}>
                  <div className="flex items-center mb-6">
                    <BarChart className="h-5 w-5 text-gray-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">Idea Stats</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Created on', value: createdDate || 'Unknown' },
                      { label: 'Category', value: idea.category || 'N/A' },
                      { label: 'Stage', value: idea.stage ? idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1) : 'N/A' },
                      { label: 'Time to market', value: '6-12 months' }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        className="flex justify-between items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <span className="text-sm text-gray-400">{stat.label}</span>
                        <span className="text-sm font-medium text-white">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Center Column */}
            <div className="lg:col-span-6 space-y-8"> {/* second column width */}

              <motion.div
                className="mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.button
                  onClick={() => {
                    if (location.key !== 'default') {
                      navigate(-1);
                    } else {
                      navigate('/ideas');
                    }
                  }}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  Back to ideas
                </motion.button>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="overflow-hidden" hover={false}>
                  <div className="relative">
                    <motion.img
                      src={idea.imageUrl || 'https://via.placeholder.com/600x300?text=No+Image'}
                      alt={idea.title || 'Idea'}
                      className="w-full h-64 md:h-80 object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="p-8">
                    <div className="flex flex-wrap gap-3 mb-6">
                      <motion.span
                        className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        {idea.category || 'Uncategorized'}
                      </motion.span>
                      <motion.span
                        className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        {idea.stage ? idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1) : 'N/A'}
                      </motion.span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{idea.title || 'Untitled Idea'}</h1>

                    <div className="flex items-center text-sm text-gray-400 mb-6">
                      <span>By {idea.creatorName || 'Unknown'}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{createdDate || 'Unknown date'}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-6">
                      {isAuthenticated && user?.role === 'investor' && (
                        <motion.button
                          onClick={() => setShowContactForm(true)}
                          className="btn btn-primary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Creator
                        </motion.button>
                      )}
                      <motion.button
                        className={`btn btn-outline flex items-center ${idea && savedIdeas.includes(idea.id) ? 'text-blue-400 border-blue-400/50' : ''}`}
                        onClick={handleToggleSave}
                        disabled={saving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bookmark className="h-4 w-4 mr-2" fill={idea && savedIdeas.includes(idea.id) ? 'currentColor' : 'none'} />
                        {idea && savedIdeas.includes(idea.id) ? 'Saved' : 'Save'}
                      </motion.button>
                      <div className="relative flex items-center">
                        <motion.button
                          className="btn btn-outline flex items-center"
                          onClick={() => setShowShareMenu((v) => !v)}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </motion.button>
                        {showShareMenu && (
                          <motion.div
                            id="share-menu"
                            className="absolute z-50 left-full bottom-1/2 -translate-y-1/2 ml-2 backdrop-blur-xl bg-black border border-white/30 rounded-xl shadow-2xl p-3 flex flex-col gap-2 min-w-[40px] overflow-visible"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {[
                              { platform: 'facebook', icon: Facebook, color: 'text-blue-600' },
                              { platform: 'twitter', icon: Twitter, color: 'text-sky-500' },
                              { platform: 'linkedin', icon: Linkedin, color: 'text-blue-700' },
                              { platform: 'instagram', icon: Instagram, color: 'text-pink-500' },
                              { platform: 'copy', icon: Copy, color: 'text-gray-400' }
                            ].map(({ platform, icon: Icon, color }) => (
                              <motion.div
                                key={platform}
                                role="button"
                                tabIndex={0}
                                className={`flex items-center justify-center hover:bg-white/10 p-2 rounded cursor-pointer ${color}`}
                                onClick={() => handleShare(platform)}
                                onKeyPress={e => { if (e.key === 'Enter') { handleShare(platform) } }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Icon className="h-5 w-5" />
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="p-8" hover={false}>
                  <h2 className="text-2xl font-bold text-white mb-6">About This Idea</h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {idea.about_this_idea || 'No description provided.'}
                  </p>

                  <h3 className="text-xl font-bold text-white mt-8 mb-4">Key Features</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    {Array.isArray(idea.key_features) && idea.key_features.length > 0 ? (
                      idea.key_features.map((feature: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          {feature}
                        </motion.li>
                      ))
                    ) : (
                      <li>No key features listed.</li>
                    )}
                  </ul>

                  <h3 className="text-xl font-bold text-white mt-8 mb-4">Market Opportunity</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {idea.market_opportunity || 'No market opportunity info.'}
                  </p>
                </GlassCard>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GlassCard className="p-8" hover={false}>
                  <div className="flex items-center mb-4">
                    <Tag className="h-5 w-5 text-gray-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {Array.isArray(idea.tags) && idea.tags.length > 0 ? idea.tags.map((tag: string, index: number) => (
                      <motion.span
                        key={tag}
                        className="inline-block px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        {tag}
                      </motion.span>
                    )) : <span className="text-gray-500 text-sm">No tags</span>}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-8"> {/* third column width */}
              {/* Validation Results */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="p-8" hover={false}>
                  {validation && ideaData ? (
                    <ValidationResults
                      validation={validation}
                      ideaData={ideaData}
                      onContinue={() => { }}
                      onEdit={() => { }}
                      hideButtons={true}
                    />
                  ) : (
                    <div className="text-center">
                      <AIValidationStep hideButtons={true} />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Design for Smaller Devices */}
      <div className="grid grid-cols-1 gap-8 lg:hidden">
        {/* Main Content */}
        <div className="space-y-8">
          {/* ...existing code for Main Content... */}
        </div>

        {/* Validation Results */}
        <div className="space-y-8">
          {validation && ideaData && (
            <ValidationResults validation={validation} ideaData={ideaData} onContinue={() => { }} onEdit={() => { }} hideButtons={true} />
          )}
        </div>

        {/* Funding Status, Creator Info, Idea Stats */}
        <div className="space-y-8">
          {/* ...existing code for Funding Status, Creator Info, Idea Stats... */}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;