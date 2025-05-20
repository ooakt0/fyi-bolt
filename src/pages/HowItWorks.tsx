import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb as LightBulb, Users, DollarSign, Briefcase, Check, MessageSquare, Target, ShieldCheck } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white rounded-2xl overflow-hidden mb-12">
          <div className="px-6 py-12 md:p-12 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">How Fund Your Idea Works</h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              We connect innovative creators with passionate investors through a streamlined, 
              transparent process designed to bring ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup?role=creator" className="btn bg-white text-primary-800 hover:bg-gray-100">
                Join as Creator
              </Link>
              <Link to="/signup?role=investor" className="btn bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                Join as Investor
              </Link>
            </div>
          </div>
        </div>
        
        {/* For Creators Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
              <LightBulb className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Creators</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your innovative ideas into reality with funding and support from our community of investors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Share Your Vision</h3>
              <p className="text-gray-600">
                Create a detailed profile of your idea, including your vision, goals, and funding requirements.
                Showcase what makes your idea unique and why investors should support it.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with Investors</h3>
              <p className="text-gray-600">
                Engage with potential investors who express interest in your idea. Answer questions,
                provide additional information, and build relationships.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Funding</h3>
              <p className="text-gray-600">
                Once investors decide to support your idea, secure the funding you need to develop your 
                concept and turn it into a successful venture.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/signup?role=creator" className="btn btn-primary">
              Start as a Creator
            </Link>
          </div>
        </div>
        
        {/* For Investors Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Investors</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover promising ideas and support innovative creators while building a diverse investment portfolio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 text-secondary-600">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Browse Ideas</h3>
              <p className="text-gray-600">
                Explore a wide range of innovative ideas across different categories and stages of development.
                Filter and search to find opportunities that align with your investment interests.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 text-secondary-600">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Evaluate & Connect</h3>
              <p className="text-gray-600">
                Assess ideas based on their potential, market opportunity, and creator credibility.
                Reach out to creators to learn more and discuss investment terms.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4 text-secondary-600">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Invest & Support</h3>
              <p className="text-gray-600">
                Choose ideas to invest in and provide financial backing. Track progress and offer mentorship
                to help turn promising concepts into successful ventures.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/signup?role=investor" className="btn btn-secondary">
              Start as an Investor
            </Link>
          </div>
        </div>
        
        {/* Our Commitment Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-100 text-accent-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At Fund Your Idea, we're committed to creating a transparent, secure, and supportive environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-4">
                <div className="mr-4">
                  <Check className="h-6 w-6 text-success-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Rigorous Vetting</h3>
                  <p className="text-gray-600">
                    We carefully review all ideas and creators to ensure legitimacy and quality,
                    giving investors confidence in the opportunities presented.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-4">
                <div className="mr-4">
                  <Check className="h-6 w-6 text-success-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Secure Transactions</h3>
                  <p className="text-gray-600">
                    Our platform ensures secure, transparent financial transactions between
                    creators and investors, protecting both parties.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-4">
                <div className="mr-4">
                  <Check className="h-6 w-6 text-success-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Ongoing Support</h3>
                  <p className="text-gray-600">
                    We provide resources, guidance, and support to help creators succeed and
                    help investors make informed decisions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-4">
                <div className="mr-4">
                  <Check className="h-6 w-6 text-success-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Community Focus</h3>
                  <p className="text-gray-600">
                    We foster a collaborative community where creators and investors can connect,
                    share insights, and build meaningful relationships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about how Fund Your Idea works.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-2">How do I create an account?</h3>
              <p className="text-gray-600">
                Creating an account is simple. Click on "Sign Up" in the navigation, enter your details,
                and choose whether you're joining as a creator or an investor. You'll then have access
                to all the features relevant to your role.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-2">How is funding distributed to creators?</h3>
              <p className="text-gray-600">
                When an investor decides to fund an idea, the agreed-upon amount is held in escrow until
                specific milestones are met. This ensures both parties are protected and that funds are
                used as intended. Detailed terms are established between creators and investors.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-2">What types of ideas can be shared on the platform?</h3>
              <p className="text-gray-600">
                We welcome a wide range of ideas across technology, consumer products, services, and more.
                All ideas should be original, feasible, and have the potential for growth. We do have guidelines
                to ensure quality and legitimacy, which you can find in our terms of service.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-2">How do investors benefit from funding ideas?</h3>
              <p className="text-gray-600">
                Investors receive equity, revenue sharing, or other agreed-upon returns based on the specific
                arrangements made with creators. Each investment opportunity is unique, with terms negotiated
                directly between the investor and the creator.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/faq" className="btn btn-outline">
              View All FAQs
            </Link>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white rounded-2xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join our community today and take the first step toward making your vision a reality
              or finding the next big idea to invest in.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="btn bg-white text-primary-800 hover:bg-gray-100">
                Create Your Account
              </Link>
              <Link to="/ideas" className="btn bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                Browse Ideas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;