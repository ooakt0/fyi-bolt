import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { Share2, DollarSign, MessageSquare, Bookmark, Calendar, BarChart, Tag, Award } from 'lucide-react';
import { mockIdeas } from '../data/mockData';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../store/authStore/supabaseClient';

const IdeaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [idea, setIdea] = useState<any>(location.state?.idea || null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const fetchIdea = async () => {
      if (!idea && id) {
        const { data } = await supabase.from('ideas').select('*').eq('id', id).single();
        if (data) setIdea(data);
      }
    };
    fetchIdea();
  }, [id, idea]);
  
  // If idea not found, redirect to 404 or ideas page
  if (!idea) {
    return <Navigate to="/ideas" />;
  }
  
  const fundingPercentage = Math.min(Math.round((idea.currentFunding / idea.fundingGoal) * 100), 100);
  const createdDate = new Date(idea.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to the backend
    alert('Message sent successfully!');
    setMessage('');
    setShowContactForm(false);
  };
  
  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <Link to="/ideas" className="text-primary-600 hover:text-primary-700 flex items-center text-sm">
            ← Back to ideas
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Idea Header */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={idea.imageUrl}
                alt={idea.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                    {idea.category}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary-50 text-secondary-700 rounded-full">
                    {idea.stage.charAt(0).toUpperCase() + idea.stage.slice(1)}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{idea.title}</h1>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>By {idea.creatorName}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{createdDate}</span>
                </div>
                
                <div className="flex items-center space-x-4 mt-4">
                  {isAuthenticated && user?.role === 'investor' && (
                    <button 
                      onClick={() => setShowContactForm(true)}
                      className="btn btn-primary"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Creator
                    </button>
                  )}
                  
                  <button className="btn btn-outline">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  
                  <button className="btn btn-outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Idea</h2>
              <p className="text-gray-700 mb-4">
                {idea.description}
              </p>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum, 
                velit ipsum bibendum velit, vel bibendum velit ipsum vel velit. Sed euismod, velit vel bibendum 
                bibendum, velit ipsum bibendum velit, vel bibendum velit ipsum vel velit.
              </p>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Innovative technology that addresses a growing market need</li>
                <li>Environmentally sustainable approach with measurable impact</li>
                <li>Scalable business model with multiple revenue streams</li>
                <li>Experienced team with industry expertise</li>
              </ul>
              
              <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Market Opportunity</h3>
              <p className="text-gray-700">
                The global market for this solution is projected to reach $50B by 2025, growing at a CAGR of 15%. 
                Our unique approach addresses key pain points that existing solutions fail to solve, positioning 
                us for rapid adoption and growth.
              </p>
            </div>
            
            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-3">
                <Tag className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(idea.tags) ? idea.tags.map((tag: string) => (
                  <span 
                    key={tag} 
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                )) : null}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Funding Status</h3>
              
              <div className="mb-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${idea.currentFunding.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-1">raised</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    of ${idea.fundingGoal.toLocaleString()} goal
                  </div>
                </div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full"
                    style={{ width: `${fundingPercentage}%` }}
                  ></div>
                </div>
                
                <div className="mt-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{fundingPercentage}% funded</span>
                </div>
              </div>
              
              {isAuthenticated && user?.role === 'investor' && (
                <button className="btn btn-primary w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Invest in this Idea
                </button>
              )}
              
              {(!isAuthenticated || user?.role !== 'investor') && (
                <Link to={isAuthenticated ? '/dashboard' : '/signup'} className="btn btn-primary w-full">
                  {isAuthenticated ? 'Go to Dashboard' : 'Sign Up to Invest'}
                </Link>
              )}
            </div>
            
            {/* Creator Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About the Creator</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {idea.creatorName.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{idea.creatorName}</p>
                  <p className="text-xs text-gray-500">Creator</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Passionate entrepreneur with expertise in {idea.category.toLowerCase()} and a 
                vision to create impactful solutions for real-world problems.
              </p>
              
              {isAuthenticated && user?.role === 'investor' && !showContactForm && (
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Contact Creator
                </button>
              )}
              
              {showContactForm && (
                <form onSubmit={handleSubmitMessage} className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={3}
                    className="input resize-none"
                    placeholder="Hi, I'm interested in your idea..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                  <div className="mt-3 flex space-x-2">
                    <button type="submit" className="btn btn-primary btn-sm">
                      Send Message
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowContactForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Idea Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-3">
                <BarChart className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Idea Stats</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Created on</span>
                  <span className="text-sm font-medium">{createdDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium">{idea.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stage</span>
                  <span className="text-sm font-medium capitalize">{idea.stage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Time to market</span>
                  <span className="text-sm font-medium">6-12 months</span>
                </div>
              </div>
            </div>
            
            {/* Similar Ideas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Similar Ideas</h3>
              
              <div className="space-y-4">
                {mockIdeas
                  .filter(i => i.id !== idea.id && i.category === idea.category)
                  .slice(0, 2)
                  .map((similarIdea) => (
                    <Link 
                      key={similarIdea.id} 
                      to={`/ideas/${similarIdea.id}`}
                      className="block group"
                    >
                      <div className="flex items-center">
                        <img
                          src={similarIdea.imageUrl}
                          alt={similarIdea.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                            {similarIdea.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            ${similarIdea.currentFunding.toLocaleString()} raised
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;