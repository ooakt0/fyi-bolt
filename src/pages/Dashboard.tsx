import React, { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import CreatorDashboard from '../components/dashboard/CreatorDashboard';
import InvestorDashboard from '../components/dashboard/InvestorDashboard';
import { useIdeasStore } from '../store/authStore/ideasStore';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { ideas, loading, fetchIdeas } = useIdeasStore();

  useEffect(() => {
    if (ideas.length === 0) fetchIdeas();
  }, [ideas.length, fetchIdeas]);

  // Only show ideas created by the current user
  const userIdeas = useMemo(
    () => (user ? ideas.filter((idea) => idea.creatorId === user.id) : []),
    [ideas, user]
  );

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {user?.role === 'creator' ? (
          <CreatorDashboard userIdeas={userIdeas} loadingIdeas={loading} />
        ) : (
          <InvestorDashboard />
        )}
      </div>
    </div>
  );
};

export default Dashboard;