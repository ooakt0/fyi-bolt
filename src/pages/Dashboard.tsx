import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import CreatorDashboard from '../components/dashboard/CreatorDashboard';
import InvestorDashboard from '../components/dashboard/InvestorDashboard';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {user?.role === 'creator' ? (
          <CreatorDashboard />
        ) : (
          <InvestorDashboard />
        )}
      </div>
    </div>
  );
};

export default Dashboard;