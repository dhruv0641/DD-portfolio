'use client';

import React, { useState, useRef } from 'react';
import { submitContactForm } from '@/app/actions/contact';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    objective: '',
    details: '',
    website: '', // Honeypot field
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [messageId, setMessageId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
    e.currentTarget.style.transition = 'none';
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = `translate3d(0px, 0px, 0)`;
    e.currentTarget.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  };

  // References for focus management
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);

  const validate = (data: typeof formData) => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Name is required.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // Email validation
    const trimmedEmail = data.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Details validation
    const trimmedDetails = data.details.trim();
    if (!trimmedDetails) {
      newErrors.details = 'Details are required.';
    } else if (trimmedDetails.length < 10) {
      newErrors.details = 'Message must be at least 10 characters.';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldName = id.replace('form', '').toLowerCase();
    
    const updatedData = { ...formData, [fieldName]: value };
    setFormData(updatedData);

    // Dynamic error clearing if validation was previously run
    if (hasAttemptedSubmit) {
      const currentErrors = validate(updatedData);
      setErrors(currentErrors);
    }
  };

  const handleBlur = () => {
    if (hasAttemptedSubmit) {
      setErrors(validate(formData));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    // 1. Spam honeypot protection (cancel silently or log warning)
    if (formData.website.trim() !== '') {
      console.warn('Spam honeypot triggered on submit.');
      // Terminate immediately to avoid processing
      return;
    }

    // 2. Perform client-side validation
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Focus first invalid field
      if (validationErrors.name && nameRef.current) {
        nameRef.current.focus();
      } else if (validationErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (validationErrors.details && detailsRef.current) {
        detailsRef.current.focus();
      }
      return;
    }

    setStatus('submitting');
    setErrors({});
    
    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
        setStatus('success');
        setMessageId(`MSG-${Math.floor(Math.random() * 900000) + 100000}`);
        
        // Clear all form data only after success
        setFormData({ name: '', email: '', objective: '', details: '', website: '' });
        setHasAttemptedSubmit(false);
        
        // Reset confirmation view back to idle after 8 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 8000);
      } else {
        setStatus('error');
        // If server action reported validation errors, we can focus nameRef or submitBtn
        if (nameRef.current) {
          nameRef.current.focus();
        }
      }
    } catch (err) {
      console.error('Submission request failed:', err);
      setStatus('error');
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <div className="form-message" style={{ display: 'block' }} role="status" aria-live="polite">
          <div className="font-mono text-xs text-[var(--accent)] mb-2">$ TRANSACTION RECEIVED</div>
          <div className="font-mono text-sm text-[var(--text)] mb-4">ID: {messageId}</div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Your objective parameters have been cataloged. Response protocol will initiate within 24 hours.
          </p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          {/* Honeypot field - visually hidden, non-focusable */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              id="formWebsite"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input 
              ref={nameRef}
              type="text" 
              className={`form-input ${errors.name ? 'is-invalid' : ''}`} 
              id="formName" 
              required 
              placeholder=" " 
              value={formData.name} 
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={status === 'submitting'}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            <label className="form-label" htmlFor="formName">Name</label>
            {errors.name && (
              <span id="name-error" className="absolute bottom-[-1.6rem] left-0 text-[9px] font-mono text-red-500 uppercase tracking-wider" role="alert">
                {errors.name}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <input 
              ref={emailRef}
              type="email" 
              className={`form-input ${errors.email ? 'is-invalid' : ''}`} 
              id="formEmail" 
              required 
              placeholder=" " 
              value={formData.email} 
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={status === 'submitting'}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            <label className="form-label" htmlFor="formEmail">Email</label>
            {errors.email && (
              <span id="email-error" className="absolute bottom-[-1.6rem] left-0 text-[9px] font-mono text-red-500 uppercase tracking-wider" role="alert">
                {errors.email}
              </span>
            )}
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
              ref={detailsRef}
              className={`form-input ${errors.details ? 'is-invalid' : ''}`} 
              id="formDetails" 
              rows={4} 
              placeholder=" " 
              style={{ resize: 'none' }}
              value={formData.details} 
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={status === 'submitting'}
              aria-invalid={!!errors.details}
              aria-describedby={errors.details ? "details-error" : undefined}
            />
            <label className="form-label" htmlFor="formDetails">Details</label>
            {errors.details && (
              <span id="details-error" className="absolute bottom-[-1.6rem] left-0 text-[9px] font-mono text-red-500 uppercase tracking-wider" role="alert">
                {errors.details}
              </span>
            )}
          </div>

          {status === 'error' && (
            <div className="form-message" style={{ display: 'block', color: '#EF4444' }} role="alert" aria-live="assertive">
              <div className="font-mono text-xs text-red-500 mb-2">$ TRANSACTION ERROR</div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Something went wrong. Please try again or email me directly at{' '}
                <a href="mailto:dobariyadhruvv@gmail.com" className="text-red-400 underline hover:text-red-300 transition-colors">
                  dobariyadhruvv@gmail.com
                </a>.
              </p>
            </div>
          )}

          <button 
            type="submit" 
            className="form-submit-btn" 
            id="submitBtn"
            disabled={status === 'submitting'}
            style={{ pointerEvents: status === 'submitting' ? 'none' : 'auto' }}
            onMouseMove={handleButtonMouseMove}
            onMouseLeave={handleButtonMouseLeave}
          >
            {status === 'submitting' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span className="text-[11px] font-mono tracking-wider uppercase">Sending...</span>
              </div>
            ) : (
              <span>Send</span>
            )}</button>
        </form>
      )}
    </div>
  );
}

