import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, TrendingUp } from 'lucide-react';
import { Idea } from '../../types';

interface IdeaCardProps {
  idea: Idea;
  trending?: boolean;
  onSave?: () => void;
  isSaved?: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, trending = false, onSave, isSaved }) => {
  const fundingPercentage = Math.min(Math.round((idea.currentFunding / idea.fundingGoal) * 100), 100);
  
  return (
    <div className={`card hover:translate-y-[-4px] transition-all duration-300 overflow-hidden ${
      trending ? 'border-accent-200 shadow-md' : ''
    }`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={idea.imageUrl}
          alt={idea.title}
          className="w-full h-full object-cover"
        />
        
        {trending && (
          <div className="absolute top-3 right-3 bg-accent-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </div>
        )}
        
        {onSave && (
          <button
            className={`absolute top-3 left-3 bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full transition-colors ${isSaved ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onSave(); }}
            title={isSaved ? 'Unsave Idea' : 'Save Idea'}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? '#2563eb' : 'none'} />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full mb-2">
              {idea.category}
            </span>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary-50 text-secondary-700 rounded-full mb-2 ml-1">
              {idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1)}
            </span>
            {/* Pending Approval badge for unapproved ideas */}
            {typeof idea.approved === 'boolean' && !idea.approved && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mb-2 ml-1">
                Pending Approval
              </span>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{idea.title}</h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {idea.description}
        </p>
        
        {/* Funding Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">${idea.currentFunding.toLocaleString()} raised</span>
            <span className="text-gray-500">{fundingPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${fundingPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-end text-xs text-gray-500 mt-1">
            Goal: ${idea.fundingGoal.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            By {idea.creatorName}
          </div>
          <Link
            to={`/ideas/${idea.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-800"
            state={{ idea }}
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;