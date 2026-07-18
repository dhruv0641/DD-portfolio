'use client';

import React from 'react';
import { logoutAdmin } from '@/app/actions/login';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors cursor-pointer border border-[rgba(239,68,68,0.2)] rounded px-2.5 py-1 bg-[rgba(239,68,68,0.05)] hover:bg-[rgba(239,68,68,0.1)]"
    >
      LOGOUT
    </button>
  );
}
