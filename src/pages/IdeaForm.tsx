import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../store/authStore/supabaseClient';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Check, Lightbulb, FileText, Target } from 'lucide-react';
import type { IdeaValidation, IdeaData, Idea } from '../types';
import { validateIdeaWithAI, saveValidationResults } from '../services/ideaValidation';
import AIValidationStep from '../components/ideas/AIValidationStep';
import ValidationResults from '../components/ideas/ValidationResults';
import AnimatedBackground from '../components/layout/AnimatedBackground';

// Glass card component
const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = true }) => (
  <motion.div
    className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
    }}
    whileHover={hover ? { 
      scale: 1.02,
      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
    } : undefined}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Type utilities for form fields
interface FormField {
  name: keyof FormState;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'select-or-custom' | 'number';
  placeholder: string;
  description: string;
  options?: string[];
}

interface FormSection {
  id: 'basics' | 'description' | 'details';
  title: string;
  icon: React.FC<{ className?: string }>;
  fields: FormField[];
}

// Base form state type
interface FormState {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  stage: string;
  fundingGoal: string;
  tags: string;
  aboutThisIdea: string;
  keyFeatures: string;
  marketOpportunity: string;
  supportingDoc?: string;
  supportingDocUrl?: string;
}

// Initial form state
const initialForm: FormState = {
  title: '',
  description: '',
  imageUrl: '',
  category: '',
  stage: '',
  fundingGoal: '',
  tags: '',
  aboutThisIdea: '',
  keyFeatures: '',
  marketOpportunity: ''
};

// Type for form step states
type FormStep = 'form' | 'validate' | 'validation-results' | 'verify' | 'submitting' | 'done';

interface IdeaFormProps {
  ideaToEdit?: Idea;
}

export const IdeaForm: React.FC<IdeaFormProps> = ({ ideaToEdit }) => {
  const [step, setStep] = useState<FormStep>('form');
  const [form, setForm] = useState<FormState>(ideaToEdit ? {
    ...initialForm,
    ...ideaToEdit,
    aboutThisIdea: ideaToEdit?.about_this_idea || '',
    keyFeatures: Array.isArray(ideaToEdit?.key_features) ? ideaToEdit.key_features.join('\n') : (ideaToEdit?.key_features || ''),
    marketOpportunity: ideaToEdit?.market_opportunity || '',
    tags: Array.isArray(ideaToEdit?.tags) ? ideaToEdit.tags.join(', ') : (ideaToEdit?.tags || ''),
    fundingGoal: ideaToEdit?.fundingGoal?.toString() || ''
  } : initialForm);

  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<IdeaValidation | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Group form sections
  const sections: FormSection[] = [
    {
      id: 'basics',
      title: 'Basic Information',
      icon: Lightbulb,
      fields: [
        {
          label: 'Title',
          name: 'title',
          type: 'text',
          placeholder: 'e.g. Smart Plant Monitor',
          description: 'Enter a concise, memorable title for your idea.'
        }
      ]
    },
    {
      id: 'description',
      title: 'Description',
      icon: FileText,
      fields: [
        {
          label: 'About This Idea',
          name: 'aboutThisIdea',
          type: 'textarea',
          placeholder: 'Describe your idea...',
          description: 'Provide a clear, concise description of your idea.'
        },
        {
          label: 'Key Features',
          name: 'keyFeatures',
          type: 'textarea',
          placeholder: 'List the main features...',
          description: 'List the main features and functionalities of your idea.'
        },
        {
          label: 'Market Opportunity',
          name: 'marketOpportunity',
          type: 'textarea',
          placeholder: 'Describe the market opportunity...',
          description: 'Explain the market opportunity and potential impact.'
        }
      ]
    },
    {
      id: 'details',
      title: 'Details & Categorization',
      icon: Target,
      fields: [
        {
          label: 'Image URL',
          name: 'imageUrl',
          type: 'text',
          placeholder: 'e.g. https://example.com/my-image.jpg',
          description: 'Paste a URL to an image that represents your idea.'
        },
        {
          label: 'Category',
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
            'Other'
          ],
          placeholder: 'Choose a category',
          description: 'Select the category that best fits your idea.'
        },
        {
          label: 'Stage',
          name: 'stage',
          type: 'select',
          options: ['concept', 'prototype', 'mvp', 'growth', 'production'],
          placeholder: 'Select stage',
          description: 'Choose the current development stage of your idea.'
        },
        {
          label: 'Funding Goal (USD)',
          name: 'fundingGoal',
          type: 'number',
          placeholder: 'e.g. 50000',
          description: 'Specify the total amount you need to reach your next milestone.'
        },
        {
          label: 'Tags',
          name: 'tags',
          type: 'text',
          placeholder: 'e.g. sustainability, IoT, community',
          description: 'Add comma-separated tags to help people discover your idea.'
        }
      ]
    }
  ];

  // Check completion status of a section
  const isSectionComplete = (sectionId: FormSection['id']) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return false;

    return section.fields.every(field => {
      const value = form[field.name];
      if (field.type === 'number') return value && Number(value) > 0;
      return value && value.trim().length > 0;
    });
  };

  // Calculate overall completion percentage
  const completionPercentage = () => {
    const completedSections = sections.filter(section => isSectionComplete(section.id)).length;
    return Math.round((completedSections / sections.length) * 100);
  };

  const ideaData: IdeaData = {
    title: form.title,
    description: form.description,
    aboutThisIdea: form.aboutThisIdea,
    keyFeatures: form.keyFeatures,
    marketOpportunity: form.marketOpportunity,
    category: form.category,
    fundingGoal: Number(form.fundingGoal),
    stage: form.stage as 'concept' | 'prototype' | 'mvp' | 'growth' | 'production',
    tags: form.tags.split(',').map(t => t.trim())
  };

  const handleValidateWithAI = async () => {
    setIsValidating(true);
    try {
      
      const validation = await validateIdeaWithAI({ ...ideaData, id: ideaToEdit?.id ?? 'temp-id' });
      console.log('AI Validation Results:', validation);
      setValidationResults(validation);
      setStep('validation-results');
    } catch (error) {
      console.error('Validation error:', error);
      setSubmitError('Failed to validate idea. Please try again or skip validation.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSkipValidation = () => {
    setStep('verify');
  };

  const handleValidationComplete = () => {
    setStep('verify');
  };

  const handleValidationEdit = () => {
    setStep('form');
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (Object.keys(initialForm).includes(name)) {
      setForm((prev: FormState) => ({ ...prev, [name]: value }));
    }
  };

  // Type guard to check if a string is a valid form field
  const isFormField = (field: string): field is keyof FormState => {
    return Object.keys(initialForm).includes(field);
  };

  // Validate field
  const validateField = (name: string) => {
    if (!isFormField(name)) return '';
    const value = form[name];
    
    switch (name) {
      case 'fundingGoal':
        return value && Number(value) > 0 ? '' : 'Please enter a valid funding goal';
      case 'title':
        return value && value.trim().length > 0 ? '' : 'Title is required';
      case 'aboutThisIdea':
      case 'keyFeatures':
      case 'marketOpportunity':
        return value && value.trim().length > 0 ? '' : 'This field is required';
      default:
        return '';
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sections.every(section => isSectionComplete(section.id))) {
      setForm((f) => ({
        ...f,
        description: `About This Idea:\n${f.aboutThisIdea || ''}\n\nKey Features:\n${f.keyFeatures || ''}\n\nMarket Opportunity:\n${f.marketOpportunity || ''}`.trim()
      }));
      setStep('validate');
    }
  };

  const handleConfirm = async () => {
    setStep('submitting');
    setSubmitError(null);
    if (!user) {
      setStep('form');
      return;
    }
    try {
      const ideaData = {
        title: form.title,
        description: form.description,
        about_this_idea: form.aboutThisIdea,
        key_features: form.keyFeatures.split('\n').map(s => s.trim()).filter(Boolean),
        market_opportunity: form.marketOpportunity,
        imageUrl: form.imageUrl,
        category: form.category,
        stage: form.stage,
        fundingGoal: Number(form.fundingGoal),
        tags: form.tags.split(',').map(t => t.trim()),
        ...(form.supportingDocUrl ? { supporting_doc_url: form.supportingDocUrl, supporting_doc_name: form.supportingDoc } : {}),
      };

      console.log('Submitting idea data:', ideaData);

      let result;
      if (ideaToEdit) {
        // Update the existing idea
        result = await supabase.from('ideas')
          .update(ideaData)
          .eq('id', ideaToEdit.id)
          .select()
          .single();
      } else {
        // Insert a new idea
        result = await supabase.from('ideas')
          .insert([{
            ...ideaData,
            creatorId: user.id,
            creatorName: user.name,
            currentFunding: 0,
            createdAt: new Date().toISOString(),
            approved: false,
          }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // If we have validation results, save them
      if (validationResults && result.data?.id) {
        await saveValidationResults(result.data.id, validationResults);
      }

      setStep('done');
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError('Failed to submit idea. Please try again.');
      setStep('verify');
    }
  };  
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    if (ideaToEdit) {
      setStep('verify');
    }
  }, [ideaToEdit]);

  if (step === 'validate') {
    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-4xl mx-auto px-4">
            <GlassCard className="p-12" hover={false}>
              <motion.button
                className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                onClick={() => setStep('form')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="mr-2 h-4 w-4 inline" />
                Back to Form
              </motion.button>

              <AIValidationStep
                ideaData={{
                  title: form.title,
                  description: form.description,
                  aboutThisIdea: form.aboutThisIdea,
                  keyFeatures: form.keyFeatures,
                  marketOpportunity: form.marketOpportunity,
                  category: form.category,
                  fundingGoal: Number(form.fundingGoal),
                  stage: form.stage as 'concept' | 'prototype' | 'mvp' | 'growth' | 'production',
                  tags: form.tags.split(',').map(t => t.trim())
                }}
                onValidate={handleValidateWithAI}
                onSkip={handleSkipValidation}
                isValidating={isValidating}
              />
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'validation-results' && validationResults) {
    return (
      <div className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
            <GlassCard className="w-full max-w-7xl mx-auto px-4 p-12" hover={false}>
              <ValidationResults
                validation={validationResults}
                ideaData={ideaData}
                onContinue={handleValidationComplete}
                onEdit={handleValidationEdit}
              />
            </GlassCard>
          </div>
      </div>
    );
  }

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
      // <div className="relative min-h-screen text-white overflow-hidden">
        <div className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="flex justify-center items-center w-full">
              <GlassCard className="p-14 text-center max-w-lg w-full flex flex-col justify-center items-center">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 mb-8"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Check className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {ideaToEdit ? 'Idea Updated!' : 'Idea Created!'}
                </h2>
                <p className="text-gray-300 mb-8">
                  {ideaToEdit
                  ? 'Your idea has been successfully updated and is pending approval.'
                  : 'Your idea has been successfully created and is pending approval.'}
                </p>
              </GlassCard>
            </div>
            <div className="rounded-xl p-5 mb-8 text-left ">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Why Validate with AI?</h3>
              <ul className="list-disc list-inside text-blue-100 space-y-1">
              <li>
                <span className="font-medium text-blue-200">Expert Feedback:</span> Get instant, unbiased feedback on your idea’s clarity, uniqueness, and market potential.
              </li>
              <li>
                <span className="font-medium text-blue-200">Improve Success Rate:</span> AI validation helps you refine your pitch and address common investor concerns before submitting.
              </li>
              <li>
                <span className="font-medium text-blue-200">Stand Out:</span> Ideas validated by AI may be highlighted to investors as higher quality and more thoroughly prepared.
              </li>
              <li>
                <span className="font-medium text-blue-200">Actionable Suggestions:</span> Receive concrete tips to strengthen your idea and increase your chances of approval.
              </li>
              </ul>
              <p className="mt-4 text-blue-200">
              <span className="font-semibold">Note:</span> AI validation is optional, but highly recommended for maximizing your idea’s impact!
              </p>
            </div>
            <div className="flex justify-center items-center w-full">
            <motion.button
              className="btn btn-primary"
              onClick={handleBackToDashboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard
            </motion.button>
            <span className="mx-4">|</span>
            <motion.button
              className="btn btn-primary"
              onClick={() => setStep('validate')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Validate with AI
            </motion.button>
            </div>
        </div>
      </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen py-12 pt-32">
        <div className="w-full max-w-7xl mx-auto px-0">
          <GlassCard className="p-12" hover={false}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Submit Your Idea
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Share your idea with potential investors. Fill out all sections below to create a comprehensive pitch.
              </p>
            </div>

            {/* Form Sections */}
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-12">
                  {sections
                    .filter(section => section.id === 'basics' || section.id === 'details')
                    .map(section => (
                      <div key={section.id} className="space-y-8">
                        <h3 className="text-2xl font-semibold flex items-center gap-3">
                          <section.icon className="h-6 w-6" />
                          {section.title}
                        </h3>
                        <div className="space-y-6">
                          {section.fields.map(field => (
                            <div key={field.name}>
                              <label className="block text-sm font-medium mb-2">
                                {field.label}
                                <span className="ml-2 text-xs text-gray-400">{field.description}</span>
                              </label>
                              {field.type === 'textarea' ? (
                                <textarea
                                  name={field.name}
                                  value={form[field.name]}
                                  onChange={handleFieldChange}
                                  placeholder={field.placeholder}
                                  rows={4}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                              ) : field.type === 'select' ? (                          <select
                                  name={field.name}
                                  value={form[field.name]}
                                  onChange={handleFieldChange}
                                  className="w-full px-4 py-3 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                  style={{
                                    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                  }}
                                >
                                  <option value="" style={{ backgroundColor: '#111827', color: '#ffffff' }}>{field.placeholder}</option>
                                  {field.options?.map(option => (
                                    <option key={option} value={option} style={{ backgroundColor: '#111827', color: '#ffffff' }}>{option}</option>
                                  ))}
                                </select>
                              ) : field.type === 'select-or-custom' ? (
                                <input
                                  type="text"
                                  name={field.name}
                                  value={form[field.name]}
                                  onChange={handleFieldChange}
                                  placeholder={field.placeholder}
                                  list={`${field.name}-options`}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                              ) : (
                                <input
                                  type={field.type}
                                  name={field.name}
                                  value={form[field.name]}
                                  onChange={handleFieldChange}
                                  placeholder={field.placeholder}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                              )}
                              {validateField(field.name) && (
                                <p className="mt-1 text-sm text-red-400">{validateField(field.name)}</p>
                              )}
                              {field.type === 'select-or-custom' && (
                                <datalist id={`${field.name}-options`}>
                                  {field.options?.map(option => (
                                    <option key={option} value={option} />
                                  ))}
                                </datalist>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Right Column */}
                <div className="space-y-12">
                  {sections
                    .filter(section => section.id === 'description')
                    .map(section => (
                      <div key={section.id} className="space-y-8">
                        <h3 className="text-2xl font-semibold flex items-center gap-3">
                          <section.icon className="h-6 w-6" />
                          {section.title}
                        </h3>
                        <div className="space-y-6">
                          {section.fields.map(field => (
                            <div key={field.name}>
                              <label className="block text-sm font-medium mb-2">
                                {field.label}
                                <span className="ml-2 text-xs text-gray-400">{field.description}</span>
                              </label>
                              {field.type === 'textarea' ? (
                                <textarea
                                  name={field.name}
                                  value={form[field.name]}
                                  onChange={handleFieldChange}
                                  placeholder={field.placeholder}
                                  rows={4}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                              ) : field.type === 'select' ? (                          <select
                                  name={field.name}
                                  value={form[field.name]}
                                  onChange={handleFieldChange}
                                  className="w-full px-4 py-3 text-white border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                                  style={{
                                    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                  }}
                                >
                                  <option value="" style={{ backgroundColor: '#111827', color: '#ffffff' }}>{field.placeholder}</option>
                                  {field.options?.map(option => (
                                    <option key={option} value={option} style={{ backgroundColor: '#111827', color: '#ffffff' }}>{option}</option>
                                  ))}
                                </select>
                              ) : field.type === 'select-or-custom' ? (
                                <input
                                  type="text"
                                  name={field.name}
                                  value={form[field.name]}
                                  onChange={handleFieldChange}
                                  placeholder={field.placeholder}
                                  list={`${field.name}-options`}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                              ) : (
                                <input
                                  type={field.type}
                                  name={field.name}
                                  value={form[field.name]}
                                  onChange={handleFieldChange}
                                  placeholder={field.placeholder}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                              )}
                              {validateField(field.name) && (
                                <p className="mt-1 text-sm text-red-400">{validateField(field.name)}</p>
                              )}
                              {field.type === 'select-or-custom' && (
                                <datalist id={`${field.name}-options`}>
                                  {field.options?.map(option => (
                                    <option key={option} value={option} />
                                  ))}
                                </datalist>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Submit and Exit Buttons */}
              <div className="flex justify-center pt-8">
                <motion.button
                  className={`px-8 py-4 font-bold rounded-xl transition-all duration-300 ${
                  completionPercentage() === 100
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                  onClick={handleConfirm}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check className="mr-2 h-5 w-5 inline" />
                  Confirm & Create
                </motion.button>

                <span className="mx-4" />

                <motion.button
                  type="button"
                  className="px-8 py-4 font-bold rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
                  onClick={handleBackToDashboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Exit to Dashboard
                </motion.button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};