import React from 'react';
import BlogCMS from './BlogCMS';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';
import { blogService } from '@/services/blogService';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Query all journal essays directly from Supabase service
  const allPosts = await blogService.getBlogPosts(true);

  return <BlogCMS initialPosts={allPosts} />;
}
