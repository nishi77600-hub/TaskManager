import React from 'react';
import {
  Sun,
  Moon,
  RefreshCw,
  Trash2,
  CheckCircle,
  Calendar,
  Keyboard,
} from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { DateFormatStyle } from '../types';
import { formatDateByStyle, getTodayDateString } from '../utils/dateUtils';

export const SettingsPage: React.FC = () => {
  const {
    theme,
    setTheme,
    dateFormat,
    setDateFormat,
    resetToDemoData,
    clearAllTasks,
    openConfirmDialog,
    showToast,
  } = useTaskManager();

  const sampleDate = getTodayDateString();

  const dateOptions: {
    id: DateFormatStyle;
    label: string;
    description: string;
    sample: string;
  }[] = [
    {
      id: 'editorial',
      label: 'Editorial Format',
      description: 'Day Month Year with abbreviated month',
      sample: formatDateByStyle(sampleDate, 'editorial'),
    },
    {
      id: 'dd-mm-yyyy',
      label: 'DD-MM-YYYY Format',
      description: 'Day-Month-Year numeric with dashes',
      sample: formatDateByStyle(sampleDate, 'dd-mm-yyyy'),
    },
    {
      id: 'yyyy-mm-dd',
      label: 'YYYY-MM-DD (ISO) Format',
      description: 'Standard international ISO pattern',
      sample: formatDateByStyle(sampleDate, 'yyyy-mm-dd'),
    },
    {
      id: 'mm-dd-yyyy',
      label: 'MM/DD/YYYY Format',
      description: 'Month/Day/Year numeric with slashes',
      sample: formatDateByStyle(sampleDate, 'mm-dd-yyyy'),
    },
  ];

  const handleDateFormatChange = (format: DateFormatStyle, label: string) => {
    setDateFormat(format);
    showToast(`Date format set to ${label} (${formatDateByStyle(sampleDate, format)})`, 'success');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Night (Dark)' : 'Day (Light)'} mode`, 'info');
  };

  const handleResetTasks = () => {
    openConfirmDialog({
      title: 'Reset to default tasks?',
      message: 'This will replace your current tasks with the curated sample task inventory.',
      confirmButtonText: 'Reset Tasks',
      onConfirm: resetToDemoData,
    });
  };

  const handleClearAll = () => {
    openConfirmDialog({
      title: 'Clear all tasks?',
      message: 'This will erase all tasks from your workspace. You can undo this action immediately after.',
      confirmButtonText: 'Clear All',
      onConfirm: clearAllTasks,
    });
  };

  const shortcuts = [
    { key: '/', desc: 'Quick focus Search bar' },
    { key: '⌘ K / Ctrl K', desc: 'Open Command Palette' },
    { key: 'N', desc: 'Add new task modal' },
    { key: 'T', desc: 'Toggle Day / Night theme' },
    { key: 'Esc', desc: 'Close dialogs and modals' },
  ];

  return (
    <div id="settings-page" className="space-y-8 pb-16 w-full max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#242421]/10 dark:border-white/10">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#242421] dark:text-[#EDEAE1]">
          Settings & Preferences
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#77746C] dark:text-[#A8A49A]">
          Manage appearance, formatting, and workspace data
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance / Theme (Day / Night Mode) */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-serif text-[#242421] dark:text-[#EDEAE1]">
              Appearance & Atmosphere
            </h3>
            <p className="text-xs text-[#77746C] dark:text-[#A8A49A]">
              Choose between Day (Light) mode and Night (Dark) mode
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            {/* Day Mode Button */}
            <button
              id="theme-option-day"
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#F8F6F0] dark:bg-[#343630] border-[#6F806A] ring-2 ring-[#6F806A]/30'
                  : 'bg-white dark:bg-[#282A25] border-[#242421]/10 dark:border-white/10 hover:border-[#6F806A]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#BFA84F]/15 text-[#9C8532] flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#242421] dark:text-[#EDEAE1] block">
                    Day Mode (Light)
                  </span>
                  <span className="text-xs text-[#77746C] dark:text-[#A8A49A]">
                    Calm warm-paper palette
                  </span>
                </div>
              </div>
              {theme === 'light' && <CheckCircle className="w-5 h-5 text-[#6F806A]" />}
            </button>

            {/* Night Mode Button */}
            <button
              id="theme-option-night"
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#F8F6F0] dark:bg-[#343630] border-[#6F806A] ring-2 ring-[#6F806A]/30'
                  : 'bg-white dark:bg-[#282A25] border-[#242421]/10 dark:border-white/10 hover:border-[#6F806A]/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6F806A]/15 text-[#6F806A] dark:text-[#B9CCB5] flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#242421] dark:text-[#EDEAE1] block">
                    Night Mode (Dark)
                  </span>
                  <span className="text-xs text-[#77746C] dark:text-[#A8A49A]">
                    Deep charcoal low-light palette
                  </span>
                </div>
              </div>
              {theme === 'dark' && <CheckCircle className="w-5 h-5 text-[#6F806A]" />}
            </button>
          </div>
        </section>

        {/* Date Display Format */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6F806A]" />
                <h3 className="text-base font-serif text-[#242421] dark:text-[#EDEAE1]">
                  Date Display Format
                </h3>
              </div>
              <p className="text-xs text-[#77746C] dark:text-[#A8A49A] mt-0.5">
                Select how task due dates and deadlines are rendered across all workspace views
              </p>
            </div>

            {/* Live Preview Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F6F0] dark:bg-[#20211E] border border-[#242421]/10 dark:border-white/10 text-xs font-mono text-[#6F806A] dark:text-[#B9CCB5]">
              <span className="text-[10px] text-[#77746C] dark:text-[#A8A49A] font-sans">Preview:</span>
              <span className="font-semibold">{formatDateByStyle(sampleDate, dateFormat)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dateOptions.map(opt => {
              const isSelected = dateFormat === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`date-format-${opt.id}`}
                  type="button"
                  onClick={() => handleDateFormatChange(opt.id, opt.label)}
                  className={`p-4 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F8F6F0] dark:bg-[#343630] border-[#6F806A] ring-2 ring-[#6F806A]/30'
                      : 'bg-white dark:bg-[#282A25] border-[#242421]/10 dark:border-white/10 hover:border-[#6F806A]/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#242421] dark:text-[#EDEAE1] block">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-[#77746C] dark:text-[#A8A49A] block">
                      {opt.description}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#6F806A] dark:text-[#B9CCB5] block pt-1">
                      Example: {opt.sample}
                    </span>
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-[#6F806A] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Keyboard Shortcuts Cheatsheet */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#6F806A]" />
            <h3 className="text-base font-serif text-[#242421] dark:text-[#EDEAE1]">
              Keyboard Shortcuts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {shortcuts.map(sc => (
              <div key={sc.key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#20211E] border border-[#242421]/5 dark:border-white/5 text-xs">
                <span className="text-[#77746C] dark:text-[#A8A49A]">{sc.desc}</span>
                <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 font-mono text-[11px] text-[#242421] dark:text-[#EDEAE1] font-semibold">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </section>

        {/* Data Management Section (Reset & Clear) */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#282A25] border border-[#242421]/10 dark:border-white/10 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-serif text-[#242421] dark:text-[#EDEAE1]">
              Data Management
            </h3>
            <p className="text-xs text-[#77746C] dark:text-[#A8A49A]">
              Reset curated sample tasks or clear your active workspace
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              id="settings-reset-demo-btn"
              type="button"
              onClick={handleResetTasks}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#20211E] text-xs sm:text-sm font-medium text-[#242421] dark:text-[#EDEAE1] hover:bg-[#F8F6F0] dark:hover:bg-[#343630] transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#6F806A]" />
              <span>Reset to Sample Tasks</span>
            </button>

            <button
              id="settings-clear-all-btn"
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B97962]/10 text-[#B97962] dark:text-[#E29B85] hover:bg-[#B97962]/20 border border-[#B97962]/30 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Tasks</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
