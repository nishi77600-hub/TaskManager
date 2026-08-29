import React from 'react';
import { Play, Pause, RotateCcw, Timer, Flame, CheckCircle, Sparkles } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';

export const FocusTimerWidget: React.FC = () => {
  const {
    focusTimer,
    startFocusTimer,
    pauseFocusTimer,
    resumeFocusTimer,
    resetFocusTimer,
    tasks,
    toggleComplete,
  } = useTaskManager();

  const minutes = Math.floor(focusTimer.timeLeft / 60);
  const seconds = focusTimer.timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progressPercent = focusTimer.totalDuration > 0
    ? Math.round(((focusTimer.totalDuration - focusTimer.timeLeft) / focusTimer.totalDuration) * 100)
    : 0;

  const focusedTask = focusTimer.focusedTaskId
    ? tasks.find(t => t.id === focusTimer.focusedTaskId)
    : null;

  return (
    <div
      id="focus-timer-widget"
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-2xs relative overflow-hidden space-y-4"
    >
      {/* Subtle background glow when active */}
      {focusTimer.isActive && !focusTimer.isPaused && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#BFA84F]/10 dark:bg-[#BFA84F]/15 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#BFA84F]/15 text-[#9C8532] dark:text-[#E2CF7C] flex items-center justify-center">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-[#242421] dark:text-[#EDEAE1]">
              Focus Session
            </h3>
            <p className="text-[11px] text-[#77746C] dark:text-[#A8A49A]">
              Pomodoro Deep Work Mode
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => startFocusTimer(focusedTask?.id, 15)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors ${
              focusTimer.totalDuration === 15 * 60 && focusTimer.isActive
                ? 'bg-[#6F806A] text-white'
                : 'bg-[#F8F6F0] dark:bg-[#20211E] text-[#77746C] dark:text-[#A8A49A] hover:text-[#242421] dark:hover:text-white'
            }`}
          >
            15m
          </button>
          <button
            type="button"
            onClick={() => startFocusTimer(focusedTask?.id, 25)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors ${
              focusTimer.totalDuration === 25 * 60 && focusTimer.isActive
                ? 'bg-[#6F806A] text-white'
                : 'bg-[#F8F6F0] dark:bg-[#20211E] text-[#77746C] dark:text-[#A8A49A] hover:text-[#242421] dark:hover:text-white'
            }`}
          >
            25m
          </button>
          <button
            type="button"
            onClick={() => startFocusTimer(focusedTask?.id, 45)}
            className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors ${
              focusTimer.totalDuration === 45 * 60 && focusTimer.isActive
                ? 'bg-[#6F806A] text-white'
                : 'bg-[#F8F6F0] dark:bg-[#20211E] text-[#77746C] dark:text-[#A8A49A] hover:text-[#242421] dark:hover:text-white'
            }`}
          >
            45m
          </button>
        </div>
      </div>

      {/* Timer Display & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#F8F6F0]/70 dark:bg-[#20211E]/70 border border-[#242421]/5 dark:border-white/5">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[#242421] dark:text-[#EDEAE1]">
            {timeFormatted}
          </span>
          <span className="text-xs font-mono text-[#77746C] dark:text-[#A8A49A]">
            {progressPercent}% done
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!focusTimer.isActive ? (
            <button
              id="focus-timer-start-btn"
              type="button"
              onClick={() => startFocusTimer(focusedTask?.id, 25)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#6F806A] text-white text-xs sm:text-sm font-medium hover:bg-[#5A6956] shadow-2xs transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Focus</span>
            </button>
          ) : focusTimer.isPaused ? (
            <button
              id="focus-timer-resume-btn"
              type="button"
              onClick={resumeFocusTimer}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#6F806A] text-white text-xs sm:text-sm font-medium hover:bg-[#5A6956] shadow-2xs transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              id="focus-timer-pause-btn"
              type="button"
              onClick={pauseFocusTimer}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#BFA84F] text-[#242421] text-xs sm:text-sm font-medium hover:bg-[#AFA045] shadow-2xs transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            id="focus-timer-reset-btn"
            type="button"
            onClick={resetFocusTimer}
            title="Reset timer"
            className="p-2 rounded-full border border-[#242421]/10 dark:border-white/10 text-[#77746C] dark:text-[#A8A49A] hover:text-[#242421] dark:hover:text-white hover:bg-white dark:hover:bg-[#282A25] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#242421]/5 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6F806A] dark:bg-[#8FA389] transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Active Task Link */}
      {focusedTask ? (
        <div className="flex items-center justify-between p-3 rounded-lg border border-[#6F806A]/20 bg-[#6F806A]/5 dark:bg-[#6F806A]/10 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-[#6F806A] dark:text-[#B9CCB5]">Target:</span>
            <span className="truncate text-[#242421] dark:text-[#EDEAE1]">{focusedTask.title}</span>
          </div>
          <button
            type="button"
            onClick={() => toggleComplete(focusedTask.id)}
            className="text-[11px] font-medium text-[#6F806A] dark:text-[#B9CCB5] hover:underline shrink-0 ml-2 cursor-pointer"
          >
            {focusedTask.completed ? 'Completed' : 'Mark Done'}
          </button>
        </div>
      ) : (
        <div className="text-[11px] text-[#77746C] dark:text-[#A8A49A] flex items-center justify-between italic">
          <span>Tip: Click "Focus" on any task to link it to this timer session</span>
          <span className="flex items-center gap-1 not-italic font-medium text-[#BFA84F]">
            <Flame className="w-3.5 h-3.5" /> High Intensity
          </span>
        </div>
      )}
    </div>
  );
};
