import React, { useState } from 'react';
import {
  Check,
  Edit3,
  Trash2,
  AlertCircle,
  FileText,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import { useTaskManager } from '../context/TaskContext';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { formatDateByStyle, isOverdue } from '../utils/dateUtils';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const {
    toggleComplete,
    openEditTaskModal,
    openConfirmDialog,
    deleteTask,
    dateFormat,
  } = useTaskManager();

  const [showNotes, setShowNotes] = useState(false);

  const overdue = isOverdue(task.dueDate, task.completed);
  const formattedDate = formatDateByStyle(task.dueDate, dateFormat);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmDialog({
      title: 'Delete this task?',
      message: `This action will remove "${task.title}" from your workspace. You can undo this action immediately after.`,
      confirmButtonText: 'Delete',
      onConfirm: () => deleteTask(task.id),
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditTaskModal(task);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      id={`task-item-${task.id}`}
      className={`group relative flex flex-col p-4 bg-white dark:bg-[#282A25] hover:bg-[#FAF9F5] dark:hover:bg-[#30322C] border border-[#242421]/10 dark:border-white/10 rounded-2xl shadow-xs transition-all duration-150 ${
        task.completed ? 'opacity-70 bg-[#FAF9F5] dark:bg-[#22241F]' : ''
      }`}
    >
      {/* Main Row */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Circular status checkbox + Title & Badges */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {/* Primary Task Completion Checkbox */}
          <button
            id={`task-checkbox-${task.id}`}
            type="button"
            role="checkbox"
            aria-checked={task.completed}
            aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as completed'}
            onClick={() => toggleComplete(task.id)}
            className={`w-6 h-6 rounded-full border-2 border-[#6F806A] flex items-center justify-center shrink-0 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              task.completed
                ? 'bg-[#6F806A] text-white shadow-xs'
                : 'hover:bg-[#6F806A]/10 bg-transparent'
            }`}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* Title & metadata */}
          <div className="flex-1 min-w-0">
            <h4
              id={`task-title-${task.id}`}
              onClick={() => toggleComplete(task.id)}
              className={`text-sm sm:text-base font-serif font-medium leading-snug cursor-pointer transition-all ${
                task.completed
                  ? 'line-through text-[#77746C] dark:text-[#8E8B83]'
                  : 'text-[#242421] dark:text-[#EDEAE1] hover:text-[#6F806A]'
              }`}
            >
              {task.title}
            </h4>

            {/* Badges & Due Date */}
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
              <CategoryBadge category={task.category} />
              <PriorityBadge priority={task.priority} />

              <span className="text-[11px] font-mono text-[#77746C] dark:text-[#A8A49A] flex items-center gap-1">
                <span>Due {formattedDate}</span>
              </span>

              {overdue && (
                <span
                  id={`task-overdue-tag-${task.id}`}
                  className="text-[10px] text-[#B97962] bg-[#B97962]/10 dark:bg-[#B97962]/20 px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1"
                >
                  <AlertCircle className="w-2.5 h-2.5" />
                  Overdue
                </span>
              )}

              {task.notes && (
                <button
                  type="button"
                  onClick={() => setShowNotes(prev => !prev)}
                  className="text-[#77746C] dark:text-[#A8A49A] hover:text-[#242421] dark:hover:text-white inline-flex items-center gap-1 text-[11px]"
                  title="Toggle task notes"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showNotes ? 'Hide notes' : 'Notes'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            id={`task-edit-btn-${task.id}`}
            type="button"
            onClick={handleEditClick}
            aria-label={`Edit task ${task.title}`}
            className="p-1.5 rounded-lg text-[#77746C] hover:text-[#242421] dark:text-[#A8A49A] dark:hover:text-[#EDEAE1] hover:bg-[#242421]/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            id={`task-delete-btn-${task.id}`}
            type="button"
            onClick={handleDeleteClick}
            aria-label={`Delete task ${task.title}`}
            className="p-1.5 rounded-lg text-[#77746C] hover:text-[#B97962] dark:text-[#A8A49A] dark:hover:text-[#E29B85] hover:bg-[#B97962]/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Section: Notes */}
      <AnimatePresence>
        {showNotes && task.notes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 mt-3 border-t border-[#242421]/10 dark:border-white/10 overflow-hidden text-xs"
          >
            <div className="p-2.5 rounded-lg bg-[#F8F6F0] dark:bg-[#20211E] text-[#55524B] dark:text-[#C5C1B6] leading-relaxed">
              <span className="font-semibold text-[#242421] dark:text-[#EDEAE1] block mb-0.5">Notes:</span>
              <p className="whitespace-pre-wrap">{task.notes}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
