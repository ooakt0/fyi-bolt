import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Target, TrendingUp } from 'lucide-react';
import type { IdeaData } from '../../types';

interface AIValidationStepProps {
  ideaData?: IdeaData; // Made optional to avoid unused warnings
  onValidate?: () => Promise<void>; // Made optional
  onSkip?: () => void; // Made optional
  isValidating?: boolean; // Made optional
  hideButtons?: boolean; // New prop to control button visibility
}

const AIValidationStep: React.FC<AIValidationStepProps> = ({
  ideaData,
  onValidate,
  onSkip,
  isValidating,
  hideButtons = false // Default to false
}) => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: 'SWOT Analysis',
      description: 'Get a detailed analysis of Strengths, Weaknesses, Opportunities, and Threats'
    },
    {
      icon: <Target className="w-8 h-8 text-purple-400" />,
      title: 'User Personas',
      description: 'Identify and understand your target audience with AI-generated user personas'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
      title: 'Market Analysis',
      description: 'Understand market size, competition, and growth opportunities'
    },
    {
      icon: <Activity className="w-8 h-8 text-emerald-400" />,
      title: 'Investment Readiness',
      description: 'Get a score and recommendations to improve investment potential'
    }
  ];

  return (
    <div className="w-full max-w-4xl md:w-4/5 sm:w-11/12 mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          {hideButtons ? 'Validation Report Not Available' : 'AI-Powered Idea Validation'}
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          {hideButtons
            ? 'After running the validation, we will provide valuable insights and recommendations from our AI system. This analysis will help strengthen pitch and increase chances of success.'
            : 'Before submitting your idea, get valuable insights and recommendations from our AI system. This analysis will help strengthen your pitch and increase your chances of success.'}
        </p>
      </div>

      {/* Adjust grid layout for responsiveness */}
      <div className="grid grid-cols-1 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border border-gray-700 p-6 rounded-lg"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!hideButtons && (
        <div className="flex justify-center gap-6 mt-12">
          <motion.button
            onClick={onValidate}
            disabled={isValidating}
            className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: isValidating ? 1 : 1.02 }}
            whileTap={{ scale: isValidating ? 1 : 0.98 }}
          >
            {isValidating ? (
              <>
                <span className="loading loading-spinner"></span>
                Analyzing...
              </>
            ) : (
              'Validate with AI'
            )}
          </motion.button>
          <motion.button
            onClick={onSkip}
            disabled={isValidating}
            className="px-8 py-4 rounded-xl font-bold text-white border border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: isValidating ? 1 : 1.02 }}
            whileTap={{ scale: isValidating ? 1 : 0.98 }}
          >
            Skip
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default AIValidationStep;
