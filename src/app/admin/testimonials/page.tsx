import React from 'react';
import { testimonialService } from '@/services/testimonialService';
import TestimonialsCMS from './TestimonialsCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch initial testimonials including inactive records
  const testimonials = await testimonialService.getTestimonials(true);

  return <TestimonialsCMS initialTestimonials={testimonials} />;
}
