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
  const [serverError, setServerError] = useState('');
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
        
        // Reset confirmation view back to idle after 10 seconds (synced with countdown bar)
        setTimeout(() => {
          setStatus('idle');
        }, 10000);
      } else {
        setStatus('error');
        setServerError(result.error || 'Something went wrong. Please try again.');
        if (nameRef.current) {
          nameRef.current.focus();
        }
      }
    } catch (err: any) {
      console.error('Submission request failed:', err);
      setStatus('error');
      setServerError(err?.message || 'Submission request failed. Please try again.');
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <div 
          className="relative overflow-hidden rounded-2xl border border-[rgba(var(--accent-rgb),0.2)] bg-[rgba(var(--accent-rgb),0.03)]"
          style={{
            animation: 'successFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          role="status" 
          aria-live="polite"
        >
          {/* Top accent glow line */}
          <div 
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              animation: 'glowSlide 2s ease-in-out infinite',
            }}
          />

          <div className="p-8 sm:p-10">
            {/* Animated checkmark circle */}
            <div 
              className="flex items-center justify-center mb-6"
              style={{ animation: 'checkPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both' }}
            >
              <div className="relative w-16 h-16">
                {/* Outer ring pulse */}
                <div 
                  className="absolute inset-0 rounded-full border border-[rgba(var(--accent-rgb),0.3)]"
                  style={{ animation: 'ringPulse 2s ease-in-out infinite' }}
                />
                {/* Inner circle */}
                <div className="absolute inset-1 rounded-full bg-[rgba(var(--accent-rgb),0.08)] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[var(--accent)]">
                    <path 
                      d="M5 13l4 4L19 7" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 24,
                        strokeDashoffset: 24,
                        animation: 'checkDraw 0.4s ease-out 0.5s forwards',
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status label */}
            <div 
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] mb-3 text-center"
              style={{ animation: 'staggerUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both' }}
            >
              ✦ Message Delivered Successfully
            </div>

            {/* Main heading */}
            <h4 
              className="text-xl sm:text-2xl font-light text-[var(--text)] text-center mb-3 tracking-tight"
              style={{ animation: 'staggerUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both' }}
            >
              Thank you for reaching out!
            </h4>

            {/* Message body */}
            <p 
              className="text-sm text-[var(--text-muted)] leading-relaxed text-center max-w-md mx-auto mb-6"
              style={{ animation: 'staggerUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both' }}
            >
              I&apos;ve received your message and will get back to you within 24 hours. Looking forward to exploring how we can work together.
            </p>

            {/* Reference ID chip */}
            <div 
              className="flex justify-center mb-6"
              style={{ animation: 'staggerUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] text-[var(--text-dim)] tracking-wider">
                  REF: {messageId}
                </span>
              </div>
            </div>

            {/* Send another button */}
            <div 
              className="flex justify-center"
              style={{ animation: 'staggerUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.75s both' }}
            >
              <button
                onClick={() => setStatus('idle')}
                className="group font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors duration-300 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100 transition-opacity rotate-0 group-hover:-rotate-45 duration-300">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
                Send another message
              </button>
            </div>
          </div>

          {/* Auto-dismiss countdown bar */}
          <div className="h-[2px] bg-[rgba(255,255,255,0.03)]">
            <div 
              className="h-full bg-[var(--accent)] opacity-40"
              style={{
                animation: 'countdownShrink 10s linear forwards',
              }}
            />
          </div>

          {/* Keyframe animations */}
          <style>{`
            @keyframes successFadeIn {
              from { opacity: 0; transform: translateY(16px) scale(0.98); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes checkPop {
              from { opacity: 0; transform: scale(0.5); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes checkDraw {
              to { stroke-dashoffset: 0; }
            }
            @keyframes staggerUp {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes ringPulse {
              0%, 100% { transform: scale(1); opacity: 0.3; }
              50% { transform: scale(1.08); opacity: 0.6; }
            }
            @keyframes glowSlide {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
            @keyframes countdownShrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
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
              <span id="name-error" className="block px-1.5 pt-1.5 pb-0.5 text-[9px] font-mono text-red-500 uppercase tracking-wider" role="alert">
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
              <span id="email-error" className="block px-1.5 pt-1.5 pb-0.5 text-[9px] font-mono text-red-500 uppercase tracking-wider" role="alert">
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
              <span id="details-error" className="block px-1.5 pt-1.5 pb-0.5 text-[9px] font-mono text-red-500 uppercase tracking-wider" role="alert">
                {errors.details}
              </span>
            )}
          </div>

          {status === 'error' && (
            <div className="form-message" style={{ display: 'block', color: '#EF4444' }} role="alert" aria-live="assertive">
              <div className="font-mono text-xs text-red-500 mb-2">$ TRANSACTION ERROR</div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-2">
                {serverError || 'Something went wrong. Please try again or email me directly at:'}
              </p>
              <p className="text-xs text-[var(--text-dim)]">
                Email directly: {' '}
                <a href="mailto:dobariyadhruvv@gmail.com" className="text-red-400 underline hover:text-red-300 transition-colors">
                  dobariyadhruvv@gmail.com
                </a>
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

