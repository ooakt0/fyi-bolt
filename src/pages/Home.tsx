import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Lightbulb as LightBulb, ArrowRight, Users, DollarSign, Zap, Rocket, Target, Globe, Sparkles } from 'lucide-react';
import { useIdeasStore } from '../store/authStore/ideasStore';
import AnimatedBackground from '../components/layout/AnimatedBackground';

// Section component with scroll animations
const Section: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`py-16 relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.section>
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

const Home: React.FC = () => {
  const { ideas, loading, error, fetchIdeas } = useIdeasStore();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Only fetch if ideas are not already loaded
  useEffect(() => {
    if (ideas.length === 0) fetchIdeas();
  }, [ideas.length, fetchIdeas]);

  // Only show approved ideas in featured section
  const featuredIdeas = ideas.filter(i => i.approved).slice(0, 3);

  return (
    <div className="relative text-white overflow-x-hidden">
      <Helmet>
        <title>FundYourIdea | Smarter Crowdfunding Platform</title>
      </Helmet>

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Parallax background overlay */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          y: backgroundY,
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <Section id="hero" className="pt-32 pb-20">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold leading-tight mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Launch Smarter.{' '}
                  <motion.span
                    className="inline-block"
                    animate={{ 
                      textShadow: [
                        '0 0 20px rgba(236, 72, 153, 0.5)',
                        '0 0 40px rgba(236, 72, 153, 0.8)',
                        '0 0 20px rgba(236, 72, 153, 0.5)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Fund Faster.
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  Validate your idea, match with micro-investors, and bring your innovation to life in the most advanced crowdfunding ecosystem.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/signup" 
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25"
                    >
                      <span className="relative z-10 flex items-center">
                        <Rocket className="mr-2 h-5 w-5" />
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/how-it-works" 
                      className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Learn More
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* How FundYourIdea is Different Section */}
        <Section id="different" className="py-20">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-center mb-16"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Our Unique Approach
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GlassCard className="p-8 h-full">
                    <div className="flex items-start">
                      <motion.div
                        className="text-4xl mr-6 flex-shrink-0"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Target className="h-12 w-12 text-blue-400" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-blue-400 mb-4">Built-In Idea Validation</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          Use AI to help creators refine their pitch with SWOT analysis, user personas, and market mapping—so your idea is investor-ready from day one.
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GlassCard className="p-8 h-full">
                    <div className="flex items-start">
                      <motion.div
                        className="text-4xl mr-6 flex-shrink-0"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Users className="h-12 w-12 text-purple-400" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-purple-400 mb-4">Micro-Angel Matchmaking</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          Connect with verified micro-investors based on your idea's category and their interests—making funding more accessible and personal.
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </div>
          </div>
        </Section>

        {/* How It Works Section */}
        <Section id="how-it-works" className="py-20">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div className="text-center mb-16">
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  How It Works
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Fund Your Idea connects innovative creators with passionate investors through a simple, futuristic process.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: LightBulb, title: "Share Your Vision", description: "Create a detailed profile of your idea, including your vision, goals, and funding requirements.", color: "blue" },
                  { icon: Users, title: "Connect with Investors", description: "Engage with potential investors who are interested in your idea and share your passion.", color: "purple" },
                  { icon: DollarSign, title: "Secure Funding", description: "Receive financial backing to develop your idea and turn your concept into a successful venture.", color: "pink" }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                  >
                    <GlassCard className="p-8 h-full text-center">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-r ${
                          step.color === 'blue' ? 'from-blue-500 to-blue-600' :
                          step.color === 'purple' ? 'from-purple-500 to-purple-600' :
                          'from-pink-500 to-pink-600'
                        }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Link 
                  to="/how-it-works" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-lg group"
                >
                  Learn more about our process
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Featured Ideas Section */}
        <Section id="featured-ideas" className="py-20">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div className="text-center mb-16">
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Featured Ideas
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Discover some of the innovative ideas currently seeking funding on our platform.
                </p>
              </motion.div>
              
              {loading ? (
                <div className="text-center text-gray-400">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Zap className="h-8 w-8" />
                  </motion.div>
                  <p className="mt-4">Loading ideas...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-400">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredIdeas.map((idea, index) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{ y: -10 }}
                    >
                      <GlassCard className="overflow-hidden h-full">
                        <div className="relative">
                          <img
                            src={idea.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                            alt={idea.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                        <div className="p-6">
                          <div className="flex mb-3">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                              {idea.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-white">{idea.title}</h3>
                          <p className="text-gray-300 mb-4 line-clamp-2">{idea.description}</p>
                          
                          {/* Funding Progress */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium text-white">${Number(idea.currentFunding || 0).toLocaleString()} raised</span>
                              <span className="text-gray-400">
                                {idea.fundingGoal
                                  ? Math.round(((idea.currentFunding || 0) / idea.fundingGoal) * 100)
                                  : 0
                                }%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ 
                                  width: `${idea.fundingGoal
                                    ? Math.min(Math.round(((idea.currentFunding || 0) / idea.fundingGoal) * 100), 100)
                                    : 0
                                  }%`
                                }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                          </div>
                          
                          <Link
                            to={`/ideas/${idea.id}`}
                            className="inline-flex items-center font-medium text-blue-400 hover:text-blue-300 group"
                          >
                            View details
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/ideas" 
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  >
                    Explore All Ideas
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Testimonials Section */}
        <Section id="testimonials" className="py-20">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div className="text-center mb-16">
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Success Stories
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Hear from creators and investors who have achieved success with Fund Your Idea.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    name: "Michael Chen",
                    role: "Creator of EcoTrack",
                    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
                    quote: "Fund Your Idea connected me with investors who shared my vision for sustainable technology. Within six months, we secured full funding and launched our product. The platform made everything simple and transparent."
                  },
                  {
                    name: "Sarah Johnson",
                    role: "Angel Investor",
                    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
                    quote: "As an investor, I've found some of my most successful ventures through Fund Your Idea. The platform's vetting process ensures quality ideas, and the direct communication with creators builds trust from the beginning."
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                  >
                    <GlassCard className="p-8 h-full">
                      <div className="flex items-start mb-6">
                        <motion.img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white/20"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div>
                          <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                          <p className="text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 italic leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Link 
                  to="/success-stories" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-lg group"
                >
                  Read more success stories
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section id="cta" className="py-20 pb-32">
          <div className="container-custom px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <GlassCard className="p-12" hover={false}>
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Ready to Bring Your Idea to Life?
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Join our community of creators and investors today and take the first step toward making your vision a reality.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row justify-center gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/signup" 
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center"
                    >
                      <Rocket className="mr-2 h-5 w-5" />
                      Sign Up Now
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/ideas" 
                      className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center"
                    >
                      <Globe className="mr-2 h-5 w-5" />
                      Browse Ideas
                    </Link>
                  </motion.div>
                </motion.div>
              </GlassCard>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Home;