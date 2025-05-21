import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../store/authStore/supabaseClient';
import IdeaCard from '../components/ideas/IdeaCard';
import { BookmarkPlus } from 'lucide-react';

const SavedIdeas: React.FC = () => {
  const { user } = useAuthStore();
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedIdeas = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_ideas')
        .select('idea_id, ideas(*)')
        .eq('investor_id', user.id);
      if (!error && data) {
        setSavedIdeas(data.map((row: any) => row.ideas));
      }
      setLoading(false);
    };
    fetchSavedIdeas();
  }, [user]);

  // Save/Unsave handler
  const handleToggleSave = async (ideaId: string) => {
    if (!user || user.role !== 'investor') {
      alert('You must be logged in as an investor to save ideas.');
      return;
    }
    const isAlreadySaved = savedIdeas.some((idea) => idea.id === ideaId);
    if (isAlreadySaved) {
      // Unsave: delete from saved_ideas
      await supabase
        .from('saved_ideas')
        .delete()
        .eq('investor_id', user.id)
        .eq('idea_id', ideaId);
    } else {
      // Save: insert into saved_ideas
      await supabase.from('saved_ideas').insert([
        { investor_id: user.id, idea_id: ideaId }
      ]);
    }
    // Refresh saved ideas
    const { data } = await supabase
      .from('saved_ideas')
      .select('idea_id, ideas(*)')
      .eq('investor_id', user.id);
    if (data) setSavedIdeas(data.map((row: any) => row.ideas));
  };

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Ideas</h1>
        <div className="mb-8 flex items-start">
          <button
            className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
            onClick={() => window.history.back()}
          >
            ← Back to dashboard
          </button>
        </div>
        {loading ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">Loading saved ideas...</div>
        ) : savedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                isSaved
                onSave={() => handleToggleSave(idea.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <BookmarkPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved ideas yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Click the bookmark icon on any idea to save it for later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedIdeas;
