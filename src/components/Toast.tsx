import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useTaskManager();

  return (
    <AnimatePresence>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 pointer-events-none flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            id="toast-notification"
            className="pointer-events-auto flex items-center justify-between gap-4 py-2.5 px-5 rounded-xl shadow-xl bg-[#242421] text-white border border-[#3C3D38]"
          >
            <div className="flex items-center gap-2.5 text-xs font-medium text-[#EDEAE1]">
              {toast.type === 'delete' ? (
                <Trash2 className="w-3.5 h-3.5 text-[#E29B85] shrink-0" />
              ) : toast.type === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B9CCB5] shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-[#D9C98C] shrink-0" />
              )}
              <span className="truncate max-w-[200px] sm:max-w-xs">{toast.message}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {toast.undoAction && (
                <button
                  id="toast-undo-button"
                  type="button"
                  onClick={() => {
                    toast.undoAction?.();
                    dismissToast();
                  }}
                  className="text-xs text-[#D9C98C] font-semibold hover:underline transition-all cursor-pointer"
                >
                  Undo
                </button>
              )}
              <button
                id="toast-close-button"
                type="button"
                onClick={dismissToast}
                className="p-1 rounded-md text-[#A8A49A] hover:text-white transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

