import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas';
import IdeaDetails from './pages/IdeaDetails';
import HowItWorks from './pages/HowItWorks';
import IdeaForm from './pages/IdeaForm';
import SavedIdeas from './pages/SavedIdeas';
import { useAuthStore, initializeAuthStore } from './store/authStore';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Initialize auth state from localStorage
  useEffect(() => {
    initializeAuthStore();
  }, []);
  
  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/ideas/new" element={
              <ProtectedRoute>
                <IdeaForm />
              </ProtectedRoute>
            } />
            <Route path="/ideas/:id" element={<IdeaDetails />} />
            <Route path="/ideas/saved" element={
              <ProtectedRoute>
                <SavedIdeas />
              </ProtectedRoute>
            } />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;