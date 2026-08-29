import React from 'react';
import { CheckCircle2, Plus, Search, Sparkles, Inbox } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';

interface EmptyStateProps {
  type: 'no-tasks' | 'no-pending' | 'no-completed' | 'no-search-results';
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  const { openAddTaskModal, setSearchQuery } = useTaskManager();

  switch (type) {
    case 'no-tasks':
      return (
        <div id="empty-state-no-tasks" className="py-16 px-4 text-center max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#ECE7DC] dark:bg-[#2F302B] border border-[#DDD6C7] dark:border-[#3D3F37] flex items-center justify-center text-[#6F806A]">
            <Inbox className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-medium text-[#242421] dark:text-[#E9E5DA] font-serif-heading">
            Your workspace is clear.
          </h3>
          <p className="mt-2 text-sm text-[#77746C] dark:text-[#A8A49A]">
            Add a task when something needs your attention.
          </p>
          <div className="mt-6">
            <button
              id="empty-state-add-task-btn"
              type="button"
              onClick={() => (onAction ? onAction() : openAddTaskModal())}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6F806A] text-[#FCFAF6] hover:bg-[#5F705B] text-sm font-medium transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      );

    case 'no-pending':
      return (
        <div id="empty-state-no-pending" className="py-16 px-4 text-center max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#ECE7DC] dark:bg-[#2F302B] border border-[#DDD6C7] dark:border-[#3D3F37] flex items-center justify-center text-[#6F806A]">
            <CheckCircle2 className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-medium text-[#242421] dark:text-[#E9E5DA] font-serif-heading">
            Nothing waiting on you.
          </h3>
          <p className="mt-2 text-sm text-[#77746C] dark:text-[#A8A49A]">
            Enjoy the clear workspace. All pending tasks have been completed.
          </p>
          <div className="mt-6">
            <button
              id="empty-state-pending-add-btn"
              type="button"
              onClick={() => openAddTaskModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#DCD6C8] dark:border-[#42443C] text-sm font-medium text-[#55524B] dark:text-[#C5C1B6] hover:bg-[#EFEAE0] dark:hover:bg-[#343630] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Task
            </button>
          </div>
        </div>
      );

    case 'no-completed':
      return (
        <div id="empty-state-no-completed" className="py-16 px-4 text-center max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#ECE7DC] dark:bg-[#2F302B] border border-[#DDD6C7] dark:border-[#3D3F37] flex items-center justify-center text-[#77746C] dark:text-[#A8A49A]">
            <Sparkles className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-medium text-[#242421] dark:text-[#E9E5DA] font-serif-heading">
            No completed tasks yet.
          </h3>
          <p className="mt-2 text-sm text-[#77746C] dark:text-[#A8A49A]">
            Complete a task and it will appear here.
          </p>
        </div>
      );

    case 'no-search-results':
      return (
        <div id="empty-state-no-search" className="py-16 px-4 text-center max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#ECE7DC] dark:bg-[#2F302B] border border-[#DDD6C7] dark:border-[#3D3F37] flex items-center justify-center text-[#77746C] dark:text-[#A8A49A]">
            <Search className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-medium text-[#242421] dark:text-[#E9E5DA] font-serif-heading">
            No tasks found.
          </h3>
          <p className="mt-2 text-sm text-[#77746C] dark:text-[#A8A49A]">
            Try another keyword or clear current filters.
          </p>
          <div className="mt-6">
            <button
              id="empty-state-clear-search-btn"
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DCD6C8] dark:border-[#42443C] text-sm font-medium text-[#55524B] dark:text-[#C5C1B6] hover:bg-[#EFEAE0] dark:hover:bg-[#343630] transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
};
