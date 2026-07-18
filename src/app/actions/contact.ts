'use server';

import { db } from '@/db';
import * as schema from '@/db/schema';

export interface ContactInput {
  name: string;
  email: string;
  objective: string;
  details: string;
}

export async function submitContactForm(data: ContactInput) {
  try {
    await db.insert(schema.messages).values({
      name: data.name,
      email: data.email,
      objective: data.objective || 'General Inquiry',
      details: data.details,
      status: 'unread',
    });
    
    // Increment an analytics event for CTA/conversion tracking
    await db.insert(schema.analyticsEvents).values({
      eventType: 'cta_click',
      path: '/#contact',
      referrer: 'contact_form_submit',
    });

    return { success: true };
  } catch (error) {
    console.error('Contact submit error:', error);
    return { success: false, error: 'Database transaction failed.' };
  }
}
