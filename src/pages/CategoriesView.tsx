import React, { useState } from 'react';
import { Plus, Clock, Tag } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { CATEGORIES } from '../data/initialTasks';

export const CategoriesView: React.FC = () => {
  const { tasks, openAddTaskModal } = useTaskManager();
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('All');

  // Extract all categories in tasks + default categories
  const allCategoryNames = Array.from(
    new Set([...CATEGORIES, ...tasks.map(t => t.category)])
  ).filter(Boolean);

  const displayedTasks = selectedCategoryTab === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === selectedCategoryTab);

  return (
    <div id="categories-view-page" className="space-y-8 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242421]/10 dark:border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#242421] dark:text-[#EDEAE1]">
            Task Categories
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#77746C] dark:text-[#A8A49A]">
            Contextual grouping for academic, project, fitness, and reading workflows
          </p>
        </div>

        <button
          id="category-add-task-btn"
          type="button"
          onClick={() => openAddTaskModal(selectedCategoryTab !== 'All' ? selectedCategoryTab : undefined)}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#6F806A] hover:bg-[#5A6956] text-white text-xs sm:text-sm font-medium shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add to {selectedCategoryTab !== 'All' ? selectedCategoryTab : 'Category'}</span>
        </button>
      </div>

      {/* Category Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {allCategoryNames.map(categoryName => {
          const categoryTasks = tasks.filter(t => t.category === categoryName);
          const pendingCount = categoryTasks.filter(t => !t.completed).length;
          const completedCount = categoryTasks.filter(t => t.completed).length;
          const isSelected = selectedCategoryTab === categoryName;
          const completionPct = categoryTasks.length > 0 
            ? Math.round((completedCount / categoryTasks.length) * 100) 
            : 0;

          return (
            <div
              key={categoryName}
              onClick={() => setSelectedCategoryTab(isSelected ? 'All' : categoryName)}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-150 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-[#282A25] border-[#6F806A] ring-2 ring-[#6F806A]/30 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-[#282A25] border-[#242421]/10 dark:border-white/10 hover:border-[#6F806A]/50 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#77746C] dark:text-[#A8A49A]">
                  <span className="truncate font-mono uppercase tracking-wider text-[11px]">{categoryName}</span>
                  <Tag className="w-3.5 h-3.5 opacity-60" />
                </div>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
                    {categoryTasks.length.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-[#77746C] dark:text-[#A8A49A]">tasks</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {/* Progress bar */}
                <div className="w-full bg-[#242421]/5 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6F806A] rounded-full transition-all duration-300"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#77746C] dark:text-[#A8A49A] pt-1">
                  <span className="flex items-center gap-1 text-[#6F806A] dark:text-[#B9CCB5]">
                    <Clock className="w-3 h-3" /> {pendingCount} open
                  </span>
                  <span>{completionPct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Category Tasks List */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
              {selectedCategoryTab === 'All' ? 'All Tasks across Categories' : `${selectedCategoryTab} Category Tasks`}
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 text-[#77746C] dark:text-[#A8A49A]">
              {displayedTasks.length}
            </span>
          </div>

          {selectedCategoryTab !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedCategoryTab('All')}
              className="text-xs text-[#6F806A] dark:text-[#A8BAA3] hover:underline cursor-pointer font-medium"
            >
              Show all categories
            </button>
          )}
        </div>

        {displayedTasks.length > 0 ? (
          <div className="space-y-2.5">
            {displayedTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25]">
            <p className="text-sm text-[#77746C] dark:text-[#A8A49A] font-serif italic">
              No tasks found in category "{selectedCategoryTab}".
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
