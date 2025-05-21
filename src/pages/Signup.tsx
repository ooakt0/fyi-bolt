import React from 'react';
import SignupForm from '../components/auth/SignupForm';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;