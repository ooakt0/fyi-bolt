import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AlertCircle, Loader, Mail } from 'lucide-react';
import { supabase } from '../../store/authStore/supabaseClient';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const { login, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSent(false);
    try {
      // Use imported supabase client
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setResetError(err?.message || 'Failed to send reset email');
    }
  };

  if (showReset) {
    return (
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
          <p className="text-gray-600 mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        {resetError && (
          <div className="bg-error-50 border-l-4 border-error-500 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-error-500 mr-3" />
              <p className="text-sm text-error-700">{resetError}</p>
            </div>
            <button
              onClick={() => setResetError('')}
              className="mt-2 text-xs text-error-700 hover:text-error-600 underline"
            >
              Dismiss
            </button>
          </div>
        )}
        {resetSent ? (
          <div className="text-green-700 text-center">
            Password reset email sent! Please check your inbox.
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="reset-email" className="form-label">
                Email address
              </label>
              <input
                id="reset-email"
                name="reset-email"
                type="email"
                autoComplete="email"
                required
                className="input"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full py-2.5"
            >
              Send reset link
            </button>
          </form>
        )}
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 underline text-sm"
            onClick={() => setShowReset(false)}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      {error && (
        <div className="bg-error-50 border-l-4 border-error-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-3" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
          <button 
            onClick={clearError}
            className="mt-2 text-xs text-error-700 hover:text-error-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              className="font-medium text-primary-600 hover:text-primary-500 bg-transparent border-0 p-0"
              onClick={() => setShowReset(true)}
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            className="btn btn-primary w-full py-2.5"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in with Email'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;