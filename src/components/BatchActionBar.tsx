import React from 'react';
import { CheckSquare, Trash2, X, AlertCircle, Tag, CheckCircle2 } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { CATEGORIES } from '../data/initialTasks';
import { Priority } from '../types';

export const BatchActionBar: React.FC = () => {
  const {
    selectedTaskIds,
    clearSelection,
    batchComplete,
    batchDelete,
    batchSetPriority,
    batchSetCategory,
  } = useTaskManager();

  if (selectedTaskIds.length === 0) return null;

  return (
    <div
      id="batch-action-bar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#242421] text-[#EDEAE1] dark:bg-[#2F312B] dark:text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex flex-wrap items-center gap-3 sm:gap-4 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex items-center gap-2 pr-2 border-r border-white/15">
        <CheckSquare className="w-4 h-4 text-[#A8BAA3]" />
        <span className="text-xs sm:text-sm font-semibold font-mono">
          {selectedTaskIds.length} {selectedTaskIds.length === 1 ? 'task' : 'tasks'} selected
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Complete All */}
        <button
          type="button"
          onClick={batchComplete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6F806A] text-white hover:bg-[#5A6956] text-xs font-medium transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Complete</span>
        </button>

        {/* Priority Dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#E2CF7C]" />
            <span>Priority</span>
          </button>
          <div className="absolute bottom-full mb-2 left-0 hidden group-hover:flex flex-col bg-[#1C1D1A] border border-white/10 rounded-xl p-1 shadow-xl min-w-[120px]">
            <button
              type="button"
              onClick={() => batchSetPriority('High')}
              className="px-3 py-1.5 text-left text-xs hover:bg-white/10 rounded-lg text-[#E49E86]"
            >
              High Priority
            </button>
            <button
              type="button"
              onClick={() => batchSetPriority('Medium')}
              className="px-3 py-1.5 text-left text-xs hover:bg-white/10 rounded-lg text-[#E2CF7C]"
            >
              Medium Priority
            </button>
            <button
              type="button"
              onClick={() => batchSetPriority('Low')}
              className="px-3 py-1.5 text-left text-xs hover:bg-white/10 rounded-lg text-[#A8BAA3]"
            >
              Low Priority
            </button>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-[#B9CCB5]" />
            <span>Category</span>
          </button>
          <div className="absolute bottom-full mb-2 left-0 hidden group-hover:flex flex-col bg-[#1C1D1A] border border-white/10 rounded-xl p-1 shadow-xl min-w-[130px]">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => batchSetCategory(cat)}
                className="px-3 py-1.5 text-left text-xs hover:bg-white/10 rounded-lg"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Delete All */}
        <button
          type="button"
          onClick={batchDelete}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#B97962]/20 hover:bg-[#B97962]/30 text-[#E49E86] text-xs font-medium transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      <button
        type="button"
        onClick={clearSelection}
        title="Deselect all"
        className="p-1 rounded-md text-[#A8A49A] hover:text-white hover:bg-white/10 transition-colors ml-auto cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
