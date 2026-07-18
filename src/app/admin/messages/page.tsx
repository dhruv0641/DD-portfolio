import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import MessagesCMS from './MessagesCMS';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  // Query all contact messages from database directly
  const allMessages = await db
    .select()
    .from(schema.messages)
    .orderBy(desc(schema.messages.createdAt));

  return <MessagesCMS initialMessages={allMessages} />;
}
