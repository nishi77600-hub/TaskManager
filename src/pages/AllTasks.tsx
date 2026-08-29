import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';

export const AllTasks: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    openAddTaskModal,
    openConfirmDialog,
    clearAllTasks,
  } = useTaskManager();

  const handleClearAll = () => {
    openConfirmDialog({
      title: 'Clear all tasks?',
      message: 'This will remove all tasks from your workspace. You can undo this action immediately after.',
      confirmButtonText: 'Clear All',
      onConfirm: clearAllTasks,
    });
  };

  return (
    <div id="all-tasks-page" className="space-y-6 pb-16 w-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242421]/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#242421] dark:text-[#EDEAE1]">
              All Tasks
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 text-[#77746C] dark:text-[#A8A49A]">
              {tasks.length}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#77746C] dark:text-[#A8A49A]">
            Manage, organize, and monitor all tasks in your workspace
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {tasks.length > 0 && (
            <button
              id="all-tasks-clear-all-btn"
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25] text-xs font-medium text-[#77746C] hover:text-[#B97962] hover:bg-[#B97962]/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}

          <button
            id="all-tasks-add-btn"
            type="button"
            onClick={() => openAddTaskModal()}
            className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2 rounded-full bg-[#6F806A] hover:bg-[#5A6956] text-white text-xs sm:text-sm font-medium shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Sort bar */}
      {tasks.length > 0 && <FilterBar />}

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState type="no-tasks" />
      ) : (
        <EmptyState type="no-search-results" />
      )}
    </div>
  );
};
