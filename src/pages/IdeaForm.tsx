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

// Accept an optional prop for editing an existing idea
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
      // Combine the 3 description fields for legacy/compatibility
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
        // Update existing idea
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
          // Do not update approval status here
        }).eq('id', ideaToEdit.id);
      } else {
        // Insert new idea
        result = await supabase.from('ideas').insert([
          {
            title: form.title,
            description: form.description, // legacy/compatibility
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
            currentFunding: 0, // deprecated, use funds_collected
            createdAt: new Date().toISOString(),
            approved: false, // New ideas are unapproved by default
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

  // If editing, always start on the verify step
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
    // Get public URL
    const { publicUrl } = supabase.storage.from('idea-docs').getPublicUrl(filePath).data;
    return publicUrl;
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
                {form.keyFeatures.split('\n').filter(Boolean).map((feature: string, idx: number) => (
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
                  {form.tags.split(',').map((tag: string, idx: number) => (
                    <span key={idx} className="inline-block bg-purple-100 text-purple-700 rounded px-2 py-1 mr-2 mb-1 text-xs font-medium">{tag.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
            {form.supportingDoc && form.supportingDocUrl && (
              <div>
                <div className="text-base font-semibold text-purple-700 mb-1">Supporting Document</div>
                <a href={form.supportingDocUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">{form.supportingDoc}</a>
              </div>
            )}
          </div>
          {submitError && <div className="text-red-600 mt-4 text-center">{submitError}</div>}
          <div className="flex gap-4 mt-10">
            <button className="flex-1 py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition duration-200 disabled:opacity-60" onClick={handleConfirm}>Confirm & Create</button>
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
              <div className="mt-2 bg-secondary-100 rounded p-4">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Upload Supporting Document (PDF or DOCX)</label>
                <p className="text-xs text-secondary-700 mb-2">If you have a document explaining your idea in detail, you can upload it here. (Optional)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-200"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !user) return;
                    try {
                      console.log('Uploading file:', file);
                      // Upload to Supabase Storage
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
                  <div className="mt-1 text-xs text-green-700">Uploaded: {form.supportingDoc}</div>
                )}
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
          ) : currentStep.type === 'select-or-custom' ? (
            <div>
              <select
                name={currentStep.name}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 bg-purple-50 focus:bg-white transition duration-200 mb-2"
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
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 bg-purple-50 focus:bg-white transition duration-200 mb-2 mt-2"
                placeholder="Or enter a new category"
                value={form[currentStep.name] && (!Array.isArray(currentStep.options) || !currentStep.options.includes(form[currentStep.name])) ? form[currentStep.name] : ''}
                onChange={e => setForm({ ...form, [currentStep.name]: e.target.value })}
              />
            </div>
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
              else setStep('verify');
            }}
            disabled={!isFieldValid()}
          >
            {activeStep === steps.length - 1 ? 'Verify' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaForm;
