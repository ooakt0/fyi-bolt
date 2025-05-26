import React from 'react';
import { useParams } from 'react-router-dom';
import IdeaForm from './IdeaForm';
import { supabase } from '../store/authStore/supabaseClient';

const EditIdeaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchIdea = async () => {
      const { data, error } = await supabase.from('ideas').select('*').eq('id', id).single();
      if (!error && data) setIdea(data);
      setLoading(false);
    };
    fetchIdea();
  }, [id]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!idea) return <div className="pt-24 text-center text-red-500">Idea not found.</div>;
  return <IdeaForm ideaToEdit={idea} />;
};

export default EditIdeaPage;