import React from 'react';
import { Plus } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';

export const PendingTasks: React.FC = () => {
  const {
    filteredTasks,
    openAddTaskModal,
    stats,
  } = useTaskManager();

  const pendingTasksList = filteredTasks.filter(t => !t.completed);

  return (
    <div id="pending-tasks-page" className="space-y-6 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242421]/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#242421] dark:text-[#EDEAE1]">
              Pending Tasks
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-[#6F806A]/15 text-[#6F806A] dark:text-[#B9CCB5] font-medium">
              {stats.pending} remaining
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#77746C] dark:text-[#A8A49A]">
            Focus on what still needs to be accomplished today
          </p>
        </div>

        <button
          id="pending-add-task-btn"
          type="button"
          onClick={() => openAddTaskModal()}
          className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-[#6F806A] hover:bg-[#5A6956] text-white text-xs sm:text-sm font-medium shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter and Sort bar */}
      {stats.pending > 0 && <FilterBar />}

      {/* List */}
      {pendingTasksList.length > 0 ? (
        <div className="space-y-2.5">
          {pendingTasksList.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : stats.pending === 0 ? (
        <EmptyState type="no-pending" />
      ) : (
        <EmptyState type="no-search-results" />
      )}
    </div>
  );
};
