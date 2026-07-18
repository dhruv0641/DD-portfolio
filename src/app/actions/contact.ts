'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';

export interface ContactInput {
  name: string;
  email: string;
  objective: string;
  details: string;
  website?: string; // Honeypot field
}

export async function submitContactForm(data: ContactInput) {
  try {
    const { name, email, objective, details, website } = data;

    // 1. Honeypot check for spam protection
    if (website && website.trim() !== '') {
      console.warn('Spam submission detected via honeypot field:', { name, email, website });
      return { success: false, error: 'Spam submission detected.' };
    }

    // 2. Server-side validation
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedDetails = (details || '').trim();
    const trimmedObjective = (objective || '').trim() || 'General Inquiry';

    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: 'Name must be at least 2 characters long.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!trimmedDetails || trimmedDetails.length < 10) {
      return { success: false, error: 'Message details must be at least 10 characters long.' };
    }

    // 3. Insert into SQLite local database (keeps CMS inbox working)
    await db.insert(schema.messages).values({
      name: trimmedName,
      email: trimmedEmail,
      objective: trimmedObjective,
      details: trimmedDetails,
      status: 'unread',
    });

    // 4. Increment analytics event
    await db.insert(schema.analyticsEvents).values({
      eventType: 'cta_click',
      path: '/#contact',
      referrer: 'contact_form_submit',
    });

    // 5. External Endpoint Forwarding (Formspree/Web3Forms/Custom API)
    const endpoint = process.env.CONTACT_FORM_ENDPOINT;
    if (endpoint) {
      console.log(`Forwarding message to contact endpoint: ${endpoint}`);

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
            name: trimmedName,
            email: trimmedEmail,
            objective: trimmedObjective,
            message: trimmedDetails, // Formspree prefers standard 'message' field
            details: trimmedDetails,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          console.error(`External endpoint returned status ${response.status}:`, errText);
          return {
            success: false,
            error: 'Failed to deliver message to configured mail endpoint. Please email directly.',
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
    } else {
      console.warn('CONTACT_FORM_ENDPOINT is not configured. Message stored only in database.');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Contact submit error:', error);
    return { success: false, error: error.message || 'Database transaction failed.' };
  }
}

