'use client';

import React, { useState } from 'react';
import { submitContactForm } from '@/app/actions/contact';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    objective: '',
    details: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [messageId, setMessageId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id.replace('form', '').toLowerCase()]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const result = await submitContactForm(formData);
    
    if (result.success) {
      setStatus('success');
      setMessageId(`MSG-${Math.floor(Math.random() * 900000) + 100000}`);
      setFormData({ name: '', email: '', objective: '', details: '' });
      
      // Reset confirmation after 8 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 8000);
    } else {
      setStatus('error');
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <div className="form-message" style={{ display: 'block' }}>
          <div className="font-mono text-xs text-[var(--accent)] mb-2">$ TRANSACTION RECEIVED</div>
          <div className="font-mono text-sm text-[var(--text)] mb-4">ID: {messageId}</div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Your objective parameters have been cataloged. Response protocol will initiate within 24 hours.
          </p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              className="form-input" 
              id="formName" 
              required 
              placeholder=" " 
              value={formData.name} 
              onChange={handleChange}
              disabled={status === 'submitting'}
            />
            <label className="form-label" htmlFor="formName">Name</label>
          </div>
          
          <div className="form-group">
            <input 
              type="email" 
              className="form-input" 
              id="formEmail" 
              required 
              placeholder=" " 
              value={formData.email} 
              onChange={handleChange}
              disabled={status === 'submitting'}
            />
            <label className="form-label" htmlFor="formEmail">Email</label>
          </div>

          <div className="form-group">
            <input 
              type="text" 
              className="form-input" 
              id="formObjective" 
              placeholder=" " 
              value={formData.objective} 
              onChange={handleChange}
              disabled={status === 'submitting'}
            />
            <label className="form-label" htmlFor="formObjective">Objective / Project Scope</label>
          </div>

          <div className="form-group">
            <textarea 
              className="form-input" 
              id="formDetails" 
              rows={4} 
              placeholder=" " 
              style={{ resize: 'none' }}
              value={formData.details} 
              onChange={handleChange}
              disabled={status === 'submitting'}
            />
            <label className="form-label" htmlFor="formDetails">Details</label>
          </div>

          {status === 'error' && (
            <div className="text-xs font-mono text-red-500 mb-2">
              $ TRANSACTION ERROR: Failed to write to repository.
            </div>
          )}

          <button 
            type="submit" 
            className="form-submit-btn" 
            id="submitBtn"
            disabled={status === 'submitting'}
          >
            <span>{status === 'submitting' ? 'Sending...' : 'Send'}</span>
          </button>
        </form>
      )}
    </div>
  );
}
