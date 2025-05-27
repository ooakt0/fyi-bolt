import React, { useEffect, useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useAuthStore } from '../store/authStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore/supabaseClient';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for access_token in URL hash (for Supabase email confirmation)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      setChecking(true);
      // Supabase will automatically handle the session, just wait for auth state
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          setChecking(false);
          navigate('/dashboard', { replace: true });
        } else if (event === 'SIGNED_OUT') {
          setChecking(false);
          setError('Session expired or invalid. Please log in again.');
        }
      });
      // Also check session directly in case already set
      supabase.auth.getSession().then(({ data, error }) => {
        if (data?.session && data.session.user) {
          setChecking(false);
          navigate('/dashboard', { replace: true });
        } else if (error) {
          setChecking(false);
          setError('Could not complete sign in. Please try again.');
        }
      });
      return () => {
        listener?.subscription.unsubscribe();
      };
    }
  }, [navigate]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <div className="text-lg text-gray-600">Completing sign in...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;