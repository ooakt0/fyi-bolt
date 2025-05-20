import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import CreatorDashboard from '../components/dashboard/CreatorDashboard';
import InvestorDashboard from '../components/dashboard/InvestorDashboard';
import { supabase } from '../store/authStore/supabaseClient';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [userIdeas, setUserIdeas] = useState<any[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      if (user && user.id) {
        setLoadingIdeas(true);
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .eq('creatorId', user.id);
        if (!error && data) {
          setUserIdeas(data);
        }
        setLoadingIdeas(false);
      }
    };
    fetchIdeas();
  }, [user]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {user?.role === 'creator' ? (
          <CreatorDashboard userIdeas={userIdeas} loadingIdeas={loadingIdeas} />
        ) : (
          <InvestorDashboard />
        )}
      </div>
    </div>
  );
};

export default Dashboard;