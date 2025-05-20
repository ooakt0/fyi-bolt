import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, DollarSign, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { mockIdeas, getMessagesForUser } from '../../data/mockData';
import IdeaCard from '../ideas/IdeaCard';

const CreatorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  // Get ideas created by the current user
  const userIdeas = user ? mockIdeas.filter(idea => idea.creatorId === user.id) : [];
  
  // Get unread messages
  const userMessages = user ? getMessagesForUser(user.id) : [];
  const unreadMessages = userMessages.filter(msg => !msg.read && msg.receiverId === user?.id);
  
  // Calculate total funding raised
  const totalFunding = userIdeas.reduce((sum, idea) => sum + idea.currentFunding, 0);
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-1 text-gray-600">Manage your ideas and check your funding status</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/ideas/new" className="btn btn-primary inline-flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Idea
            </Link>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-primary-100 text-primary-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Funding</p>
              <h3 className="text-xl font-bold text-gray-900">${totalFunding.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-secondary-100 text-secondary-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Ideas</p>
              <h3 className="text-xl font-bold text-gray-900">{userIdeas.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-accent-100 text-accent-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unread Messages</p>
              <h3 className="text-xl font-bold text-gray-900">{unreadMessages.length}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ideas Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Ideas</h2>
          <Link to="/ideas/manage" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        
        {userIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
              <PlusCircle className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No ideas yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              You haven't created any ideas yet. Click the button below to get started and share your vision!
            </p>
            <div className="mt-6">
              <Link to="/ideas/new" className="btn btn-primary">
                Create your first idea
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Messages Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
          <Link to="/messages" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        
        {userMessages.length > 0 ? (
          <div className="space-y-4">
            {userMessages.slice(0, 3).map((message) => (
              <div 
                key={message.id} 
                className={`p-4 rounded-lg border ${
                  !message.read && message.receiverId === user?.id
                    ? 'bg-primary-50 border-primary-100'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {message.senderId === user?.id ? 'You' : 'Investor'}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{message.content}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleDateString()} at {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-900">No messages yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              When investors contact you about your ideas, messages will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;