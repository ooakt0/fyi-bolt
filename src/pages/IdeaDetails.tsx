import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Share2, DollarSign, MessageSquare, Bookmark, Calendar, BarChart, Tag, Award } from 'lucide-react';
import { Facebook, Instagram, Twitter, Linkedin, Copy } from 'lucide-react';
import { mockIdeas } from '../data/mockData';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../store/authStore/supabaseClient';

const IdeaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [idea, setIdea] = useState<any>(location.state?.idea || null);
  const [loading, setLoading] = useState(!location.state?.idea);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  // const [paymentMethod, setPaymentMethod] = useState<'khalti' | 'stripe' | null>(null);
  // const [cardDetails, setCardDetails] = useState({
  //   cardNumber: '',
  //   expiry: '',
  //   cvc: '',
  //   amount: idea?.fundingGoal ? idea.fundingGoal - idea.currentFunding : '',
  // });
  // const [investLoading, setInvestLoading] = useState(false);
  // const [investSuccess, setInvestSuccess] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!idea && id) {
        setLoading(true);
        const { data } = await supabase.from('ideas').select('*').eq('id', id).single();
        if (data) setIdea(data);
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id, idea]);

  // Fetch saved ideas for this investor
  useEffect(() => {
    const fetchSavedIdeas = async () => {
      if (!user || user.role !== 'investor') return;
      const { data, error } = await supabase
        .from('saved_ideas')
        .select('idea_id')
        .eq('investor_id', user.id);
      if (!error && data) {
        setSavedIdeas(data.map((row: any) => row.idea_id));
      }
    };
    fetchSavedIdeas();
  }, [user]);

  // Save/Unsave handler
  const handleToggleSave = async () => {
    if (!user || user.role !== 'investor') {
      alert('You must be logged in as an investor to save ideas.');
      return;
    }
    setSaving(true);
    const isAlreadySaved = savedIdeas.includes(idea.id);
    if (isAlreadySaved) {
      await supabase
        .from('saved_ideas')
        .delete()
        .eq('investor_id', user.id)
        .eq('idea_id', idea.id);
    } else {
      await supabase.from('saved_ideas').insert([
        { investor_id: user.id, idea_id: idea.id }
      ]);
    }
    // Refresh saved ideas
    const { data } = await supabase
      .from('saved_ideas')
      .select('idea_id')
      .eq('investor_id', user.id);
    if (data) setSavedIdeas(data.map((row: any) => row.idea_id));
    setSaving(false);
  };

  // If idea not found, redirect to ideas page
  if (!idea && !loading) {
    return <Navigate to="/ideas" />;
  }

  const fundingPercentage = Math.min(Math.round((idea.currentFunding / idea.fundingGoal) * 100), 100);
  const createdDate = new Date(idea.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'investor') {
      alert('You must be logged in as an investor to send messages.');
      return;
    }
    // Find the creator's user ID
    const recipientId = idea.creatorId;
    if (!recipientId) {
      alert('Creator information not found.');
      return;
    }
    // Save message to Supabase
    const { error } = await supabase.from('messages').insert([
      {
        idea_id: idea.id,
        sender_id: user.id,
        recipient_id: recipientId,
        content: message,
      },
    ]);
    if (error) {
      alert('Failed to send message. Please try again.');
      return;
    }
    alert('Message sent successfully!');
    setMessage('');
    setShowContactForm(false);
  };

  // const handleInvestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  // };

  // const handleInvestSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setInvestLoading(true);
  //   // Simulate payment processing
  //   setTimeout(() => {
  //     setInvestLoading(false);
  //     setInvestSuccess(true);
  //     setTimeout(() => {
  //       setShowInvestModal(false);
  //       setInvestSuccess(false);
  //       setCardDetails({ cardNumber: '', expiry: '', cvc: '', amount: idea?.fundingGoal ? idea.fundingGoal - idea.currentFunding : '' });
  //     }, 1500);
  //   }, 1200);
  // };

  const shareUrl = window.location.origin + `/ideas/${idea.id}`;
  const shareText = `Check out this idea on Fund Your Idea: ${idea.title} - ${idea.about_this_idea}\nSee more: ${shareUrl}`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        // Instagram does not support direct web sharing, so show a message
        alert('Instagram does not support direct web sharing. Copy the link and share it on your Instagram profile or story.');
        return;
      case 'copy':
        navigator.clipboard.writeText(shareText);
        alert('Link and info copied to clipboard!');
        return;
      default:
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Close share menu when clicking outside
  React.useEffect(() => {
    if (!showShareMenu) return;
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById('share-menu');
      if (menu && !menu.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showShareMenu]);

  return (
    loading ? (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading idea...</div>
      </div>
    ) : (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
        <div className="container-custom">
          <div className="mb-8">
            <Link
              to="#"
              onClick={e => {
                e.preventDefault();
                if (location.key !== 'default') {
                  navigate(-1);
                } else {
                  navigate('/ideas');
                }
              }}
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
            >
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
                    <button
                      className={`btn btn-outline flex items-center ${savedIdeas.includes(idea.id) ? 'text-primary-600' : ''}`}
                      onClick={handleToggleSave}
                      disabled={saving}
                    >
                      <Bookmark className="h-4 w-4 mr-2" fill={savedIdeas.includes(idea.id) ? '#2563eb' : 'none'} />
                      {savedIdeas.includes(idea.id) ? 'Saved' : 'Save'}
                    </button>
                    <div className="relative flex items-center">
                      <button className="btn btn-outline flex items-center" onClick={() => setShowShareMenu((v) => !v)} type="button">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </button>
                      {showShareMenu && (
                        <div id="share-menu" className="absolute z-50 left-full top-1/2 -translate-y-1/2 ml-2 bg-white rounded shadow-lg p-2 flex flex-row gap-2 min-w-[40px] animate-fade-in">
                          <div role="button" tabIndex={0} className="flex items-center justify-center hover:bg-gray-100 p-2 rounded cursor-pointer" onClick={() => handleShare('facebook')} onKeyPress={e => {if(e.key==='Enter'){handleShare('facebook')}}} title="Share on Facebook">
                            <Facebook className="h-5 w-5 text-blue-600" />
                          </div>
                          <div role="button" tabIndex={0} className="flex items-center justify-center hover:bg-gray-100 p-2 rounded cursor-pointer" onClick={() => handleShare('twitter')} onKeyPress={e => {if(e.key==='Enter'){handleShare('twitter')}}} title="Share on X (Twitter)">
                            <Twitter className="h-5 w-5 text-sky-500" />
                          </div>
                          <div role="button" tabIndex={0} className="flex items-center justify-center hover:bg-gray-100 p-2 rounded cursor-pointer" onClick={() => handleShare('linkedin')} onKeyPress={e => {if(e.key==='Enter'){handleShare('linkedin')}}} title="Share on LinkedIn">
                            <Linkedin className="h-5 w-5 text-blue-700" />
                          </div>
                          <div role="button" tabIndex={0} className="flex items-center justify-center hover:bg-gray-100 p-2 rounded cursor-pointer" onClick={() => handleShare('instagram')} onKeyPress={e => {if(e.key==='Enter'){handleShare('instagram')}}} title="Share on Instagram">
                            <Instagram className="h-5 w-5 text-pink-500" />
                          </div>
                          <div role="button" tabIndex={0} className="flex items-center justify-center hover:bg-gray-100 p-2 rounded cursor-pointer" onClick={() => handleShare('copy')} onKeyPress={e => {if(e.key==='Enter'){handleShare('copy')}}} title="Copy Link">
                            <Copy className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Idea</h2>
                <p className="text-gray-700 mb-4">
                  {idea.about_this_idea}
                </p>

                <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {idea.key_features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Market Opportunity</h3>
                <p className="text-gray-700">
                 {idea.market_opportunity}
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
                  <button className="btn btn-primary w-full" onClick={() => setShowInvestModal(true)}>
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

        {/* Invest Modal */}
        {showInvestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative animate-fade-in">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => {
                  setShowInvestModal(false);
                  // setPaymentMethod(null);
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">Invest in this Idea</h2>
              <div className="space-y-6 text-center">
                <p className="text-gray-700 text-lg font-medium">
                  Online payment is coming soon.<br />
                  To invest, please reach out to <a href="mailto:invest@fundyouridea.ooaktech.com" className="text-primary-600 underline">invest@fundyouridea.ooaktech.com</a>
                </p>
                <div className="space-y-3">
                  <button className="btn btn-primary w-full" disabled>
                    Invest via Khalti (Coming Soon)
                  </button>
                  <button className="btn btn-outline w-full" disabled>
                    Invest via Stripe (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default IdeaDetails;