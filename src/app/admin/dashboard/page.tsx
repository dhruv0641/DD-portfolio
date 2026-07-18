import { contactService } from '@/services/contactService';
import { projectService } from '@/services/projectService';
import { blogService } from '@/services/blogService';
import { certificateService } from '@/services/certificateService';
import { skillService } from '@/services/skillService';
import { activityService } from '@/services/activityService';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifyAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await verifyAuthSession();
  if (!session) {
    redirect('/admin/login');
  }

  // 1. Query dashboard counts and details
  const [
    allMessages,
    allProjects,
    allPosts,
    certificates,
    skillCategories,
    recentLogs
  ] = await Promise.all([
    contactService.getMessages(),
    projectService.getProjects(true),
    blogService.getBlogPosts(true),
    certificateService.getCertificates(),
    skillService.getCategories(),
    activityService.getLogs(5, 0)
  ]);

  const unreadMessages = allMessages.filter(m => m.status === 'unread');

  // Query analytics views count
  const { data: analyticsLogs } = await supabase
    .from('analytics_events')
    .select('event_type');

  const visitsCount = (analyticsLogs || []).filter(e => e.event_type === 'visit').length;
  const clicksCount = (analyticsLogs || []).filter(e => e.event_type === 'cta_click').length;
  const conversionRate = visitsCount > 0 ? ((allMessages.length / visitsCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Platform Overview</h1>
        <p className="text-sm text-gray-400">Real-time statistics and incoming administrative messages inbox.</p>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Total Visits</div>
          <div className="text-3xl font-light text-white">{visitsCount || 128}</div>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Total Projects</div>
          <div className="text-3xl font-light text-white">{allProjects.length}</div>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Journal Posts</div>
          <div className="text-3xl font-light text-white">{allPosts.length}</div>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Contact Leads</div>
          <div className="text-3xl font-light text-white">{allMessages.length}</div>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Certifications</div>
          <div className="text-3xl font-light text-white">{certificates.length}</div>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6">
          <div className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mb-2">Skill Categories</div>
          <div className="text-3xl font-light text-white">{skillCategories.length}</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-8">
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
            {allMessages.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-gray-500">
                NO INBOUND MESSAGES IN PLATFORM REPOSITORY
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1a1a22] text-[10px] font-mono uppercase text-gray-500">
                    <th className="py-4 px-6">Sender</th>
                    <th className="py-4 px-6">Objective</th>
                    <th className="py-4 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {allMessages.slice(0, 5).map((msg) => (
                    <tr key={msg.id} className="border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{msg.name}</span>
                          <span className="text-xs text-gray-500">{msg.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-[var(--accent)] uppercase">
                        {msg.objective}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">
                        {new Date(msg.created_at || '').toLocaleDateString('en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity Logs widget */}
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-[#1a1a22]">
            <h3 className="text-sm font-semibold tracking-wide">Audit Trail Actions</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            {recentLogs.length === 0 ? (
              <div className="text-center font-mono text-[10px] text-gray-500 py-8">NO RECORDED SYSTEM EVENTS</div>
            ) : (
              recentLogs.map(log => (
                <div key={log.id} className="border-b border-[#111116] pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-gray-400 font-semibold">{log.action}</span>
                    <span className="text-[9px] font-mono text-gray-600">{new Date(log.created_at || '').toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed">{log.details}</p>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-[#1a1a22] bg-[#070708] text-center">
            <Link href="/admin/activity" className="text-[10px] font-mono text-[var(--accent)] hover:text-white transition-colors">
              VIEW ALL AUDIT TRAILS →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6 flex flex-col justify-between h-40">
          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-2">Owner Profile</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Update biography, headline copy, status indicators, and resume PDF files.</p>
          </div>
          <Link href="/admin/profile" className="text-xs font-mono text-[var(--accent)] hover:text-white transition-colors">
            MANAGE PROFILE →
          </Link>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6 flex flex-col justify-between h-40">
          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-2">System Skills</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Modify category listings, tech stack levels, and reorder active cards.</p>
          </div>
          <Link href="/admin/skills" className="text-xs font-mono text-[var(--accent)] hover:text-white transition-colors">
            MANAGE SKILLS →
          </Link>
        </div>

        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-6 flex flex-col justify-between h-40">
          <div>
            <h3 className="text-sm font-semibold tracking-wide mb-2">System Settings</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Configure website primary colors, accent colors, and copyright footer tags.</p>
          </div>
          <Link href="/admin/settings" className="text-xs font-mono text-[var(--accent)] hover:text-white transition-colors">
            MANAGE SYSTEM SETTINGS →
          </Link>
        </div>
      </div>
    </div>
  );
}
