import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb as LightBulb, Users, DollarSign, Briefcase, Check, MessageSquare, Target, ShieldCheck, Rocket, Zap, Globe, Star } from 'lucide-react';

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

const HowItWorks: React.FC = () => {
  const creatorSteps = [
    {
      number: 1,
      title: "Share Your Vision",
      description: "Create a detailed profile of your idea, including your vision, goals, and funding requirements. Showcase what makes your idea unique and why investors should support it.",
      icon: LightBulb,
      color: "blue"
    },
    {
      number: 2,
      title: "Connect with Investors",
      description: "Engage with potential investors who express interest in your idea. Answer questions, provide additional information, and build relationships.",
      icon: MessageSquare,
      color: "purple"
    },
    {
      number: 3,
      title: "Secure Funding",
      description: "Once investors decide to support your idea, secure the funding you need to develop your concept and turn it into a successful venture.",
      icon: DollarSign,
      color: "pink"
    }
  ];

  const investorSteps = [
    {
      number: 1,
      title: "Browse Ideas",
      description: "Explore a wide range of innovative ideas across different categories and stages of development. Filter and search to find opportunities that align with your investment interests.",
      icon: Globe,
      color: "blue"
    },
    {
      number: 2,
      title: "Evaluate & Connect",
      description: "Assess ideas based on their potential, market opportunity, and creator credibility. Reach out to creators to learn more and discuss investment terms.",
      icon: Target,
      color: "purple"
    },
    {
      number: 3,
      title: "Invest & Support",
      description: "Choose ideas to invest in and provide financial backing. Track progress and offer mentorship to help turn promising concepts into successful ventures.",
      icon: Rocket,
      color: "pink"
    }
  ];

  const commitments = [
    {
      title: "Rigorous Vetting",
      description: "We carefully review all ideas and creators to ensure legitimacy and quality, giving investors confidence in the opportunities presented.",
      icon: ShieldCheck
    },
    {
      title: "Secure Transactions",
      description: "Our platform ensures secure, transparent financial transactions between creators and investors, protecting both parties.",
      icon: Check
    },
    {
      title: "Ongoing Support",
      description: "We provide resources, guidance, and support to help creators succeed and help investors make informed decisions.",
      icon: Users
    },
    {
      title: "Community Focus",
      description: "We foster a collaborative community where creators and investors can connect, share insights, and build meaningful relationships.",
      icon: Star
    }
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Creating an account is simple. Click on \"Sign Up\" in the navigation, enter your details, and choose whether you're joining as a creator or an investor. You'll then have access to all the features relevant to your role."
    },
    {
      question: "How is funding distributed to creators?",
      answer: "When an investor decides to fund an idea, the agreed-upon amount is held in escrow until specific milestones are met. This ensures both parties are protected and that funds are used as intended. Detailed terms are established between creators and investors."
    },
    {
      question: "What types of ideas can be shared on the platform?",
      answer: "We welcome a wide range of ideas across technology, consumer products, services, and more. All ideas should be original, feasible, and have the potential for growth. We do have guidelines to ensure quality and legitimacy, which you can find in our terms of service."
    },
    {
      question: "How do investors benefit from funding ideas?",
      answer: "Investors receive equity, revenue sharing, or other agreed-upon returns based on the specific arrangements made with creators. Each investment opportunity is unique, with terms negotiated directly between the investor and the creator."
    }
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="relative z-10 pt-32 pb-16">
        <div className="container-custom">
          {/* Hero Section */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-12 text-center" hover={false}>
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                How Fund Your Idea Works
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                We connect innovative creators with passionate investors through a streamlined, 
                transparent process designed to bring ideas to life.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/signup?role=creator" 
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center"
                  >
                    <LightBulb className="mr-2 h-5 w-5" />
                    Join as Creator
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/signup?role=investor" 
                    className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center"
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Join as Investor
                  </Link>
                </motion.div>
              </motion.div>
            </GlassCard>
          </motion.div>
          
          {/* For Creators Section */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <LightBulb className="h-8 w-8 text-white" />
              </motion.div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                For Creators
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Turn your innovative ideas into reality with funding and support from our community of investors.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {creatorSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
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
                      <span className="text-2xl font-bold text-white">{step.number}</span>
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
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/signup?role=creator" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Start as a Creator
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* For Investors Section */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Briefcase className="h-8 w-8 text-white" />
              </motion.div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                For Investors
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover promising ideas and support innovative creators while building a diverse investment portfolio.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {investorSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
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
                      <span className="text-2xl font-bold text-white">{step.number}</span>
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
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/signup?role=investor" 
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  Start as an Investor
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Our Commitment Section */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 mb-6"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <ShieldCheck className="h-8 w-8 text-white" />
              </motion.div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Our Commitment
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                At Fund Your Idea, we're committed to creating a transparent, secure, and supportive environment.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {commitments.map((commitment, index) => (
                <motion.div
                  key={commitment.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <GlassCard className="p-8 h-full">
                    <div className="flex items-start">
                      <motion.div
                        className="mr-6 flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <commitment.icon className="h-8 w-8 text-green-400" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-white">{commitment.title}</h3>
                        <p className="text-gray-300 leading-relaxed">
                          {commitment.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* FAQ Section */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Find answers to common questions about how Fund Your Idea works.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="p-8">
                    <h3 className="text-xl font-bold mb-4 text-white">{faq.question}</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
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
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/faq" 
                  className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
                >
                  View All FAQs
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 text-center" hover={false}>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Join our community today and take the first step toward making your vision a reality
                or finding the next big idea to invest in.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/signup" 
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center"
                  >
                    <Rocket className="mr-2 h-5 w-5" />
                    Create Your Account
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;