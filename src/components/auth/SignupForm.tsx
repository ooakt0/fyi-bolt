import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AlertCircle, Loader } from 'lucide-react';

const SignupForm: React.FC = () => {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'creator' | 'investor'>('creator');
  const [passwordError, setPasswordError] = useState('');
  
  const { signup, loading, error, verificationSent, clearError } = useAuthStore();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlRole = params.get('role');
    if (urlRole === 'investor' || urlRole === 'creator') {
      setRole(urlRole);
    }
  }, [location.search]);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await signup(name, email, password, role);
    } catch (error) {
      // Error is already handled in the store
    }
  };

  if (verificationSent) {
    return (
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-600">
            We've sent a verification link to <strong>{email}</strong>. 
            Please check your email and click the link to complete your registration.
          </p>
        </div>
        <div className="text-center">
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      {(error || passwordError) && (
        <div className="bg-error-50 border-l-4 border-error-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-3" />
            <p className="text-sm text-error-700">{error || passwordError}</p>
          </div>
          <button 
            onClick={() => {
              clearError();
              setPasswordError('');
            }}
            className="mt-2 text-xs text-error-700 hover:text-error-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="form-label">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          
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
              autoComplete="new-password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="form-label">
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          
          <div>
            <label className="form-label">I am a</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div
                className={`border rounded-md text-center py-2 cursor-pointer transition-colors ${
                  role === 'creator'
                    ? 'bg-primary-50 border-primary-600 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setRole('creator')}
              >
                <span className="font-medium">Creator</span>
                <p className="text-xs mt-1 text-gray-500">I have an idea to fund</p>
              </div>
              <div
                className={`border rounded-md text-center py-2 cursor-pointer transition-colors ${
                  role === 'investor'
                    ? 'bg-primary-50 border-primary-600 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setRole('investor')}
              >
                <span className="font-medium">Investor</span>
                <p className="text-xs mt-1 text-gray-500">I want to fund ideas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </label>
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
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;