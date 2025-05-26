import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lightbulb as LightBulb, ArrowRight, BarChart, Users, PieChart, DollarSign, CheckCircle } from 'lucide-react';
import { useIdeasStore } from '../store/authStore/ideasStore';


const Home: React.FC = () => {
  const { ideas, loading, error, fetchIdeas } = useIdeasStore();
  // Only fetch if ideas are not already loaded
  useEffect(() => {
    if (ideas.length === 0) fetchIdeas();
  }, [ideas.length, fetchIdeas]);

  // Only show approved ideas in featured section
  const featuredIdeas = ideas.filter(i => i.approved).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>FundYourIdea | Smarter Crowdfunding Platform</title>
      </Helmet>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white py-20 md:py-28">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="md:w-1/2 md:pr-8">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 animate-slide-up">
                  Launch Smarter. <span className="text-accent-300">Fund Faster.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Validate your idea, match with micro-investors, and bring your innovation to life.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <Link to="/signup" className="btn bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-md text-lg">
                    Get Started
                  </Link>
                  <Link to="/how-it-works" className="btn bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-md text-lg backdrop-blur-sm">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden md:block md:w-1/2 pl-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <img 
                  src="https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Startup team meeting" 
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How FundYourIdea is Different Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">How FundYourIdea is Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start bg-primary-50 rounded-lg p-6 shadow-sm">
              <span className="text-2xl md:text-3xl mr-4">✅</span>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-primary-800 mb-1">Built-In Idea Validation</h3>
                <p className="text-gray-700 text-base">Use AI to help creators refine their pitch with SWOT analysis, user personas, and market mapping—so your idea is investor-ready from day one.</p>
              </div>
            </div>
            <div className="flex items-start bg-secondary-50 rounded-lg p-6 shadow-sm">
              <span className="text-2xl md:text-3xl mr-4">🤝</span>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-secondary-800 mb-1">Micro-Angel Matchmaking</h3>
                <p className="text-gray-700 text-base">Connect with verified micro-investors based on your idea's category and their interests—making funding more accessible and personal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fund Your Idea connects innovative creators with passionate investors through a simple process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                <LightBulb className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Share Your Vision</h3>
              <p className="text-gray-600">
                Create a detailed profile of your idea, including your vision, goals, and funding requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 text-secondary-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with Investors</h3>
              <p className="text-gray-600">
                Engage with potential investors who are interested in your idea and share your passion.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4 text-accent-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Funding</h3>
              <p className="text-gray-600">
                Receive financial backing to develop your idea and turn your concept into a successful venture.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/how-it-works" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              Learn more about our process
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Ideas Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Ideas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover some of the innovative ideas currently seeking funding on our platform.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-500">Loading ideas...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredIdeas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                  <img
                    src={idea.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={idea.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                        {idea.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{idea.description}</p>
                    
                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">${Number(idea.currentFunding || idea.currentFunding || 0).toLocaleString()} raised</span>
                        <span className="text-gray-500">
                          {(idea.fundingGoal || idea.fundingGoal)
                            ? Math.round(
                                ((idea.currentFunding || idea.currentFunding || 0) /
                                  (idea.fundingGoal || idea.fundingGoal)) * 100
                          )
                          : 0
                        }%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (idea.fundingGoal || idea.fundingGoal)
                                ? Math.min(
                                    Math.round(
                                      ((idea.currentFunding || idea.currentFunding || 0) /
                                        (idea.fundingGoal || idea.fundingGoal)) * 100
                                    ),
                                    100
                                  )
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <Link
                      to={`/ideas/${idea.id}`}
                      className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700"
                    >
                      View details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link to="/ideas" className="btn btn-primary">
              Explore All Ideas
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're helping ideas become reality every day. Here's what we've accomplished together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex w-12 h-12 bg-primary-100 rounded-full items-center justify-center mb-4 text-primary-600">
                <LightBulb className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-gray-900">500+</h3>
              <p className="text-gray-600">Ideas Launched</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex w-12 h-12 bg-secondary-100 rounded-full items-center justify-center mb-4 text-secondary-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-gray-900">$10M+</h3>
              <p className="text-gray-600">Funding Raised</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex w-12 h-12 bg-accent-100 rounded-full items-center justify-center mb-4 text-accent-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-gray-900">2,000+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex w-12 h-12 bg-success-100 rounded-full items-center justify-center mb-4 text-success-500">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-gray-900">85%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from creators and investors who have achieved success with Fund Your Idea.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="flex items-start mb-4">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold">Michael Chen</h3>
                  <p className="text-gray-600">Creator of EcoTrack</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Fund Your Idea connected me with investors who shared my vision for sustainable technology. 
                Within six months, we secured full funding and launched our product. The platform made 
                everything simple and transparent."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="flex items-start mb-4">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold">Sarah Johnson</h3>
                  <p className="text-gray-600">Angel Investor</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As an investor, I've found some of my most successful ventures through Fund Your Idea. 
                The platform's vetting process ensures quality ideas, and the direct communication with 
                creators builds trust from the beginning."
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/success-stories" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              Read more success stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Bring Your Idea to Life?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Join our community of creators and investors today and take the first step toward making your vision a reality.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="btn bg-white text-primary-800 hover:bg-gray-100 px-6 py-3 rounded-md text-lg">
              Sign Up Now
            </Link>
            <Link to="/ideas" className="btn bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-md text-lg backdrop-blur-sm">
              Browse Ideas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;