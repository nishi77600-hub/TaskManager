import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';

export const ConfirmDialog: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useTaskManager();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmDialog?.isOpen) {
        closeConfirmDialog();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog, closeConfirmDialog]);

  if (!confirmDialog?.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeConfirmDialog}
          className="fixed inset-0 bg-[#1F201D]/40 dark:bg-black/60 backdrop-blur-xs"
        />

        {/* Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          id="confirm-dialog-modal"
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xl p-6 z-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B97962]/10 text-[#B97962] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 id="confirm-dialog-title" className="text-lg font-serif text-[#242421] dark:text-[#EDEAE1]">
                {confirmDialog.title}
              </h3>
            </div>
            <button
              id="confirm-dialog-close"
              type="button"
              onClick={closeConfirmDialog}
              className="text-[#77746C] hover:text-[#242421] dark:text-[#A8A49A] dark:hover:text-[#EDEAE1] p-1.5 rounded-full hover:bg-[#242421]/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p id="confirm-dialog-message" className="mt-3 text-sm text-[#77746C] dark:text-[#A8A49A] leading-relaxed">
            {confirmDialog.message}
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              id="confirm-dialog-cancel"
              type="button"
              onClick={closeConfirmDialog}
              className="px-5 py-2 text-xs sm:text-sm font-medium rounded-full border border-[#242421]/10 dark:border-white/10 text-[#77746C] dark:text-[#A8A49A] hover:bg-[#F8F6F0] dark:hover:bg-[#343630] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-dialog-confirm"
              type="button"
              onClick={() => {
                confirmDialog.onConfirm();
                closeConfirmDialog();
              }}
              className="px-5 py-2 text-xs sm:text-sm font-medium rounded-full bg-[#B97962] hover:bg-[#A46752] text-white shadow-2xs transition-colors cursor-pointer"
            >
              {confirmDialog.confirmButtonText || 'Confirm'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
