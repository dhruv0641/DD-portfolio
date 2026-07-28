'use client'

import React, { useEffect, useState, memo, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Toast {
  id: string;
  message: string;
  type: 'copy' | 'rightclick' | 'devtools';
}

export const AntiCopy = memo(function AntiCopy() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const keySequenceRef = useRef<string[]>([]);

  // Function to spawn a premium glass toast
  const showToast = useCallback((message: string, type: 'copy' | 'rightclick' | 'devtools') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  useEffect(() => {
    // Helper to determine if target is an interactive text input
    const isInteractive = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') return true;
      if (el.isContentEditable) return true;
      return false;
    };

    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      if (unlocked) return; // Permitted if dev mode unlocked
      const target = e.target as HTMLElement;
      if (isInteractive(target)) return;

      e.preventDefault();
      showToast('Right-click is disabled.', 'rightclick');
    };

    // 2. Block Copy / Cut Events
    const handleCopyCut = (e: ClipboardEvent) => {
      if (unlocked) return; // Permitted if dev mode unlocked
      const target = e.target as HTMLElement;
      if (isInteractive(target)) return;

      e.preventDefault();
      showToast('Copying is disabled on this portfolio.', 'copy');
    };

    // 3. Block Drag Events (Text and Image drag)
    const handleDragStart = (e: DragEvent) => {
      if (unlocked) return; // Permitted if dev mode unlocked
      const target = e.target as HTMLElement;
      if (isInteractive(target)) return;

      // Prevent dragging of any element/image/text selection
      e.preventDefault();
    };

    // 4. Block Keyboard Shortcuts & Handle Dev Unlock sequence
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = isInteractive(target);

      // Listen for "dev" or "unlock" secret code sequence on active viewport key presses
      if (!isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const key = e.key.toLowerCase();
        if (/^[a-z]$/.test(key)) {
          keySequenceRef.current.push(key);
          // Bound historical key sequence length to 6 characters
          if (keySequenceRef.current.length > 6) {
            keySequenceRef.current.shift();
          }
          const currentStr = keySequenceRef.current.join('');
          if (currentStr.endsWith('dev') || currentStr.endsWith('unlock')) {
            setUnlocked((prev) => {
              const nextState = !prev;
              showToast(
                nextState ? 'DEVELOPER MODE UNLOCKED. PROTECTION BYPASSED.' : 'DEVELOPER MODE LOCKED. PROTECTION ACTIVE.',
                'devtools'
              );
              return nextState;
            });
            keySequenceRef.current = [];
            return;
          }
        }
      }

      if (unlocked) return; // Bypass blocker if dev mode is active

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // F12 key (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        showToast('Developer options are restricted.', 'devtools');
        return;
      }

      // Check shortcuts
      if (isCtrlOrCmd) {
        // Block print (Ctrl+P) & Save (Ctrl+S) globally
        if (key === 'p' || key === 's') {
          e.preventDefault();
          showToast('Developer options are restricted.', 'devtools');
          return;
        }

        // Block View Source (Ctrl+U) globally
        if (key === 'u') {
          e.preventDefault();
          showToast('Developer options are restricted.', 'devtools');
          return;
        }

        // Block Inspect / Console (Ctrl+Shift+I / Ctrl+Shift+C / Cmd+Opt+I / Cmd+Opt+C)
        if (e.shiftKey && (key === 'i' || key === 'c')) {
          e.preventDefault();
          showToast('Developer options are restricted.', 'devtools');
          return;
        }

        // Inside inputs/editable fields, allow normal copy/paste/select-all
        if (isInput) return;

        // Block copy (Ctrl+C), cut (Ctrl+X), select all (Ctrl+A) for normal elements
        if (key === 'c' || key === 'x' || key === 'a') {
          e.preventDefault();
          showToast('Copying is disabled on this portfolio.', 'copy');
        }
      }
    };

    // Add global event listeners
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopyCut);
    window.addEventListener('cut', handleCopyCut);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('keydown', handleKeyDown);

    // Clean up all event listeners on unmount
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopyCut);
      window.removeEventListener('cut', handleCopyCut);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showToast, unlocked]); // Add unlocked state dependency to update listener bindings

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] shadow-2xl backdrop-blur-xl font-mono text-[10px] pointer-events-auto"
            style={{
              background: 'rgba(9, 9, 12, 0.75)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Status indicator bar (Blue accent) */}
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
            <span className="text-white/80 font-medium tracking-wide">
              {toast.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default AntiCopy;
