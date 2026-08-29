import React from 'react';
import { useTaskManager } from '../context/TaskContext';

export const StatisticsPage: React.FC = () => {
  const { stats } = useTaskManager();

  return (
    <div id="statistics-page" className="space-y-8 pb-12 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242421]/5 dark:border-white/5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#242421] dark:text-[#EDEAE1]">
            Task Statistics
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#77746C] dark:text-[#A8A49A]">
            Real-time analytics and completion breakdown derived directly from your workspace
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#77746C] dark:text-[#A8A49A]">
          <span>{stats.total} total recorded records</span>
        </div>
      </div>

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A]">
            Total Tasks
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-serif text-[#242421] dark:text-[#EDEAE1]">
            {stats.total.toString().padStart(2, '0')}
          </div>
          <p className="mt-1 text-xs text-[#77746C] dark:text-[#A8A49A]">
            100% of workspace inventory
          </p>
        </div>

        {/* Completed Tasks */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A]">
            Completed
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-serif text-[#6F806A] dark:text-[#B9CCB5]">
            {stats.completed.toString().padStart(2, '0')}
          </div>
          <p className="mt-1 text-xs text-[#77746C] dark:text-[#A8A49A]">
            {stats.completionRate}% completion rate
          </p>
        </div>

        {/* Pending Tasks */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A]">
            Pending
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-serif text-[#242421] dark:text-[#EDEAE1]">
            {stats.pending.toString().padStart(2, '0')}
          </div>
          <p className="mt-1 text-xs text-[#77746C] dark:text-[#A8A49A]">
            {stats.highPriorityPending} high-priority
          </p>
        </div>

        {/* Overdue */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#77746C] dark:text-[#A8A49A]">
            Overdue
          </div>
          <div className={`mt-3 text-3xl sm:text-4xl font-serif ${
            stats.overdueCount > 0 ? 'text-[#B97962]' : 'text-[#242421] dark:text-[#EDEAE1]'
          }`}>
            {stats.overdueCount.toString().padStart(2, '0')}
          </div>
          <p className="mt-1 text-xs text-[#77746C] dark:text-[#A8A49A]">
            {stats.overdueCount > 0 ? 'Requires attention' : 'Deadlines on track'}
          </p>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <section className="p-6 rounded-xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif text-[#242421] dark:text-[#EDEAE1]">
              Overall Completion Ratio
            </h3>
            <p className="text-xs text-[#77746C] dark:text-[#A8A49A]">
              Progress across all recorded tasks
            </p>
          </div>
          <span className="text-2xl font-serif text-[#6F806A] dark:text-[#B9CCB5]">
            {stats.completionRate}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-2.5 rounded-full bg-[#242421]/5 dark:bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#6F806A] transition-all duration-500 ease-out"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#77746C] dark:text-[#A8A49A] pt-1 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6F806A]" />
            {stats.completed} Tasks Finished
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#242421]/20 dark:bg-white/20" />
            {stats.pending} Tasks Remaining
          </span>
        </div>
      </section>

      {/* Two Column Section: Priority Breakdown & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Breakdown */}
        <section className="p-6 rounded-xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-serif text-[#242421] dark:text-[#EDEAE1]">
              Priority Distribution
            </h3>
            <p className="text-xs text-[#77746C] dark:text-[#A8A49A]">
              Active workload triage by severity
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {stats.priorityBreakdown.map(item => {
              const total = item.total;
              const completed = item.completed;
              const pending = item.pending;
              const percent = stats.total > 0 ? Math.round((total / stats.total) * 100) : 0;

              let barColor = 'bg-[#6F806A]';
              let textColor = 'text-[#6F806A] dark:text-[#B9CCB5]';
              if (item.priority === 'High') {
                barColor = 'bg-[#B97962]';
                textColor = 'text-[#B97962]';
              } else if (item.priority === 'Medium') {
                barColor = 'bg-[#BFA84F]';
                textColor = 'text-[#8B7830] dark:text-[#D9C98C]';
              }

              return (
                <div key={item.priority} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-serif italic uppercase text-[11px] font-semibold ${textColor}`}>
                        {item.priority}
                      </span>
                      <span className="text-[#77746C] dark:text-[#A8A49A] text-[11px]">
                        ({pending} pending / {completed} done)
                      </span>
                    </div>
                    <span className="font-mono font-medium text-[#242421] dark:text-[#EDEAE1]">
                      {total} ({percent}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#242421]/5 dark:bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="p-6 rounded-xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-serif text-[#242421] dark:text-[#EDEAE1]">
              Category Allocation
            </h3>
            <p className="text-xs text-[#77746C] dark:text-[#A8A49A]">
              Task distribution across defined categories
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {stats.categoryBreakdown.length > 0 ? (
              stats.categoryBreakdown.map(item => {
                const percent = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                const completionInCat = item.count > 0 ? Math.round((item.completedCount / item.count) * 100) : 0;

                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#242421] dark:text-[#EDEAE1]">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-[#77746C] dark:text-[#A8A49A]">
                        <span>{item.completedCount}/{item.count} done</span>
                        <span className="text-[#6F806A] dark:text-[#B9CCB5] font-semibold">({completionInCat}%)</span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#242421]/5 dark:bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#6F806A] transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#77746C] dark:text-[#A8A49A] font-serif italic">
                No categories available. Add tasks to see breakdown.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

