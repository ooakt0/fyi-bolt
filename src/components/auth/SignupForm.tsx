import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { AlertCircle, Loader, Mail, Eye, EyeOff, Lock, User, Users, Briefcase } from 'lucide-react';

// Glassmorphism card component
const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      whileHover={{ 
        boxShadow: '0 12px 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const SignupForm: React.FC = () => {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <GlassCard className="p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 mb-6"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Mail className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
          <p className="text-gray-300 mb-6">
            We've sent a verification link to <strong className="text-white">{email}</strong>. 
            Please check your email and click the link to complete your registration.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Return to login
            </Link>
          </motion.div>
        </motion.div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {(error || passwordError) && (
          <motion.div 
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-400">{error || passwordError}</p>
            </div>
            <button 
              onClick={() => {
                clearError();
                setPasswordError('');
              }}
              className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="input pl-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input pl-12 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <motion.button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="form-label">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input pl-12 pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <motion.button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.button>
              </div>
            </div>
            
            <div>
              <label className="form-label">I am a</label>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <motion.div
                  className={`border rounded-xl text-center py-4 cursor-pointer transition-all duration-300 ${
                    role === 'creator'
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'border-white/20 text-gray-300 hover:bg-white/5 hover:border-white/30'
                  }`}
                  onClick={() => setRole('creator')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium block">Creator</span>
                  <p className="text-xs mt-1 opacity-75">I have an idea to fund</p>
                </motion.div>
                <motion.div
                  className={`border rounded-xl text-center py-4 cursor-pointer transition-all duration-300 ${
                    role === 'investor'
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                      : 'border-white/20 text-gray-300 hover:bg-white/5 hover:border-white/30'
                  }`}
                  onClick={() => setRole('investor')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Briefcase className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium block">Investor</span>
                  <p className="text-xs mt-1 opacity-75">I want to fund ideas</p>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700 mt-1"
            />
            <label htmlFor="terms" className="ml-3 block text-sm text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-blue-400 hover:text-blue-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div className="space-y-4">
            <motion.button
              type="submit"
              className="btn btn-primary w-full py-3"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader className="h-5 w-5 mr-2" />
                  </motion.div>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </GlassCard>
  );
};

export default SignupForm;