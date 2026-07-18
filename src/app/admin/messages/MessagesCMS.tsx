'use client';

import React, { useState } from 'react';
import { updateMessageStatus, deleteMessage } from '@/app/actions/messages';
import { useRouter } from 'next/navigation';

export default function MessagesCMS({ initialMessages }: { initialMessages: any[] }) {
  const [messages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleStatusChange = async (id: number, newStatus: 'read' | 'unread' | 'archived' | 'spam') => {
    setLoading(true);
    const result = await updateMessageStatus(id, newStatus);
    if (result.success) {
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev: any) => ({ ...prev, status: newStatus }));
      }
      router.refresh();
      window.location.reload();
    } else {
      setError(result.error || 'Failed to update status.');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this message?')) return;
    setLoading(true);
    const result = await deleteMessage(id);
    if (result.success) {
      setSelectedMessage(null);
      router.refresh();
      window.location.reload();
    } else {
      setError(result.error || 'Failed to delete message.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2">Leads &amp; Messages</h1>
        <p className="text-sm text-gray-400">Review inbound client inquires, recruiter request lists, and project scopes.</p>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-mono p-4 rounded-lg">
          $ TRANSACTION FAIL: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.2fr] gap-8 items-start">
        {/* Messages List Table */}
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            {messages.length === 0 ? (
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
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {messages.map((msg) => (
                    <tr 
                      key={msg.id} 
                      onClick={() => setSelectedMessage(msg)}
                      className={`border-b border-[#111116] hover:bg-[#111116] transition-colors last:border-b-0 cursor-pointer ${
                        selectedMessage?.id === msg.id ? 'bg-[#111116]' : ''
                      } ${msg.status === 'unread' ? 'font-medium' : ''}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-white">{msg.name}</span>
                          <span className="text-xs text-gray-500">{msg.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-[var(--accent)] uppercase">
                        {msg.objective}
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500">
                        {new Date(msg.createdAt || '').toLocaleDateString('en-US')}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                          msg.status === 'unread' 
                            ? 'bg-[rgba(0,102,255,0.15)] text-[var(--accent)]' 
                            : msg.status === 'read'
                            ? 'bg-gray-800 text-gray-300'
                            : msg.status === 'spam'
                            ? 'bg-red-950/20 text-red-500 border border-red-500/10'
                            : 'bg-zinc-800 text-zinc-500'
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

        {/* Selected Message Inspector Pane */}
        <div className="bg-[#0d0d10] border border-[#1a1a22] rounded-xl p-8 sticky top-6">
          {selectedMessage ? (
            <div className="flex flex-col gap-6">
              <div className="border-b border-[#1a1a22] pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-semibold text-white">{selectedMessage.name}</h3>
                  <span className="text-xs font-mono text-gray-500">{selectedMessage.email}</span>
                </div>
                <span className="font-mono text-[9px] text-gray-500">
                  {new Date(selectedMessage.createdAt || '').toLocaleString('en-US')}
                </span>
              </div>

              <div>
                <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">OBJECTIVE</h4>
                <p className="font-mono text-xs text-[var(--accent)] uppercase">{selectedMessage.objective}</p>
              </div>

              <div>
                <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">MESSAGE DETAILS</h4>
                <p className="text-sm text-gray-300 leading-relaxed font-light whitespace-pre-wrap">
                  {selectedMessage.details}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="border-t border-[#1a1a22] pt-6 flex flex-wrap gap-2.5">
                {selectedMessage.status === 'unread' && (
                  <button 
                    onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                    className="text-[10px] font-mono border border-[#1a1a22] hover:border-white px-3 py-1.5 rounded text-gray-300 transition-colors cursor-pointer"
                    disabled={loading}
                  >
                    MARK READ
                  </button>
                )}
                {selectedMessage.status !== 'archived' && (
                  <button 
                    onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                    className="text-[10px] font-mono border border-[#1a1a22] hover:border-white px-3 py-1.5 rounded text-gray-300 transition-colors cursor-pointer"
                    disabled={loading}
                  >
                    ARCHIVE
                  </button>
                )}
                {selectedMessage.status !== 'spam' && (
                  <button 
                    onClick={() => handleStatusChange(selectedMessage.id, 'spam')}
                    className="text-[10px] font-mono border border-[rgba(239,68,68,0.2)] hover:border-red-500 px-3 py-1.5 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    disabled={loading}
                  >
                    SPAM
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-[10px] font-mono border border-red-500 bg-red-950/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded transition-all cursor-pointer"
                  disabled={loading}
                >
                  DELETE
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs font-mono text-gray-500">
              SELECT A MESSAGE TO INSPECT DETAILS
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
