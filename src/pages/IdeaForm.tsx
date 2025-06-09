import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../store/authStore/supabaseClient';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, ArrowRight, Check, Zap, Lightbulb, Upload, FileText } from 'lucide-react';

// Animated background component
const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, #030303 0%, #0a0a0a 50%, #030303 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          background: [
            'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
    </div>
  );
};

// Glassmorphism card component
const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      whileHover={hover ? { 
        scale: 1.02,
        boxShadow: '0 12px 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
      } : undefined}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const initialForm: Record<string, string> = {
  title: '',
  description: '',
  imageUrl: '',
  category: '',
  stage: '',
  fundingGoal: '',
  tags: '',
  aboutThisIdea: '',
  keyFeatures: '',
  marketOpportunity: '',
};

interface IdeaFormProps {
  ideaToEdit?: any;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ ideaToEdit }) => {
  const [form, setForm] = useState(ideaToEdit ? {
    ...initialForm,
    ...ideaToEdit,
    aboutThisIdea: ideaToEdit?.about_this_idea || '',
    keyFeatures: Array.isArray(ideaToEdit?.key_features) ? ideaToEdit.key_features.join('\n') : (ideaToEdit?.key_features || ''),
    marketOpportunity: ideaToEdit?.market_opportunity || '',
    tags: Array.isArray(ideaToEdit?.tags) ? ideaToEdit.tags.join(', ') : (ideaToEdit?.tags || ''),
    fundingGoal: ideaToEdit?.fundingGoal?.toString() || '',
  } : initialForm);
  const [step, setStep] = useState<'form' | 'verify' | 'submitting' | 'done'>('form');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const steps = [
    {
      label: 'Title',
      description: 'Enter a concise, memorable title for your idea.',
      name: 'title',
      type: 'text',
      placeholder: 'e.g. Smart Plant Monitor',
    },
    {
      label: 'Description',
      description: '',
      name: 'description',
      type: 'custom-description',
      placeholder: '',
    },
    {
      label: 'Image URL',
      description: 'Paste a URL to an image that represents your idea.',
      name: 'imageUrl',
      type: 'text',
      placeholder: 'e.g. https://example.com/my-image.jpg',
    },
    {
      label: 'Category',
      description: 'Select the category that best fits your idea, or add a new one.',
      name: 'category',
      type: 'select-or-custom',
      options: [
        'Mobile App',
        'Healthcare',
        'Food & Beverage',
        'Education',
        'Productivity',
        'Transportation',
        'FinTech',
        'E-commerce',
        'SaaS',
        'Social Impact',
        'Other',
      ],
      placeholder: 'Choose a category or enter your own',
    },
    {
      label: 'Stage',
      description: 'Choose the current development stage of your idea.',
      name: 'stage',
      type: 'select',
      options: ['concept', 'prototype', 'mvp', 'growth', 'production'],
      placeholder: 'Select stage',
    },
    {
      label: 'Funding Goal (USD)',
      description: 'Specify the total amount you need to reach your next milestone.',
      name: 'fundingGoal',
      type: 'number',
      placeholder: 'e.g. 50000',
    },
    {
      label: 'Tags',
      description: 'Add comma-separated tags to help people discover your idea.',
      name: 'tags',
      type: 'text',
      placeholder: 'e.g. sustainability, IoT, community',
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const currentStep = steps[activeStep];

  const handleStepChange = (dir: 1 | -1) => {
    setActiveStep((prev) => prev + dir);
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (currentStep.type === 'custom-description') return;
    setForm({ ...form, [currentStep.name]: e.target.value });
  };

  const isFieldValid = () => {
    if (currentStep.type === 'custom-description') {
      return (
        (form.aboutThisIdea && form.aboutThisIdea.trim().length > 0) &&
        (form.keyFeatures && form.keyFeatures.trim().length > 0) &&
        (form.marketOpportunity && form.marketOpportunity.trim().length > 0)
      );
    }
    const value = form[currentStep.name];
    if (currentStep.type === 'number') return value && Number(value) > 0;
    return value && value.trim().length > 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm((f: Record<string, string>) => ({
      ...f,
      description: `About This Idea:\n${f.aboutThisIdea || ''}\n\nKey Features:\n${f.keyFeatures || ''}\n\nMarket Opportunity:\n${f.marketOpportunity || ''}`.trim()
    }));
    setStep('verify');
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setStep('submitting');
    setSubmitError(null);
    if (!user) {
      setStep('form');
      return;
    }
    try {
      let result;
      if (ideaToEdit) {
        result = await supabase.from('ideas').update({
          title: form.title,
          description: form.description,
          about_this_idea: form.aboutThisIdea,
          key_features: form.keyFeatures.split('\n').map((s: string) => s.trim()).filter(Boolean),
          market_opportunity: form.marketOpportunity,
          imageUrl: form.imageUrl,
          category: form.category,
          stage: form.stage,
          fundingGoal: Number(form.fundingGoal),
          tags: form.tags.split(',').map((t: string) => t.trim()),
          ...(form.supportingDocUrl ? { supporting_doc_url: form.supportingDocUrl, supporting_doc_name: form.supportingDoc } : {}),
        }).eq('id', ideaToEdit.id);
      } else {
        result = await supabase.from('ideas').insert([
          {
            title: form.title,
            description: form.description,
            about_this_idea: form.aboutThisIdea,
            key_features: form.keyFeatures.split('\n').map((s: string) => s.trim()).filter(Boolean),
            market_opportunity: form.marketOpportunity,
            imageUrl: form.imageUrl,
            category: form.category,
            stage: form.stage,
            fundingGoal: Number(form.fundingGoal),
            funds_collected: form.fundsCollected ? Number(form.fundsCollected) : 0,
            tags: form.tags.split(',').map((t: string) => t.trim()),
            creatorId: user.id,
            creatorName: user.name,
            currentFunding: 0,
            createdAt: new Date().toISOString(),
            approved: false,
            ...(form.supportingDocUrl ? { supporting_doc_url: form.supportingDocUrl, supporting_doc_name: form.supportingDoc } : {}),
          },
        ]);
      }
      if (result.error) throw result.error;
      setStep('done');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setSubmitError('Failed to submit idea. Please try again.');
      setStep('verify');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  React.useEffect(() => {
    if (ideaToEdit) {
      setStep('verify');
    }
  }, [ideaToEdit]);

  const uploadIdeaDocument = async (file: File, userId: string) => {
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('idea-docs').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;
    const { publicUrl } = supabase.storage.from('idea-docs').getPublicUrl(filePath).data;
    return publicUrl;
  };

  if (step === 'verify') {
    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-4xl mx-auto px-4">
            <GlassCard className="p-12\" hover={false}>
              <motion.button
                className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                onClick={handleBackToDashboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="mr-2 h-4 w-4 inline" />
                Back to Dashboard
              </motion.button>
              
              <motion.h2 
                className="text-4xl font-bold mb-8 text-center"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Verify Your Idea Details
              </motion.h2>
              
              <div className="space-y-8">
                {[
                  { label: 'Title', value: form.title },
                  { label: 'About This Idea', value: form.aboutThisIdea, multiline: true },
                  { label: 'Key Features', value: form.keyFeatures, list: true },
                  { label: 'Market Opportunity', value: form.marketOpportunity, multiline: true },
                  { label: 'Image URL', value: form.imageUrl, url: true },
                  { label: 'Category', value: form.category },
                  { label: 'Stage', value: form.stage },
                  { label: 'Funding Goal (USD)', value: `$${form.fundingGoal}` },
                  { label: 'Tags', value: form.tags, tags: true }
                ].map((field, index) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="text-base font-semibold text-blue-400 mb-2">{field.label}</div>
                    {field.multiline ? (
                      <div className="bg-white/5 rounded-xl border border-white/10 px-6 py-4 text-gray-300 whitespace-pre-line">
                        {field.value}
                      </div>
                    ) : field.list ? (
                      <ul className="bg-white/5 rounded-xl border border-white/10 px-6 py-4 text-gray-300 list-disc list-inside">
                        {field.value.split('\n').filter(Boolean).map((feature: string, idx: number) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    ) : field.url ? (
                      <div className="bg-white/5 rounded-xl border border-white/10 px-6 py-4 text-gray-300 break-all">
                        {field.value}
                      </div>
                    ) : field.tags ? (
                      <div className="bg-white/5 rounded-xl border border-white/10 px-6 py-4">
                        {field.value.split(',').map((tag: string, idx: number) => (
                          <span key={idx} className="inline-block bg-blue-500/20 text-blue-400 rounded-full px-3 py-1 mr-2 mb-2 text-xs font-medium border border-blue-500/30">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/5 rounded-xl border border-white/10 px-6 py-4 text-gray-300">
                        {field.value}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {form.supportingDoc && form.supportingDocUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                  >
                    <div className="text-base font-semibold text-blue-400 mb-2">Supporting Document</div>
                    <a 
                      href={form.supportingDocUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 underline flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {form.supportingDoc}
                    </a>
                  </motion.div>
                )}
              </div>
              
              {submitError && (
                <motion.div 
                  className="text-red-400 mt-6 text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {submitError}
                </motion.div>
              )}
              
              <motion.div 
                className="flex gap-6 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <motion.button 
                  className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-60" 
                  onClick={handleConfirm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check className="mr-2 h-5 w-5 inline" />
                  Confirm & Create
                </motion.button>
                <motion.button 
                  className="flex-1 py-4 rounded-xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300" 
                  onClick={() => setStep('form')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Edit
                </motion.button>
              </motion.div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <GlassCard className="p-12 text-center max-w-lg">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 mb-8"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">Idea Created!</h2>
            <p className="text-gray-300 mb-8">Your idea has been successfully created and is pending approval.</p>
            <motion.button
              className="btn btn-primary"
              onClick={handleBackToDashboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard
            </motion.button>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-4xl mx-auto px-4">
          <GlassCard className="p-12" hover={false}>
            {/* Back to Dashboard button */}
            <motion.button
              className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              onClick={handleBackToDashboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="mr-2 h-4 w-4 inline" />
              Back to Dashboard
            </motion.button>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-12 px-4">
              {steps.map((step, idx) => (
                <React.Fragment key={step.label}>
                  <motion.div 
                    className="flex flex-col items-center z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <motion.div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                        idx < activeStep ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white' :
                        idx === activeStep ? 'bg-blue-500/20 border-blue-400 text-blue-400' :
                        'bg-white/5 border-white/20 text-gray-400'
                      }`}
                      whileHover={{ scale:  1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {idx < activeStep ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{idx + 1}</span>
                      )}
                    </motion.div>
                    <span className={`mt-3 text-xs font-medium ${idx === activeStep ? 'text-blue-400' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </motion.div>
                  {idx < steps.length - 1 && (
                    <motion.div 
                      className={`flex-1 h-1 mx-2 md:mx-4 rounded-full transition-all duration-300 ${
                        idx < activeStep ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-white/10'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 + 0.3 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Step Content */}
            <motion.div 
              className="transition-all duration-300"
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 mr-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Lightbulb className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <label className="block text-2xl font-bold text-white mb-1">{currentStep.label}</label>
                  <p className="text-sm text-gray-400">{currentStep.description}</p>
                </div>
              </div>
              
              {currentStep.type === 'custom-description' ? (
                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-semibold text-white mb-2">About This Idea</label>
                    <p className="text-xs text-gray-400 mb-3">Describe the core concept, vision, and what problem your idea solves.</p>
                    <textarea
                      name="aboutThisIdea"
                      className="input"
                      placeholder="Describe the core concept and vision..."
                      value={form.aboutThisIdea || ''}
                      onChange={e => setForm({ ...form, aboutThisIdea: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-white mb-2">Key Features</label>
                    <p className="text-xs text-gray-400 mb-3">List the main features and differentiators that make your idea unique.</p>
                    <textarea
                      name="keyFeatures"
                      className="input"
                      placeholder="List the main features..."
                      value={form.keyFeatures || ''}
                      onChange={e => setForm({ ...form, keyFeatures: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-white mb-2">Market Opportunity</label>
                    <p className="text-xs text-gray-400 mb-3">Explain the market need, target audience, and potential for growth.</p>
                    <textarea
                      name="marketOpportunity"
                      className="input"
                      placeholder="Explain the market opportunity..."
                      value={form.marketOpportunity || ''}
                      onChange={e => setForm({ ...form, marketOpportunity: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>
                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <label className="block text-sm font-medium text-blue-400 mb-2">Upload Supporting Document (PDF or DOCX)</label>
                    <p className="text-xs text-gray-400 mb-4">If you have a document explaining your idea in detail, you can upload it here. (Optional)</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 transition-colors"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !user) return;
                        try {
                          console.log('Uploading file:', file);
                          const url = await uploadIdeaDocument(file, user.id);
                          console.log('Upload successful, url:', url);
                          setForm((f: Record<string, string>) => ({ ...f, supportingDoc: file.name, supportingDocUrl: url }));
                        } catch (err: any) {
                          console.error('Failed to upload document:', err?.message || err);
                          alert('Failed to upload document: ' + (err?.message || err));
                        }
                      }}
                    />
                    {form.supportingDoc && (
                      <div className="mt-3 text-xs text-green-400 flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Uploaded: {form.supportingDoc}
                      </div>
                    )}
                  </div>
                </div>
              ) : currentStep.type === 'textarea' ? (
                <textarea
                  name={currentStep.name}
                  className="input"
                  placeholder={currentStep.placeholder}
                  value={form[currentStep.name]}
                  onChange={handleFieldChange}
                  required
                  rows={6}
                />
              ) : currentStep.type === 'select' ? (
                <select
                  name={currentStep.name}
                  className="input"
                  value={form[currentStep.name]}
                  onChange={handleFieldChange}
                  required
                >
                  <option value="" disabled>{currentStep.placeholder}</option>
                  {currentStep.options && currentStep.options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : currentStep.type === 'select-or-custom' ? (
                <div className="space-y-4">
                  <select
                    name={currentStep.name}
                    className="input"
                    value={form[currentStep.name] && Array.isArray(currentStep.options) && currentStep.options.includes(form[currentStep.name]) ? form[currentStep.name] : ''}
                    onChange={e => {
                      setForm({ ...form, [currentStep.name]: e.target.value });
                    }}
                  >
                    <option value="" disabled>{currentStep.placeholder}</option>
                    {Array.isArray(currentStep.options) && currentStep.options.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="input"
                    placeholder="Or enter a new category"
                    value={form[currentStep.name] && (!Array.isArray(currentStep.options) || !currentStep.options.includes(form[currentStep.name])) ? form[currentStep.name] : ''}
                    onChange={e => setForm({ ...form, [currentStep.name]: e.target.value })}
                  />
                </div>
              ) : (
                <input
                  name={currentStep.name}
                  type={currentStep.type}
                  className="input"
                  placeholder={currentStep.placeholder}
                  value={form[currentStep.name]}
                  onChange={handleFieldChange}
                  required
                  min={currentStep.type === 'number' ? 1 : undefined}
                />
              )}
            </motion.div>
            
            {/* Navigation Buttons */}
            <motion.div 
              className="flex items-center mt-12 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {activeStep > 0 && (
                <motion.button
                  type="button"
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center"
                  onClick={() => handleStepChange(-1)}
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </motion.button>
              )}
              <motion.button
                type="button"
                className={`flex-1 py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                  isFieldValid() 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (activeStep < steps.length - 1) handleStepChange(1);
                  else setStep('verify');
                }}
                disabled={!isFieldValid()}
                whileHover={{ scale: isFieldValid() ? 1.02 : 1 }}
                whileTap={{ scale: isFieldValid() ? 0.98 : 1 }}
              >
                {activeStep === steps.length - 1 ? (
                  <>
                    <Check className="mr-2 h-5 w-5 inline" />
                    Verify
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-5 w-5 inline" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default IdeaForm;