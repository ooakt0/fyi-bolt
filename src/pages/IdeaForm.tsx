import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore/supabaseClient';
import { useAuthStore } from '../store/authStore';

// Fix: Add index signature to form type for dynamic key access
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

const IdeaForm: React.FC = () => {
  const [form, setForm] = useState(initialForm);
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
      description: 'Select the category that best fits your idea.',
      name: 'category',
      type: 'select',
      options: ['Mobile App', 'Healthcare', 'Food & Beverage', 'Education', 'Productivity', 'Transportation'],
      placeholder: 'Choose a category',
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
    setForm(f => ({
      ...f,
      // Combine the 3 description fields for legacy/compatibility
      description: `About This Idea:\n${f.aboutThisIdea || ''}\n\nKey Features:\n${f.keyFeatures || ''}\n\nMarket Opportunity:\n${f.marketOpportunity || ''}`.trim()
    }));
    setStep('verify');
  };

  const handleConfirm = async () => {
    setStep('submitting');
    if (!user) {
      setStep('form');
      return;
    }
    try {
      const result = await supabase.from('ideas').insert([
        {
          title: form.title,
          description: form.description, // legacy/compatibility
          about_this_idea: form.aboutThisIdea,
          key_features: form.keyFeatures.split('\n').map(s => s.trim()).filter(Boolean),
          market_opportunity: form.marketOpportunity,
          imageUrl: form.imageUrl,
          category: form.category,
          stage: form.stage,
          fundingGoal: Number(form.fundingGoal),
          funds_collected: form.fundsCollected ? Number(form.fundsCollected) : 0,
          tags: form.tags.split(',').map((t) => t.trim()),
          creatorId: user.id,
          creatorName: user.name,
          currentFunding: 0, // deprecated, use funds_collected
          createdAt: new Date().toISOString(),
        },
      ]);
      console.log('Supabase insert result:', result);
      if (result.error) throw result.error;
      setStep('done');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setStep('form');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-200">
        <div className="w-full max-w-2xl bg-gray-50 rounded-2xl shadow-md p-12 relative">
          <button
            className="mb-6 px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition duration-200"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </button>
          <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-800">Verify Your Idea Details</h2>
          <div className="space-y-6">
            <div>
              <div className="text-base font-semibold text-purple-700 mb-1">Title</div>
              <div className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800">{form.title}</div>
            </div>
            <div>
              <div className="text-base font-semibold text-purple-700 mb-1">About This Idea</div>
              <div className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800 whitespace-pre-line">{form.aboutThisIdea}</div>
            </div>
            <div>
              <div className="text-base font-semibold text-purple-700 mb-1">Key Features</div>
              <ul className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800 list-disc list-inside">
                {form.keyFeatures.split('\n').filter(Boolean).map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-base font-semibold text-purple-700 mb-1">Market Opportunity</div>
              <div className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800 whitespace-pre-line">{form.marketOpportunity}</div>
            </div>
            <div>
              <div className="text-base font-semibold text-purple-700 mb-1">Image URL</div>
              <div className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800 break-all">{form.imageUrl}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-base font-semibold text-purple-700 mb-1">Category</div>
                <div className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800">{form.category}</div>
              </div>
              <div>
                <div className="text-base font-semibold text-purple-700 mb-1">Stage</div>
                <div className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800">{form.stage}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-base font-semibold text-purple-700 mb-1">Funding Goal (USD)</div>
                <div className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800">${form.fundingGoal}</div>
              </div>
              <div>
                <div className="text-base font-semibold text-purple-700 mb-1">Tags</div>
                <div className="bg-white rounded-lg border border-purple-100 px-4 py-3 text-gray-800">
                  {form.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="inline-block bg-purple-100 text-purple-700 rounded px-2 py-1 mr-2 mb-1 text-xs font-medium">{tag.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-10">
            <button className="flex-1 py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition duration-200" onClick={handleConfirm}>Confirm & Create</button>
            <button className="flex-1 py-3 rounded-lg font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 transition duration-200" onClick={() => setStep('form')}>Edit</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded shadow text-center relative">
        <button
          className="btn btn-secondary absolute top-4 left-4"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold mb-4">Idea Created!</h2>
        <p>Your idea has been successfully created.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-200">
      <div className="w-full max-w-2xl bg-gray-50 rounded-2xl shadow-md p-12 relative">
        {/* Back to Dashboard button */}
        <button
          className="mb-6 px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition duration-200"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-10 px-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className={`flex flex-col items-center z-10`}>
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition duration-200
                    ${idx < activeStep ? 'bg-purple-600 border-purple-600 text-white' :
                      idx === activeStep ? 'bg-purple-100 border-purple-400 text-purple-700' :
                      'bg-white border-purple-200 text-purple-300'}
                  `}
                >
                  {idx < activeStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className="font-bold">{idx + 1}</span>
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${idx === activeStep ? 'text-purple-700' : 'text-gray-400'}`}>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-1 md:mx-2 rounded-full transition duration-200
                  ${idx < activeStep ? 'bg-purple-600' : 'bg-purple-200'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Step Content */}
        <div className="transition duration-200 ease-in-out">
          <label className="block text-lg font-semibold text-purple-800 mb-1">{currentStep.label}</label>
          <p className="text-sm text-gray-500 mb-4">{currentStep.description}</p>
          {currentStep.type === 'custom-description' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-purple-800 mb-1">About This Idea</label>
                <p className="text-xs text-gray-500 mb-2">Describe the core concept, vision, and what problem your idea solves.</p>
                <textarea
                  name="aboutThisIdea"
                  className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 bg-purple-50 focus:bg-white transition duration-200 mb-2"
                  placeholder="Describe the core concept and vision..."
                  value={form.aboutThisIdea || ''}
                  onChange={e => setForm({ ...form, aboutThisIdea: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-purple-800 mb-1">Key Features</label>
                <p className="text-xs text-gray-500 mb-2">List the main features and differentiators that make your idea unique.</p>
                <textarea
                  name="keyFeatures"
                  className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 bg-purple-50 focus:bg-white transition duration-200 mb-2"
                  placeholder="List the main features..."
                  value={form.keyFeatures || ''}
                  onChange={e => setForm({ ...form, keyFeatures: e.target.value })}
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-purple-800 mb-1">Market Opportunity</label>
                <p className="text-xs text-gray-500 mb-2">Explain the market need, target audience, and potential for growth.</p>
                <textarea
                  name="marketOpportunity"
                  className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 bg-purple-50 focus:bg-white transition duration-200 mb-2"
                  placeholder="Explain the market opportunity..."
                  value={form.marketOpportunity || ''}
                  onChange={e => setForm({ ...form, marketOpportunity: e.target.value })}
                  required
                  rows={3}
                />
              </div>
            </div>
          ) : currentStep.type === 'textarea' ? (
            <textarea
              name={currentStep.name}
              className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 bg-purple-50 focus:bg-white transition duration-200 mb-2"
              placeholder={currentStep.placeholder}
              value={form[currentStep.name]}
              onChange={handleFieldChange}
              required
              rows={4}
            />
          ) : currentStep.type === 'select' ? (
            <select
              name={currentStep.name}
              className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 bg-purple-50 focus:bg-white transition duration-200 mb-2"
              value={form[currentStep.name]}
              onChange={handleFieldChange}
              required
            >
              <option value="" disabled>{currentStep.placeholder}</option>
              {currentStep.options && currentStep.options.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              name={currentStep.name}
              type={currentStep.type}
              className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 bg-purple-50 focus:bg-white transition duration-200 mb-2"
              placeholder={currentStep.placeholder}
              value={form[currentStep.name]}
              onChange={handleFieldChange}
              required
              min={currentStep.type === 'number' ? 1 : undefined}
            />
          )}
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-center mt-8 gap-4">
          {activeStep > 0 && (
            <button
              type="button"
              className="text-purple-600 font-medium underline hover:text-purple-800 transition duration-200"
              onClick={() => handleStepChange(-1)}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className={`flex-1 py-3 rounded-lg font-bold text-white transition duration-200
              ${isFieldValid() ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'}`}
            onClick={() => {
              if (activeStep < steps.length - 1) handleStepChange(1);
              else handleSubmit(new Event('submit') as any);
            }}
            disabled={!isFieldValid()}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaForm;
