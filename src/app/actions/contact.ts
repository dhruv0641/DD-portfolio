'use server';

import { contactService } from '@/services/contactService';
import { supabase } from '@/lib/supabase';
import { ContactInput } from '@/types';
import { rateLimit } from '@/lib/rateLimiter';
import { validateEmail, sanitizeString } from '@/lib/validation';

export async function submitContactForm(data: ContactInput) {
  try {
    // 1. Rate Limiting Check: 15 contact submissions per hour
    const rateCheck = await rateLimit('contact_form', 15, 0.25);
    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.error || 'Too many submissions. Please try again later.' };
    }

    const { name, email, objective, details, website } = data;

    // 2. Honeypot check for spam protection
    if (website && website.trim() !== '') {
      console.warn('Spam submission detected via honeypot field:', { name, email, website });
      return { success: false, error: 'Spam submission detected.' };
    }

    // 3. Server-side validation
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedDetails = (details || '').trim();
    const trimmedObjective = (objective || '').trim() || 'General Inquiry';

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return { success: false, error: 'Name must be between 2 and 100 characters long.' };
    }

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!trimmedDetails || trimmedDetails.length < 10 || trimmedDetails.length > 5000) {
      return { success: false, error: 'Message details must be between 10 and 5000 characters long.' };
    }

    // 4. Escape inputs to prevent XSS injection
    const cleanName = sanitizeString(trimmedName);
    const cleanEmail = sanitizeString(trimmedEmail);
    const cleanObjective = sanitizeString(trimmedObjective);
    const cleanDetails = sanitizeString(trimmedDetails);

    // 5. Store message in database
    const dbResult = await contactService.submitMessage({
      name: cleanName,
      email: cleanEmail,
      objective: cleanObjective,
      details: cleanDetails,
    });

    if (!dbResult.success) {
      return { success: false, error: dbResult.error || 'Failed to save message.' };
    }

    // 6. Log analytics event in background asynchronously
    Promise.resolve(
      supabase.from('analytics_events').insert([
        {
          event_type: 'cta_click',
          path: '/#contact',
          referrer: 'contact_form_submit',
        },
      ])
    ).catch(() => null);

    return { success: true };
  } catch (error: any) {
    console.error('Contact submit error:', error);
    return { success: false, error: 'Inquiry submission pipeline error occurred.' };
  }
}
