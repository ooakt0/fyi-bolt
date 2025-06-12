import React from 'react';
import { Shield, LineChart } from 'lucide-react';
import type { IdeaValidation, IdeaData } from '../../types';
import { BsPeopleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Extended ValidationResultsProps to include ideaData for accessing title, category, and fundingGoal
interface ValidationResultsProps {
  validation: IdeaValidation;
  ideaData: IdeaData;
  onContinue: () => void;
  onEdit: () => void;
  hideButtons?: boolean; // New prop to control button visibility
}

const ValidationResults: React.FC<ValidationResultsProps> = ({
  validation,
  ideaData,
  hideButtons = false, // Default to false
}) => {
    const navigate = useNavigate(); // Move useNavigate inside the component

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };
    return (
        <div className="min-h-screen flex flex-col items-center py-12 space-y-12">
            {/* Header Section */}
            <div className="text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Idea Validation Report
                </h1>
                <p className="text-lg mt-4 text-gray-400">
                    Category: {ideaData.category} • Stage: {ideaData.stage} • Funding Goal: ${ideaData.fundingGoal}
                </p>
            </div>

            {/* Investor Readiness Score */}
            <div className="w-full max-w-8xl md:w-4/5 sm:w-11/12 bg-transparent p-8 rounded-lg shadow-lg text-center
      shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]">
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Investor Readiness Score</h2>
                    <div className="flex justify-center items-center">
                        <div className="relative">
                            <div className="w-36 h-36 rounded-full border-8 border-blue-500 flex items-center justify-center">
                                <span className="text-4xl font-bold text-blue-400">{validation.investor_readiness_score}/100</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-gray-400">
                    Seed round of $250K-$500K to build MVP and validate market
                </p>
            </div>

            {/* SWOT Analysis */}
            <div className="w-full max-w-8xl md:w-9/10 sm:w-11/12 mx-auto space-y-8">
                <div className="flex items-center mb-4">
                    <Shield className="text-blue-400 w-6 h-6 mr-2" />
                    <h2 className="text-2xl font-bold">SWOT Analysis</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-green-400 font-bold">Strengths</h3>
                        <ul className="list-disc list-inside text-gray-400">
                            {validation.swot_analysis.strengths.map((strength, index) => (
                                <li key={index}>{strength}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-red-400 font-bold">Weaknesses</h3>
                        <ul className="list-disc list-inside text-gray-400">
                            {validation.swot_analysis.weaknesses.map((weakness, index) => (
                                <li key={index}>{weakness}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-blue-400 font-bold">Opportunities</h3>
                        <ul className="list-disc list-inside text-gray-400">
                            {validation.swot_analysis.opportunities.map((opportunity, index) => (
                                <li key={index}>{opportunity}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-yellow-400 font-bold">Threats</h3>
                        <ul className="list-disc list-inside text-gray-400">
                            {validation.swot_analysis.threats.map((threat, index) => (
                                <li key={index}>{threat}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Target Personas */}
            <div className="w-full max-w-8xl md:w-9/10 sm:w-11/12 mx-auto space-y-8">
                <div className="flex items-center mb-4">
                    <BsPeopleFill className="text-blue-400 w-6 h-6 mr-2" />
                    <h2 className="text-2xl font-bold">Target Personas</h2>
                </div>
                {/* Adjust grid layout for responsiveness */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {validation?.user_personas?.map((persona, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-xl text-purple-400 mb-2">{persona.name}</h3>
                            <div className="mt-4">
                                <h4 className="text-lg text-gray-300">Pain Points</h4>
                                <ul className="list-disc list-inside text-gray-400">
                                    {persona.pain_points?.map((point, i) => (
                                        <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-lg text-gray-300">Goals</h4>
                                <ul className="list-disc list-inside text-gray-400">
                                    {persona.goals?.map((goal, i) => (
                                        <li key={i}>{goal}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Market Analysis */}
            <div className="w-full max-w-8xl md:w-9/10 sm:w-11/12 mx-auto space-y-8">
                <div className="flex items-center mb-4">
                    <LineChart className="text-blue-400 w-6 h-6 mr-2" />
                    <h2 className="text-2xl font-bold">Market Analysis</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl text-green-400">Market Size</h3>
                        <p className="text-gray-300">{validation?.market_analysis?.market_size ?? 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="text-xl text-blue-400">Target Segments</h3>
                        <ul className="list-disc list-inside text-gray-300">
                            {validation?.market_analysis?.target_segments?.map((segment, i) => (
                                <li key={i}>{segment}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl text-red-400">Key Competitors</h3>
                        <ul className="list-disc list-inside text-gray-300">
                            {validation?.market_analysis?.competition?.map((competitor, i) => (
                                <li key={i}>{competitor.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            {!hideButtons && (
                <div className="flex justify-center gap-6 mt-12">
                    <motion.button
                        type="button"
                        className="px-8 py-4 font-bold rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                        onClick={handleBackToDashboard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Exit to Dashboard
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default ValidationResults;
