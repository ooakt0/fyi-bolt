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
    name: '',
    email: '',
    bio: '',
    avatar_url: '',
    expertise: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    investment_focus: '',
    investment_range: '',
    company: '',
    position: '',
    role: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          expertise: data.expertise || '',
          portfolio_url: data.portfolio_url || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          investment_focus: data.investment_focus || '',
          investment_range: data.investment_range || '',
          company: data.company || '',
          position: data.position || '',
          role: data.role || user.role || '',
        });
      }
    };
    fetchProfile();
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          expertise: formData.expertise,
          portfolio_url: formData.portfolio_url,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          investment_focus: formData.investment_focus,
          investment_range: formData.investment_range,
          company: formData.company,
          position: formData.position,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      if (error) throw error;
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
                  {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : ''}
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
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  name="email"
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
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="input"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {formData.role === 'creator' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Areas of Expertise
                    </label>
                    <input
                      type="text"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
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
                      name="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={handleChange}
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
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
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
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleChange}
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
                      name="investment_focus"
                      value={formData.investment_focus}
                      onChange={handleChange}
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
                      name="investment_range"
                      value={formData.investment_range}
                      onChange={handleChange}
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
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
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
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
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
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
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