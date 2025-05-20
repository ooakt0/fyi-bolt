import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Loader } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../store/authStore/supabaseClient';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar_url: user?.profileImage || '',
  });

  // Additional fields for creators
  const [creatorFields, setCreatorFields] = useState({
    expertise: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
  });

  // Additional fields for investors
  const [investorFields, setInvestorFields] = useState({
    investment_focus: '',
    investment_range: '',
    linkedin_url: '',
    company: '',
    position: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchExtendedProfile = async () => {
      if (!user) return;

      const { data: extendedData, error } = await supabase
        .from(user.role === 'creator' ? 'creator_profiles' : 'investor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && extendedData) {
        if (user.role === 'creator') {
          setCreatorFields(extendedData);
        } else {
          setInvestorFields(extendedData);
        }
      }
    };

    fetchExtendedProfile();
  }, [user, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Update role-specific profile
      if (!user) throw new Error('User not found');

      if (user.role === 'creator') {
        const { error: creatorError } = await supabase
          .from('creator_profiles')
          .upsert({
            user_id: user.id,
            ...creatorFields,
            updated_at: new Date().toISOString(),
          });

        if (creatorError) throw creatorError;
      } else {
        const { error: investorError } = await supabase
          .from('investor_profiles')
          .upsert({
            user_id: user.id,
            ...investorFields,
            updated_at: new Date().toISOString(),
          });

        if (investorError) throw investorError;
      }

      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile!');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt={formData.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary-700 flex items-center justify-center border-4 border-white">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{formData.name || 'Your Name'}</h1>
                <p className="text-primary-100">
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : ''}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  className="input bg-gray-50"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {user?.role === 'creator' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Areas of Expertise
                    </label>
                    <input
                      type="text"
                      value={creatorFields.expertise}
                      onChange={(e) => setCreatorFields({ ...creatorFields, expertise: e.target.value })}
                      className="input"
                      placeholder="e.g., Mobile Development, AI, Blockchain"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={creatorFields.portfolio_url}
                      onChange={(e) => setCreatorFields({ ...creatorFields, portfolio_url: e.target.value })}
                      className="input"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={creatorFields.linkedin_url}
                        onChange={(e) => setCreatorFields({ ...creatorFields, linkedin_url: e.target.value })}
                        className="input"
                        placeholder="https://linkedin.com/in/your-profile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={creatorFields.github_url}
                        onChange={(e) => setCreatorFields({ ...creatorFields, github_url: e.target.value })}
                        className="input"
                        placeholder="https://github.com/your-username"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Focus
                    </label>
                    <input
                      type="text"
                      value={investorFields.investment_focus}
                      onChange={(e) => setInvestorFields({ ...investorFields, investment_focus: e.target.value })}
                      className="input"
                      placeholder="e.g., SaaS, FinTech, Healthcare"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Range
                    </label>
                    <input
                      type="text"
                      value={investorFields.investment_range}
                      onChange={(e) => setInvestorFields({ ...investorFields, investment_range: e.target.value })}
                      className="input"
                      placeholder="e.g., $10K - $50K"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={investorFields.company}
                        onChange={(e) => setInvestorFields({ ...investorFields, company: e.target.value })}
                        className="input"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        value={investorFields.position}
                        onChange={(e) => setInvestorFields({ ...investorFields, position: e.target.value })}
                        className="input"
                        placeholder="Your role"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={investorFields.linkedin_url}
                      onChange={(e) => setInvestorFields({ ...investorFields, linkedin_url: e.target.value })}
                      className="input"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary min-w-[100px]"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;