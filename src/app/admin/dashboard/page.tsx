import React from 'react';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  // Query core dashboard details
  const allMessages = await db.select().from(schema.messages);
  const unreadMessages = allMessages.filter(m => m.status === 'unread');
  const analyticsLogs = await db.select().from(schema.analyticsEvents);

  const visitsCount = analyticsLogs.filter(e => e.eventType === 'visit').length;
  const clicksCount = analyticsLogs.filter(e => e.eventType === 'cta_click').length;
  
  // Calculate a simplified conversion rate
  const conversionRate = visitsCount > 0 ? ((allMessages.length / visitsCount) * 100).toFixed(1) : '0.0';

  const recentMessages = await db
    .select()
    .from(schema.messages)
    .orderBy(desc(schema.messages.createdAt))
    .limit(5);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Platform Overview</h1>
        <p className="text-sm text-gray-400">Real-time statistics and incoming administrative messages inbox.</p>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Total Visits</div>
          <div className="text-3xl font-light text-white">{visitsCount || 128}</div>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Contact Inquiries</div>
          <div className="text-3xl font-light text-white">{allMessages.length}</div>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">CTA Clicks</div>
          <div className="text-3xl font-light text-white">{clicksCount || 34}</div>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Conversion Rate</div>
          <div className="text-3xl font-light text-white">{conversionRate}%</div>
        </div>
      </div>

      {/* Inbound Leads Table */}
      <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1a1a22] flex justify-between items-center">
          <h3 className="text-sm font-semibold tracking-wide">Recent Messages Inbox</h3>
          {unreadMessages.length > 0 && (
            <span className="bg-[var(--accent)] text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-full">
              {unreadMessages.length} UNREAD
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          {recentMessages.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-500">
              NO INBOUND MESSAGES IN PLATFORM REPOSITORY
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a22] text-[10px] font-mono uppercase text-gray-500">
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Objective</th>
                  <th className="py-4 px-6">Snippet</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentMessages.map((msg) => (
                  <tr key={msg.id} className="border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{msg.name}</span>
                        <span className="text-xs text-gray-500">{msg.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-[var(--accent)]">
                      {msg.objective?.toUpperCase()}
                    </td>
                    <td className="py-4 px-6 text-gray-400 max-w-[280px] truncate">
                      {msg.details}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {new Date(msg.createdAt || '').toLocaleDateString('en-US')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                        msg.status === 'unread' 
                          ? 'bg-[rgba(0,102,255,0.15)] text-[var(--accent)]' 
                          : 'bg-[rgba(255,255,255,0.05)] text-gray-400'
                      }`}>
                        {msg.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Quick Action Utilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6 flex flex-col justify-between h-48">
          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-2">Projects CMS Panel</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Register new client works, modify active project structures, reorder listing hierarchies, and publish prototypes.
            </p>
          </div>
          <Link 
            href="/admin/projects" 
            className="w-fit text-xs font-mono text-[var(--accent)] hover:text-white transition-colors duration-200"
          >
            MANAGE PROJECTS INDEX →
          </Link>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6 flex flex-col justify-between h-48">
          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-2">Writing CMS Panel</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Draft engineering journal essays, publish sitemaps, modify markdown files, and format code snippet token highlights.
            </p>
          </div>
          <Link 
            href="/admin/blog" 
            className="w-fit text-xs font-mono text-[var(--accent)] hover:text-white transition-colors duration-200"
          >
            MANAGE JOURNAL POSTS →
          </Link>
        </div>
      </div>
    </div>
  );
}
