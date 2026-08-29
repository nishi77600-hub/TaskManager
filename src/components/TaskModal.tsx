import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { Priority } from '../types';
import { CATEGORIES } from '../data/initialTasks';
import { getTodayDateString, isValidDate } from '../utils/dateUtils';

export const TaskModal: React.FC = () => {
  const { isTaskModalOpen, closeTaskModal, editingTask, addTask, editTask } = useTaskManager();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('College');
  const [customCategory, setCustomCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Populate or reset form whenever modal opens or editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      if (CATEGORIES.includes(editingTask.category as any)) {
        setCategory(editingTask.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(editingTask.category);
      }
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setNotes(editingTask.notes || '');
      setError('');
    } else {
      setTitle('');
      setCategory('College');
      setCustomCategory('');
      setPriority('Medium');
      setDueDate(getTodayDateString());
      setNotes('');
      setError('');
    }
  }, [editingTask, isTaskModalOpen]);

  // Keyboard navigation: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTaskModalOpen) {
        closeTaskModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, closeTaskModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a task title.');
      return;
    }

    if (!dueDate || !isValidDate(dueDate)) {
      setError('Please select a valid due date (YYYY-MM-DD).');
      return;
    }

    const finalCategory = category === 'Other' && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    if (editingTask) {
      editTask(editingTask.id, {
        title: trimmedTitle,
        category: finalCategory,
        priority,
        dueDate,
        notes: notes.trim() || undefined,
      });
    } else {
      addTask({
        title: trimmedTitle,
        category: finalCategory,
        priority,
        dueDate,
        notes: notes.trim() || undefined,
      });
    }

    closeTaskModal();
  };

  const handleQuickDate = (daysFromToday: number) => {
    const now = new Date();
    now.setDate(now.getDate() + daysFromToday);
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    setDueDate(`${y}-${m}-${d}`);
  };

  if (!isTaskModalOpen) return null;

  const isEditing = Boolean(editingTask);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeTaskModal}
          className="fixed inset-0 bg-[#1F201D]/40 dark:bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          id="task-form-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-title"
          className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xl p-6 sm:p-7 z-10 my-8"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#242421]/10 dark:border-white/10">
            <div>
              <h2 id="task-modal-title" className="text-xl font-serif text-[#242421] dark:text-[#EDEAE1]">
                {isEditing ? 'Edit Task' : 'Add New Task'}
              </h2>
              <p className="text-xs text-[#77746C] dark:text-[#A8A49A] mt-0.5">
                {isEditing ? 'Modify task details and notes' : 'Define actionable objectives and deadlines'}
              </p>
            </div>
            <button
              id="task-modal-close-btn"
              type="button"
              onClick={closeTaskModal}
              className="text-[#77746C] hover:text-[#242421] dark:text-[#A8A49A] dark:hover:text-[#EDEAE1] p-1.5 rounded-full hover:bg-[#242421]/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Task Title */}
            <div>
              <label htmlFor="task-title-input" className="block text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A] mb-1.5">
                Task Title *
              </label>
              <input
                id="task-title-input"
                type="text"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="What needs to be done?"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-[#242421]/10 dark:border-white/10 bg-[#F8F6F0]/50 dark:bg-[#20211E] text-[#242421] dark:text-[#EDEAE1] placeholder:text-[#77746C]/60 focus:outline-none focus:ring-2 focus:ring-[#6F806A]/30 focus:border-[#6F806A] text-sm transition-all shadow-2xs"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A] mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      id={`task-category-btn-${cat.toLowerCase()}`}
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-2 text-xs font-medium rounded-full border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#6F806A] text-[#EDEAE1] border-[#6F806A] shadow-xs'
                          : 'bg-[#F8F6F0] dark:bg-[#20211E] border-[#242421]/10 dark:border-white/10 text-[#77746C] dark:text-[#A8A49A] hover:border-[#6F806A]/50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {category === 'Other' && (
                <div className="mt-2.5">
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#77746C] dark:text-[#A8A49A]" />
                    <input
                      id="custom-category-input"
                      type="text"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      placeholder="Specify custom category name"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#242421]/10 dark:border-white/10 bg-[#F8F6F0]/50 dark:bg-[#20211E] text-xs text-[#242421] dark:text-[#EDEAE1] placeholder:text-[#77746C]/60 focus:outline-none focus:ring-1 focus:ring-[#6F806A]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A] mb-1.5">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['High', 'Medium', 'Low'] as Priority[]).map(p => {
                  const isSelected = priority === p;
                  let activeClasses = '';
                  if (p === 'High') {
                    activeClasses = isSelected
                      ? 'bg-[#B97962] text-white border-[#B97962] shadow-xs'
                      : 'border-[#B97962]/30 text-[#B97962] bg-[#B97962]/5 hover:bg-[#B97962]/10';
                  } else if (p === 'Medium') {
                    activeClasses = isSelected
                      ? 'bg-[#BFA84F] text-white border-[#BFA84F] shadow-xs'
                      : 'border-[#BFA84F]/40 text-[#8B7830] dark:text-[#D9C98C] bg-[#BFA84F]/5 hover:bg-[#BFA84F]/10';
                  } else {
                    activeClasses = isSelected
                      ? 'bg-[#6F806A] text-white border-[#6F806A] shadow-xs'
                      : 'border-[#6F806A]/30 text-[#6F806A] dark:text-[#B9CCB5] bg-[#6F806A]/5 hover:bg-[#6F806A]/10';
                  }

                  return (
                    <button
                      key={p}
                      type="button"
                      id={`priority-select-btn-${p.toLowerCase()}`}
                      onClick={() => setPriority(p)}
                      className={`py-2 px-3 rounded-full border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeClasses}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? 'bg-white'
                            : p === 'High'
                            ? 'bg-[#B97962]'
                            : p === 'Medium'
                            ? 'bg-[#BFA84F]'
                            : 'bg-[#6F806A]'
                        }`}
                      />
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="task-due-date-input" className="text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A]">
                  Due Date
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickDate(0)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#F8F6F0] dark:bg-[#20211E] text-[#77746C] dark:text-[#A8A49A] hover:text-[#6F806A]"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDate(1)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#F8F6F0] dark:bg-[#20211E] text-[#77746C] dark:text-[#A8A49A] hover:text-[#6F806A]"
                  >
                    +1d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDate(7)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#F8F6F0] dark:bg-[#20211E] text-[#77746C] dark:text-[#A8A49A] hover:text-[#6F806A]"
                  >
                    +7d
                  </button>
                </div>
              </div>

              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-[#77746C] dark:text-[#A8A49A] pointer-events-none" />
                <input
                  id="task-due-date-input"
                  type="date"
                  value={dueDate}
                  onChange={e => {
                    setDueDate(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#242421]/10 dark:border-white/10 bg-[#F8F6F0]/50 dark:bg-[#20211E] text-xs sm:text-sm text-[#242421] dark:text-[#EDEAE1] focus:outline-none focus:ring-2 focus:ring-[#6F806A]/30 focus:border-[#6F806A]"
                />
              </div>
            </div>

            {/* Notes & Description */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A] mb-1.5">
                Notes & Context (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add background notes, links, or requirements..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#242421]/10 dark:border-white/10 bg-[#F8F6F0]/50 dark:bg-[#20211E] text-xs text-[#242421] dark:text-[#EDEAE1] placeholder:text-[#77746C]/60 focus:outline-none focus:ring-2 focus:ring-[#6F806A]/30 focus:border-[#6F806A]"
              />
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#B97962]/10 border border-[#B97962]/20 text-xs text-[#B97962]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#242421]/10 dark:border-white/10">
              <button
                id="task-modal-cancel-btn"
                type="button"
                onClick={closeTaskModal}
                className="px-5 py-2 text-xs sm:text-sm font-medium rounded-full border border-[#242421]/10 dark:border-white/10 text-[#77746C] dark:text-[#A8A49A] hover:bg-[#F8F6F0] dark:hover:bg-[#343630] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="task-modal-submit-btn"
                type="submit"
                className="px-6 py-2 text-xs sm:text-sm font-medium rounded-full bg-[#6F806A] hover:bg-[#5F705B] text-white shadow-xs transition-colors cursor-pointer"
              >
                {isEditing ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
