import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { Priority } from '../types';

export const PrioritiesView: React.FC = () => {
  const { tasks, openAddTaskModal } = useTaskManager();
  const [selectedPriorityTab, setSelectedPriorityTab] = useState<Priority | 'All'>('All');

  const highTasks = tasks.filter(t => t.priority === 'High');
  const mediumTasks = tasks.filter(t => t.priority === 'Medium');
  const lowTasks = tasks.filter(t => t.priority === 'Low');

  const displayedTasks = selectedPriorityTab === 'All'
    ? tasks
    : tasks.filter(t => t.priority === selectedPriorityTab);

  return (
    <div id="priorities-view-page" className="space-y-8 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242421]/10 dark:border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#242421] dark:text-[#EDEAE1]">
            Priority Matrix
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#77746C] dark:text-[#A8A49A]">
            Triage your workload based on urgency, impact, and due deadlines
          </p>
        </div>

        <button
          id="priority-add-task-btn"
          type="button"
          onClick={() => openAddTaskModal(undefined, selectedPriorityTab !== 'All' ? selectedPriorityTab : 'High')}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#6F806A] hover:bg-[#5A6956] text-white text-xs sm:text-sm font-medium shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Priority Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* High Priority Card */}
        <div
          onClick={() => setSelectedPriorityTab(selectedPriorityTab === 'High' ? 'All' : 'High')}
          className={`p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
            selectedPriorityTab === 'High'
              ? 'bg-white dark:bg-[#282A25] border-[#B97962] ring-2 ring-[#B97962]/30 shadow-md scale-[1.02]'
              : 'bg-white dark:bg-[#282A25] border-[#242421]/10 dark:border-white/10 hover:border-[#B97962]/50 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#B97962] dark:text-[#E49E86] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B97962]" />
                HIGH PRIORITY
              </span>
              <span className="text-xs text-[#77746C] dark:text-[#A8A49A] font-mono font-medium">
                {highTasks.filter(t => !t.completed).length} pending
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
                {highTasks.length.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-[#77746C] dark:text-[#A8A49A]">tasks</span>
            </div>

            <p className="mt-2 text-xs text-[#77746C] dark:text-[#A8A49A] leading-relaxed">
              Critical deliverables, immediate exams, and major deadlines.
            </p>
          </div>
        </div>

        {/* Medium Priority Card */}
        <div
          onClick={() => setSelectedPriorityTab(selectedPriorityTab === 'Medium' ? 'All' : 'Medium')}
          className={`p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
            selectedPriorityTab === 'Medium'
              ? 'bg-white dark:bg-[#282A25] border-[#BFA84F] ring-2 ring-[#BFA84F]/30 shadow-md scale-[1.02]'
              : 'bg-white dark:bg-[#282A25] border-[#242421]/10 dark:border-white/10 hover:border-[#BFA84F]/50 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8B7830] dark:text-[#D9C98C] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#BFA84F]" />
                MEDIUM PRIORITY
              </span>
              <span className="text-xs text-[#77746C] dark:text-[#A8A49A] font-mono font-medium">
                {mediumTasks.filter(t => !t.completed).length} pending
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
                {mediumTasks.length.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-[#77746C] dark:text-[#A8A49A]">tasks</span>
            </div>

            <p className="mt-2 text-xs text-[#77746C] dark:text-[#A8A49A] leading-relaxed">
              Standard study targets, scheduled assignments, and weekly milestones.
            </p>
          </div>
        </div>

        {/* Low Priority Card */}
        <div
          onClick={() => setSelectedPriorityTab(selectedPriorityTab === 'Low' ? 'All' : 'Low')}
          className={`p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
            selectedPriorityTab === 'Low'
              ? 'bg-white dark:bg-[#282A25] border-[#6F806A] ring-2 ring-[#6F806A]/30 shadow-md scale-[1.02]'
              : 'bg-white dark:bg-[#282A25] border-[#242421]/10 dark:border-white/10 hover:border-[#6F806A]/50 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#6F806A] dark:text-[#B9CCB5] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6F806A]" />
                LOW PRIORITY
              </span>
              <span className="text-xs text-[#77746C] dark:text-[#A8A49A] font-mono font-medium">
                {lowTasks.filter(t => !t.completed).length} pending
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
                {lowTasks.length.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-[#77746C] dark:text-[#A8A49A]">tasks</span>
            </div>

            <p className="mt-2 text-xs text-[#77746C] dark:text-[#A8A49A] leading-relaxed">
              Optional readings, research bookmarks, and low-urgency housekeeping.
            </p>
          </div>
        </div>
      </div>

      {/* Task List under selected priority */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
              {selectedPriorityTab === 'All' ? 'All Priority Tasks' : `${selectedPriorityTab} Priority Tasks`}
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 text-[#77746C] dark:text-[#A8A49A]">
              {displayedTasks.length}
            </span>
          </div>

          {selectedPriorityTab !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedPriorityTab('All')}
              className="text-xs text-[#6F806A] dark:text-[#A8BAA3] hover:underline cursor-pointer font-medium"
            >
              Show all priorities
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
              No tasks currently assigned with {selectedPriorityTab} priority.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
