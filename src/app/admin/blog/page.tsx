import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import BlogCMS from './BlogCMS';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  // Query all journal essays directly from SQLite Drizzle client
  const allPosts = await db
    .select()
    .from(schema.blogPosts)
    .orderBy(desc(schema.blogPosts.createdAt));

  return <BlogCMS initialPosts={allPosts} />;
}
