import React from 'react';
import { useTaskManager } from '../context/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { FilterBar } from '../components/FilterBar';
import { EmptyState } from '../components/EmptyState';

export const CompletedTasks: React.FC = () => {
  const {
    filteredTasks,
    stats,
  } = useTaskManager();

  const completedTasksList = filteredTasks.filter(t => t.completed);

  return (
    <div id="completed-tasks-page" className="space-y-6 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242421]/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#242421] dark:text-[#EDEAE1]">
              Completed Tasks
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 text-[#6F806A] dark:text-[#B9CCB5] font-medium">
              {stats.completed} finished
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#77746C] dark:text-[#A8A49A]">
            Archived record of all finished tasks in your workspace
          </p>
        </div>
      </div>

      {/* Filter and Sort bar */}
      {stats.completed > 0 && <FilterBar />}

      {/* List */}
      {completedTasksList.length > 0 ? (
        <div className="space-y-2.5">
          {completedTasksList.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : stats.completed === 0 ? (
        <EmptyState type="no-completed" />
      ) : (
        <EmptyState type="no-search-results" />
      )}
    </div>
  );
};
