import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Camera, Loader, Save, ArrowLeft, Zap, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../store/authStore/supabaseClient';
import AnimatedBackground from '../components/layout/AnimatedBackground';

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

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar_url: '',
    expertise: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    investment_focus: '',
    investment_range: '',
    company: '',
    position: '',
    role: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          expertise: data.expertise || '',
          portfolio_url: data.portfolio_url || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          investment_focus: data.investment_focus || '',
          investment_range: data.investment_range || '',
          company: data.company || '',
          position: data.position || '',
          role: data.role || user.role || '',
        });
      }
    };
    fetchProfile();
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          expertise: formData.expertise,
          portfolio_url: formData.portfolio_url,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          investment_focus: formData.investment_focus,
          investment_range: formData.investment_range,
          company: formData.company,
          position: formData.position,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile!');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="relative z-10 pt-32 pb-16">
        <div className="container-custom max-w-4xl">
          {/* Back Button */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Back
            </motion.button>
          </motion.div>

          <GlassCard className="overflow-hidden" hover={false}>
            {/* Header */}
            <motion.div 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-12 relative overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                    'linear-gradient(45deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                    'linear-gradient(45deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              
              <div className="relative flex items-center space-x-6">
                <div className="relative">
                  {formData.avatar_url ? (
                    <motion.img
                      src={formData.avatar_url}
                      alt={formData.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.div 
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white/20 shadow-2xl"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <User className="w-12 h-12 text-white" />
                    </motion.div>
                  )}
                  <motion.button 
                    className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-xl rounded-full p-2 shadow-lg hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
                <div>
                  <motion.h1 
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {formData.name || 'Your Name'}
                  </motion.h1>
                  <motion.p 
                    className="text-white/80 text-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : ''}
                  </motion.p>
                </div>
                <motion.div
                  className="ml-auto"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  {formData.role === 'creator' ? (
                    <Zap className="h-8 w-8 text-white/60" />
                  ) : (
                    <Star className="h-8 w-8 text-white/60" />
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="p-8 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="input bg-white/5 cursor-not-allowed"
                    disabled
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Email cannot be changed. Contact support if you need to update it.
                  </p>
                </div>

                <div>
                  <label className="form-label">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {formData.role === 'creator' ? (
                  <>
                    <div>
                      <label className="form-label">
                        Areas of Expertise
                      </label>
                      <input
                        type="text"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleChange}
                        className="input"
                        placeholder="e.g., Mobile Development, AI, Blockchain"
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        name="portfolio_url"
                        value={formData.portfolio_url}
                        onChange={handleChange}
                        className="input"
                        placeholder="https://your-portfolio.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          name="linkedin_url"
                          value={formData.linkedin_url}
                          onChange={handleChange}
                          className="input"
                          placeholder="https://linkedin.com/in/your-profile"
                        />
                      </div>
                      <div>
                        <label className="form-label">
                          GitHub Profile
                        </label>
                        <input
                          type="url"
                          name="github_url"
                          value={formData.github_url}
                          onChange={handleChange}
                          className="input"
                          placeholder="https://github.com/your-username"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="form-label">
                        Investment Focus
                      </label>
                      <input
                        type="text"
                        name="investment_focus"
                        value={formData.investment_focus}
                        onChange={handleChange}
                        className="input"
                        placeholder="e.g., SaaS, FinTech, Healthcare"
                      />
                    </div>

                    <div>
                      <label className="form-label">
                        Investment Range
                      </label>
                      <input
                        type="text"
                        name="investment_range"
                        value={formData.investment_range}
                        onChange={handleChange}
                        className="input"
                        placeholder="e.g., $10K - $50K"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="input"
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <label className="form-label">
                          Position
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          className="input"
                          placeholder="Your role"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                        className="input"
                        placeholder="https://linkedin.com/in/your-profile"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end space-x-4 pt-8 border-t border-white/10">
                <motion.button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary min-w-[120px]"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader className="w-4 h-4 mr-2" />
                      </motion.div>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;