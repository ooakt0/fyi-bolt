import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Code, Video, Brush, Smartphone, FileText, Search, Zap, Sparkles } from 'lucide-react';

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
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
      } : undefined}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const services = [
  {
    icon: <Code className="h-8 w-8 text-blue-400" />,
    title: 'Static Web Development',
    description: 'Build fast, responsive, and SEO-friendly static websites. Perfect for businesses looking to establish a strong online presence.',
    image: '/images/staticWebDevelopment.png',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Video className="h-8 w-8 text-purple-400" />,
    title: 'AI Video Creation',
    description: 'Create engaging videos using AI-powered tools. Ideal for marketing campaigns and social media content.',
    image: '/images/aiVideoCreation.png',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Brush className="h-8 w-8 text-pink-400" />,
    title: 'Branding & Design',
    description: 'Craft unique brand identities and stunning designs that resonate with your audience.',
    image: '/images/brandingNdesign.png',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: <Smartphone className="h-8 w-8 text-green-400" />,
    title: 'App Prototyping',
    description: 'Design and prototype mobile and web applications to bring your ideas to life.',
    image: '/images/appPrototyping.png',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: <FileText className="h-8 w-8 text-yellow-400" />,
    title: 'Business Plan Writing',
    description: 'Develop comprehensive business plans tailored to your startup\'s needs.',
    image: '/images/businessPlan.png',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <Search className="h-8 w-8 text-indigo-400" />,
    title: 'SEO & Digital Marketing',
    description: 'Boost your online presence with expert SEO strategies and digital marketing campaigns.',
    image: '/images/seoDigitalMarketing.png',
    gradient: 'from-indigo-500 to-purple-500',
  },
];

const Services: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - Fund Your Idea</title>
        <meta name="description" content="Explore the services we offer to help bring your ideas to life." />
      </Helmet>
      
      <div className="relative min-h-screen text-white overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground />
        
        <div className="relative z-10 pt-32 pb-16">
          <div className="container-custom">
            {/* Header Section */}
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard className="p-12 text-center" hover={false}>
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Our Services
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  We offer expert solutions in SEO, digital marketing, branding, design, app prototyping, and business plan writing—helping your business stand out, grow, and succeed in the digital frontier.
                </motion.p>
              </GlassCard>
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <GlassCard className="overflow-hidden h-full cursor-pointer group">
                    {/* Service Image */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Floating Icon */}
                      <motion.div
                        className={`absolute top-4 right-4 p-3 rounded-xl bg-gradient-to-r ${service.gradient} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {service.icon}
                      </motion.div>
                    </div>
                    
                    {/* Service Content */}
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        <motion.div
                          className={`p-2 rounded-lg bg-gradient-to-r ${service.gradient} mr-4`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {service.icon}
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {service.description}
                      </p>
                      
                      {/* Animated CTA */}
                      <motion.div
                        className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Learn More
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div 
              className="mt-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-12 text-center" hover={false}>
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Ready to Transform Your Idea?
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Let our expert team help you bring your vision to life with cutting-edge solutions and innovative strategies.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row justify-center gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Today
                  </motion.button>
                  
                  <motion.button
                    className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Schedule Consultation
                  </motion.button>
                </motion.div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;