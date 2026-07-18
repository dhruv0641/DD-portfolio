import React from 'react';
import { activityService } from '@/services/activityService';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminActivityPage({ searchParams }: PageProps) {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1') || 1;
  const limit = 25;
  const offset = (page - 1) * limit;

  // Fetch paginated activity log records
  const logs = await activityService.getLogs(limit, offset);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Security &amp; Audit Logs</h1>
        <p className="text-sm text-gray-400">Review complete platform history logs, logins, uploads, and data mutations.</p>
      </div>

      <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-500">
              NO SYSTEM LOGS RECORDED IN THE REPOSITORY
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a22] text-[10px] font-mono uppercase text-gray-500">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Operator</th>
                  <th className="py-4 px-6">Action</th>
                  <th className="py-4 px-6">Entity type</th>
                  <th className="py-4 px-6">Event details</th>
                </tr>
              </thead>
              <tbody className="text-sm font-sans text-gray-300">
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0">
                    <td className="py-4 px-6 font-mono text-xs text-gray-500">
                      {new Date(log.created_at || '').toLocaleString('en-US')}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-[var(--accent)]">
                      {log.user_name}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        log.action === 'FAILED_LOGIN' 
                          ? 'bg-red-950/20 text-red-400' 
                          : log.action === 'DELETE'
                          ? 'bg-red-950/10 text-red-500'
                          : log.action === 'LOGIN'
                          ? 'bg-emerald-950/20 text-emerald-400'
                          : 'bg-zinc-800 text-gray-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-gray-400">
                      {log.entity || 'SYSTEM'}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 max-w-[400px] leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <a
          href={`/admin/activity?page=${Math.max(1, page - 1)}`}
          className={`px-4 py-2 border border-[#222] bg-[#16161e] text-xs font-mono text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer select-none ${
            page === 1 ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          ← PREV PAGE
        </a>
        <span className="font-mono text-xs text-gray-500">PAGE {page}</span>
        <a
          href={`/admin/activity?page=${page + 1}`}
          className={`px-4 py-2 border border-[#222] bg-[#16161e] text-xs font-mono text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer select-none ${
            logs.length < limit ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          NEXT PAGE →
        </a>
      </div>
    </div>
  );
}
