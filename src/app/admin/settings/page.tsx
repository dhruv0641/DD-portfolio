import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import SettingsCMS from './SettingsCMS';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  // Query all visual and config parameters directly from Drizzle Client
  const allSettings = await db.select().from(schema.settings);

  return <SettingsCMS initialSettings={allSettings} />;
}
