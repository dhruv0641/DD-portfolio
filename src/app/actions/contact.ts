'use server';

import { contactService } from '@/services/contactService';
import { supabase } from '@/lib/supabase';
import { ContactInput } from '@/types';
import { rateLimit } from '@/lib/rateLimiter';
import { validateEmail, sanitizeString } from '@/lib/validation';

export async function submitContactForm(data: ContactInput) {
  try {
    // 1. Rate Limiting Check: 3 contact submissions per hour (approx 0.05 refill rate)
    const rateCheck = await rateLimit('contact_form', 3, 0.05);
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

    // 5. Insert into Supabase messages table
    const dbResult = await contactService.submitMessage({
      name: cleanName,
      email: cleanEmail,
      objective: cleanObjective,
      details: cleanDetails,
    });

    if (!dbResult.success) {
      return { success: false, error: 'Failed to submit inquiry.' };
    }

    // 6. Log analytics event to Supabase safely
    try {
      await supabase.from('analytics_events').insert([
        {
          event_type: 'cta_click',
          path: '/#contact',
          referrer: 'contact_form_submit',
        },
      ]);
    } catch (anaErr) {
      console.error('Error logging contact analytics:', anaErr);
    }

    // 7. External Endpoint Forwarding (Formspree/Web3Forms/Custom API)
    const endpoint = process.env.CONTACT_FORM_ENDPOINT;
    if (endpoint) {
      console.log('Forwarding message to contact endpoint.');

      // Abort controller for a 10-second timeout boundary
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            objective: cleanObjective,
            message: cleanDetails,
            details: cleanDetails,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(`External endpoint returned status ${response.status}`);
          return {
            success: false,
            error: 'Failed to deliver message. Please contact via direct email.',
          };
        }
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr.name === 'AbortError') {
          console.error('Request to external contact endpoint timed out.');
          return { success: false, error: 'Network timeout: mail delivery service did not respond.' };
        }
        console.error('Failed to forward to external contact endpoint:', fetchErr);
        return { success: false, error: 'Network error: could not connect to mail delivery service.' };
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Contact submit error:', error);
    return { success: false, error: 'Inquiry submission pipeline error occurred.' };
  }
}
