import React from 'react';
import { Flame, CheckCircle2, Trophy, Sparkles, Clock, Target } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';

export const DailyStreakCard: React.FC = () => {
  const { stats, triggerCelebration } = useTaskManager();

  const dailyGoal = 5;
  const progressRatio = Math.min(stats.completed / Math.max(dailyGoal, 1), 1);
  const percent = Math.round(progressRatio * 100);

  return (
    <div
      id="daily-streak-card"
      className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white via-white to-[#F8F6F0] dark:from-[#282A25] dark:via-[#282A25] dark:to-[#22241F] border border-[#242421]/10 dark:border-white/10 shadow-2xs relative overflow-hidden flex flex-col justify-between space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B97962]/15 text-[#B97962] dark:text-[#E49E86] flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
                {stats.streakDays} Day Momentum
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#B97962]/10 text-[#B97962] dark:text-[#E49E86] font-semibold">
                Active Streak
              </span>
            </div>
            <p className="text-xs text-[#77746C] dark:text-[#A8A49A]">
              Daily target: {stats.completed}/{dailyGoal} completed today
            </p>
          </div>
        </div>

        <button
          id="streak-celebrate-btn"
          type="button"
          onClick={triggerCelebration}
          title="Trigger celebratory confetti"
          className="p-2 rounded-full border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#20211E] text-[#BFA84F] hover:scale-105 transition-all shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar & Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#77746C] dark:text-[#A8A49A] flex items-center gap-1 font-sans">
            <Target className="w-3.5 h-3.5 text-[#6F806A]" /> Daily Completion Goal
          </span>
          <span className="font-bold text-[#242421] dark:text-[#EDEAE1]">
            {stats.completionRate}%
          </span>
        </div>
        <div className="w-full bg-[#242421]/5 dark:bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#6F806A] to-[#8FA389] rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Quick stats micro-strip */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#242421]/5 dark:border-white/5 text-center">
        <div className="p-2 rounded-lg bg-[#F8F6F0]/60 dark:bg-[#20211E]/60">
          <p className="text-[10px] text-[#77746C] dark:text-[#A8A49A] uppercase tracking-wider font-semibold">
            Done
          </p>
          <p className="text-sm font-serif font-bold text-[#6F806A] dark:text-[#B9CCB5]">
            {stats.completed}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-[#F8F6F0]/60 dark:bg-[#20211E]/60">
          <p className="text-[10px] text-[#77746C] dark:text-[#A8A49A] uppercase tracking-wider font-semibold">
            Remaining
          </p>
          <p className="text-sm font-serif font-bold text-[#B97962] dark:text-[#E49E86]">
            {stats.pending}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-[#F8F6F0]/60 dark:bg-[#20211E]/60">
          <p className="text-[10px] text-[#77746C] dark:text-[#A8A49A] uppercase tracking-wider font-semibold">
            High Priority
          </p>
          <p className="text-sm font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
            {stats.highPriorityPending}
          </p>
        </div>
      </div>
    </div>
  );
};
