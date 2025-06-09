import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Idea } from '../../types';

export interface IdeaCardProps {
  idea: Idea;
  trending?: boolean;
  onSave?: () => void;
  isSaved?: boolean;
  additionalInfo?: {
    investedAmount?: string;
    investedDate?: string;
    invoiceLink?: string;
  };
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, trending = false, onSave, isSaved, additionalInfo }) => {
  const fundingPercentage = Math.min(Math.round((idea.currentFunding / idea.fundingGoal) * 100), 100);
  
  return (
    <motion.div 
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-full transition-all duration-300 ${
        trending ? 'border-yellow-400/30 shadow-yellow-400/10' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={idea.imageUrl}
          alt={idea.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {trending && (
          <motion.div 
            className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </motion.div>
        )}
        
        {onSave && (
          <motion.button
            className={`absolute top-3 left-3 backdrop-blur-xl bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 ${
              isSaved ? 'text-blue-400 bg-blue-500/20' : 'text-gray-300 hover:text-white'
            }`}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onSave(); }}
            title={isSaved ? 'Unsave Idea' : 'Save Idea'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </motion.button>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <motion.span 
              className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30"
              whileHover={{ scale: 1.05 }}
            >
              {idea.category}
            </motion.span>
            <motion.span 
              className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30"
              whileHover={{ scale: 1.05 }}
            >
              {idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1)}
            </motion.span>
            {/* Pending Approval badge for unapproved ideas */}
            {typeof idea.approved === 'boolean' && !idea.approved && (
              <motion.span 
                className="inline-block px-3 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30"
                whileHover={{ scale: 1.05 }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Pending Approval
              </motion.span>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-1">{idea.title}</h3>
        
        <p className="text-gray-300 mb-4 line-clamp-2 flex-grow">
          {idea.description}
        </p>
        
        {/* Funding Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-white">${idea.currentFunding.toLocaleString()} raised</span>
            <span className="text-gray-400">{fundingPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${fundingPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-end text-xs text-gray-400 mt-1">
            Goal: ${idea.fundingGoal.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-sm text-gray-400">
            By <span className="text-gray-300 font-medium">{idea.creatorName}</span>
          </div>
          <motion.div whileHover={{ x: 5 }}>
            <Link
              to={`/ideas/${idea.id}`}
              className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center group transition-colors"
              state={{ idea }}
            >
              View details
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Additional Investment Info */}
        {additionalInfo && (
          <motion.div 
            className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center mb-2">
              <Zap className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-400">Investment Details</span>
            </div>
            <p className="text-sm text-gray-300">Amount: {additionalInfo.investedAmount}</p>
            <p className="text-sm text-gray-300">Date: {additionalInfo.investedDate}</p>
            {additionalInfo.invoiceLink && (
              <motion.a
                href={additionalInfo.invoiceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 underline inline-flex items-center mt-2"
                whileHover={{ x: 3 }}
              >
                View Invoice
                <ArrowRight className="ml-1 h-3 w-3" />
              </motion.a>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default IdeaCard;