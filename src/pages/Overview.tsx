import React from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, ArrowRight, ListTodo, CheckCircle } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { EmptyState } from '../components/EmptyState';
import { isOverdue } from '../utils/dateUtils';

export const Overview: React.FC = () => {
  const { tasks, stats, openAddTaskModal, setActiveTab } = useTaskManager();

  // Determine appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning.';
    if (hour < 17) return 'Good afternoon.';
    return 'Good evening.';
  };

  // High priority pending tasks
  const focusTasks = tasks.filter(t => !t.completed && t.priority === 'High');

  // Upcoming pending tasks (ordered by due date)
  const upcomingPendingTasks = tasks
    .filter(t => !t.completed && t.priority !== 'High')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  // Overdue tasks
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.completed));

  return (
    <div id="overview-page" className="space-y-8 pb-12 w-full">
      {/* Editorial Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#242421]/10 dark:border-white/10">
        <div>
          <h2 id="overview-greeting" className="text-3xl sm:text-4xl font-serif italic text-[#242421] dark:text-[#EDEAE1] leading-tight mb-1">
            {getGreeting()}
          </h2>
          <p className="text-[#77746C] dark:text-[#A8A49A] text-sm sm:text-base">
            Focus on what matters most. Complete tasks with precision.
          </p>
        </div>

        <button
          id="overview-quick-add-btn"
          type="button"
          onClick={() => openAddTaskModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6F806A] text-white hover:bg-[#5A6956] text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </header>

      {/* 4 Clean Metric Summary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div
          onClick={() => setActiveTab('all')}
          className="p-5 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xs hover:border-[#6F806A]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#77746C] dark:text-[#A8A49A]">
              Total Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#242421]/5 dark:bg-white/5 text-[#242421] dark:text-[#EDEAE1] flex items-center justify-center">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
              {stats.total.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-[#77746C] dark:text-[#A8A49A]">items</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div
          onClick={() => setActiveTab('pending')}
          className="p-5 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xs hover:border-[#BFA84F]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8B7830] dark:text-[#D9C98C]">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#BFA84F]/15 text-[#8B7830] dark:text-[#D9C98C] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
              {stats.pending.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-[#77746C] dark:text-[#A8A49A]">remaining</span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => setActiveTab('completed')}
          className="p-5 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xs hover:border-[#6F806A]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#6F806A] dark:text-[#B9CCB5]">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#6F806A]/15 text-[#6F806A] dark:text-[#B9CCB5] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
              {stats.completed.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-[#77746C] dark:text-[#A8A49A]">finished</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div
          onClick={() => setActiveTab('statistics')}
          className="p-5 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xs hover:border-[#6F806A]/50 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#77746C] dark:text-[#A8A49A]">
              Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#6F806A]/15 text-[#6F806A] dark:text-[#B9CCB5] flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
              {stats.completionRate}%
            </span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-[#242421]/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6F806A] rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </section>

      {/* Overdue alert banner if any overdue tasks exist */}
      {overdueTasks.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#B97962]/10 border border-[#B97962]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B97962]/20 text-[#B97962] dark:text-[#E49E86] flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[#9E5740] dark:text-[#E29B85]">
                {overdueTasks.length} {overdueTasks.length === 1 ? 'task is' : 'tasks are'} overdue
              </span>
              <p className="text-xs text-[#77746C] dark:text-[#A8A49A] mt-0.5">
                Past scheduled deadline. Take a moment to reschedule or finish them today.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className="text-xs font-semibold text-[#9E5740] dark:text-[#E29B85] hover:underline shrink-0 pl-12 sm:pl-0 cursor-pointer"
          >
            View Overdue Tasks →
          </button>
        </div>
      )}

      {/* Focus Today Section (High Priority Pending Tasks) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B97962]" />
            <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#77746C] dark:text-[#9A968B]">
              High Priority Focus ({focusTasks.length})
            </h3>
          </div>
          <span className="text-xs text-[#77746C] dark:text-[#8E8B83] font-mono">
            Sorted by Urgency
          </span>
        </div>

        {focusTasks.length > 0 ? (
          <div className="space-y-2.5">
            {focusTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl border border-dashed border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25]">
            <p className="text-sm text-[#77746C] dark:text-[#A8A49A] font-serif italic">
              No high-priority tasks pending right now. Great job keeping your priority queue clear!
            </p>
          </div>
        )}
      </section>

      {/* Upcoming Deadlines Section */}
      {upcomingPendingTasks.length > 0 && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6F806A]" />
              <h3 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#77746C] dark:text-[#9A968B]">
                Upcoming Deadlines
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#6F806A] dark:text-[#A8BAA3] hover:underline cursor-pointer"
            >
              <span>View all ({stats.pending})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingPendingTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* Zero tasks total fallback */}
      {tasks.length === 0 && <EmptyState type="no-tasks" />}
    </div>
  );
};
