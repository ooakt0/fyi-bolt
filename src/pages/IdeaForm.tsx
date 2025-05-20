import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../store/authStore/supabaseClient';
import { useAuthStore } from '../store/authStore';

const initialForm = {
  title: '',
  description: '',
  imageUrl: '',
  category: '',
  stage: '',
  fundingGoal: '',
  tags: '',
};

const IdeaForm: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState<'form' | 'verify' | 'submitting' | 'done'>('form');
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verify');
  };

  const handleConfirm = async () => {
    setStep('submitting');
    setError('');
    if (!user) {
      setError('User not authenticated.');
      setStep('form');
      return;
    }
    try {
      const result = await supabase.from('ideas').insert([
        {
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl,
          category: form.category,
          stage: form.stage,
          fundingGoal: Number(form.fundingGoal),
          tags: form.tags.split(',').map((t) => t.trim()),
          creatorId: user.id,
          creatorName: user.name,
          currentFunding: 0,
          createdAt: new Date().toISOString(),
        },
      ]);
      console.log('Supabase insert result:', result);
      if (result.error) throw result.error;
      setStep('done');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create idea');
      setStep('form');
    }
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  if (step === 'verify') {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Verify Your Idea Details</h2>
        <ul className="mb-4 space-y-2">
          <li><strong>Title:</strong> {form.title}</li>
          <li><strong>Description:</strong> {form.description}</li>
          <li><strong>Image URL:</strong> {form.imageUrl}</li>
          <li><strong>Category:</strong> {form.category}</li>
          <li><strong>Stage:</strong> {form.stage}</li>
          <li><strong>Funding Goal:</strong> ${form.fundingGoal}</li>
          <li><strong>Tags:</strong> {form.tags}</li>
        </ul>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={handleConfirm}>Confirm & Create</button>
          <button className="btn btn-outline" onClick={() => setStep('form')}>Edit</button>
          <button className="btn btn-secondary" onClick={handleExit}>Exit</button>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Idea Created!</h2>
        <p>Your idea has been successfully created.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-3xl font-extrabold mb-2 text-center text-primary-700">Share Your Big Idea</h2>
      <p className="text-center text-gray-600 mb-4">Provide details for your Idea.</p>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Title</label>
          <input name="title" className="input" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea name="description" className="input" value={form.description} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Image URL</label>
          <input name="imageUrl" className="input" value={form.imageUrl} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Category</label>
          <input name="category" className="input" value={form.category} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Stage</label>
          <select
            name="stage"
            className="input"
            value={form.stage}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select stage</option>
            <option value="concept">Concept</option>
            <option value="prototype">Prototype</option>
            <option value="mvp">MVP</option>
            <option value="growth">Growth</option>
          </select>
        </div>
        <div>
          <label className="form-label">Funding Goal (USD)</label>
          <input name="fundingGoal" type="number" min="1" className="input" value={form.fundingGoal} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Tags (comma separated)</label>
          <input name="tags" className="input" value={form.tags} onChange={handleChange} required />
        </div>
        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn btn-primary w-full">Next: Verify Details</button>
        </div>
      </form>
      <div className="mt-4 flex">
        <button type="button" className="btn btn-secondary w-full" onClick={handleExit}>Exit</button>
      </div>
    </div>
  );
};

export default IdeaForm;
