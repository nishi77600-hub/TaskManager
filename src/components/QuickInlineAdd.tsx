import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertCircle, CornerDownLeft, Sparkles, X } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { Priority } from '../types';
import { CATEGORIES } from '../data/initialTasks';
import { getTodayDateString } from '../utils/dateUtils';

interface QuickInlineAddProps {
  defaultCategory?: string;
  defaultPriority?: Priority;
}

export const QuickInlineAdd: React.FC<QuickInlineAddProps> = ({
  defaultCategory,
  defaultPriority = 'Medium',
}) => {
  const { addTask } = useTaskManager();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(defaultCategory || 'Work');
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [dueDate, setDueDate] = useState<string>(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addTask({
      title,
      category,
      priority,
      dueDate: dueDate || getTodayDateString(),
      notes: notes || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    setTitle('');
    setNotes('');
    setTagInput('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <div
        id="quick-inline-add-collapsed"
        onClick={() => setIsExpanded(true)}
        className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-dashed border-[#242421]/15 dark:border-white/15 bg-white/50 dark:bg-[#252622]/50 hover:bg-white dark:hover:bg-[#282A25] hover:border-[#6F806A] dark:hover:border-[#8FA389] transition-all cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-3 text-[#77746C] dark:text-[#A8A49A] group-hover:text-[#242421] dark:group-hover:text-white transition-colors">
          <div className="w-7 h-7 rounded-lg bg-[#6F806A]/10 dark:bg-[#6F806A]/20 text-[#6F806A] dark:text-[#B9CCB5] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-sm font-serif italic">Quick add task or press 'N'...</span>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-[#77746C] dark:text-[#8E8B83] bg-[#F8F6F0] dark:bg-[#1E1F1C] border border-[#242421]/10 dark:border-white/10 rounded">
            N
          </kbd>
        </div>
      </div>
    );
  }

  return (
    <form
      id="quick-inline-add-expanded"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="p-4 sm:p-5 rounded-xl border border-[#6F806A]/30 dark:border-[#8FA389]/40 bg-white dark:bg-[#282A25] shadow-sm space-y-3.5 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#6F806A]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6F806A] dark:text-[#B9CCB5]">
            Quick Capture
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="p-1 rounded-md text-[#77746C] dark:text-[#A8A49A] hover:bg-[#F8F6F0] dark:hover:bg-[#343630] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <input
          id="inline-task-title-input"
          type="text"
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to get done?"
          className="w-full text-base sm:text-lg font-serif placeholder:font-sans placeholder:italic placeholder:text-[#77746C]/60 dark:placeholder:text-[#A8A49A]/50 bg-transparent border-b border-[#242421]/10 dark:border-white/10 pb-2 focus:outline-none focus:border-[#6F806A] text-[#242421] dark:text-[#EDEAE1]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Category */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#242421]/10 dark:border-white/10 bg-[#F8F6F0]/60 dark:bg-[#20211E]">
          <Tag className="w-3.5 h-3.5 text-[#77746C] dark:text-[#A8A49A] shrink-0" />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-transparent text-xs text-[#242421] dark:text-[#EDEAE1] focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-white dark:bg-[#242421]">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#242421]/10 dark:border-white/10 bg-[#F8F6F0]/60 dark:bg-[#20211E]">
          <AlertCircle className="w-3.5 h-3.5 text-[#B97962] shrink-0" />
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
            className="w-full bg-transparent text-xs text-[#242421] dark:text-[#EDEAE1] focus:outline-none cursor-pointer"
          >
            <option value="High" className="bg-white dark:bg-[#242421]">High Priority</option>
            <option value="Medium" className="bg-white dark:bg-[#242421]">Medium Priority</option>
            <option value="Low" className="bg-white dark:bg-[#242421]">Low Priority</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#242421]/10 dark:border-white/10 bg-[#F8F6F0]/60 dark:bg-[#20211E]">
          <Calendar className="w-3.5 h-3.5 text-[#6F806A] shrink-0" />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full bg-transparent text-xs text-[#242421] dark:text-[#EDEAE1] focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#242421]/5 dark:border-white/5">
        <div className="text-[11px] text-[#77746C] dark:text-[#8E8B83] font-mono">
          Press <kbd className="px-1 py-0.5 rounded bg-[#F8F6F0] dark:bg-[#20211E] border border-[#242421]/10 dark:border-white/10">Enter</kbd> to save, <kbd className="px-1 py-0.5 rounded bg-[#F8F6F0] dark:bg-[#20211E] border border-[#242421]/10 dark:border-white/10">Esc</kbd> to cancel
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-3.5 py-1.5 text-xs text-[#77746C] dark:text-[#A8A49A] hover:text-[#242421] dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            id="inline-task-save-btn"
            type="submit"
            disabled={!title.trim()}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-[#6F806A] text-white text-xs font-medium hover:bg-[#5A6956] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Save Task</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </form>
  );
};
