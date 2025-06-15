import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Send } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { generateChatResponse } from '../../services/chatgpt';
import { useAuthStore } from '../../store/authStore';

const GlassPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl"
    style={{
      background: 'linear-gradient(135deg, rgba(245, 242, 242, 0.1) 0%, rgba(255,255,255,0.05) 100%)',
      boxShadow: '0 8px 32px rgba(247, 240, 240, 0.3), inset 0 1px 0 rgba(240, 232, 232, 0.1)',
    }}
  >
    {children}
  </motion.div>
);

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, isLoading } = useChatStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isOpen && !messages.length) {
      addMessage({
        role: 'assistant',
        content: "Hi! I'm your virtual guide. Ask me anything about FundYourIdea!",
      });
    }
  }, [isOpen, messages.length, addMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    addMessage({ role: 'user', content: userMessage });
    setMessage('');

    try {
      const response = await generateChatResponse(userMessage, {
        isAuthenticated,
        userRole: user?.role as 'creator' | 'investor' | undefined,
      });
      addMessage({ role: 'assistant', content: response });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      });
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed right-10 bottom-10 z-50"
        whileHover={{ scale: 1.5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
      >
        <GlassPanel>
          <div className="p-2 relative bg-white rounded-full">
            <img
              src="/images/Chatbot Mascot.jpg"
              alt="Chat Assistant"
              className="h-10 w-10 rounded-full object-cover"
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0)', '0 0 0 8px rgba(59, 130, 246, 0)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </GlassPanel>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isMinimized ? { opacity: 1, y: 0, scale: 0.5 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <GlassPanel>
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="/images/Chatbot Mascot.jpg"
                    alt="Chat Assistant"
                    className="h-8 w-8 rounded-full object-cover mr-3"
                  />
                  <span className="font-semibold text-white">FundYourIdea Guide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Minus className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="h-96 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-blue-500/20 text-blue-100'
                              : 'bg-white/10 text-gray-200'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="bg-white/10 p-3 rounded-2xl text-gray-200">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Typing...
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
                      >
                        <Send className="h-5 w-5 text-white" />
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
