import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const footerSections = [
    {
      title: 'Resources',
      links: [
        { to: '/ideas', label: 'Browse Ideas' },
        { to: '/how-it-works', label: 'How It Works' },
        { to: '/services', label: 'Our Services' },
      ]
    },
    {
      title: 'Support',
      links: [
        { to: '/faq', label: 'FAQ' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/privacy', label: 'Privacy Policy' },
        { to: '/terms', label: 'Terms of Service' },
      ]
    }
  ];

  return (
    <footer className="relative bg-black/20 backdrop-blur-xl border-t border-white/10">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and description */}
          <motion.div 
            className="col-span-1 md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Lightbulb className="h-8 w-8 text-blue-400" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Fund Your Idea
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting innovative creators with passionate investors to bring amazing ideas to life in the most advanced crowdfunding ecosystem.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Footer sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div 
              key={section.title}
              className="col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.2 }}
            >
              <h5 className="text-lg font-semibold mb-6 text-white">{section.title}</h5>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.2 + linkIndex * 0.1 }}
                  >
                    <Link 
                      to={link.to} 
                      className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
          
          {/* Newsletter */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h5 className="text-lg font-semibold mb-6 text-white">Stay Updated</h5>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Subscribe to our newsletter for the latest ideas and opportunities.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                required
              />
              <motion.button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p>© {new Date().getFullYear()} Fund Your Idea. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;