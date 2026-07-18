'use client';

import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-lg border font-mono text-xs shadow-2xl transition-all duration-300 transform translate-y-0 ${
      type === 'success' 
        ? 'bg-[#06170F] border-emerald-500/20 text-emerald-400' 
        : 'bg-[#1C0F0F] border-red-500/20 text-red-400'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
      <span>$ {message.toUpperCase()}</span>
      <button 
        onClick={onClose} 
        className="ml-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
