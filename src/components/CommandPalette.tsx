import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Timer,
  Settings,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { NavigationTab, Priority } from '../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    setActiveTab,
    openAddTaskModal,
    openEditTaskModal,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    startFocusTimer,
    triggerCelebration,
    toggleComplete,
  } = useTaskManager();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Actions list
  const baseActions = [
    {
      id: 'add-task',
      title: 'Create New Task',
      subtitle: 'Open full task creator modal',
      icon: <Plus className="w-4 h-4 text-[#6F806A]" />,
      group: 'Actions',
      run: () => openAddTaskModal(),
    },
    {
      id: 'focus-25',
      title: 'Start 25m Focus Session',
      subtitle: 'Launch Pomodoro timer mode',
      icon: <Timer className="w-4 h-4 text-[#BFA84F]" />,
      group: 'Actions',
      run: () => startFocusTimer(undefined, 25),
    },
    {
      id: 'toggle-theme',
      title: theme === 'dark' ? 'Switch to Day Mode (Light)' : 'Switch to Night Mode (Dark)',
      subtitle: 'Toggle global color palette',
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-[#E5C365]" /> : <Moon className="w-4 h-4 text-[#6F806A]" />,
      group: 'Preferences',
      run: () => toggleTheme(),
    },
    {
      id: 'toggle-sound',
      title: soundEnabled ? 'Mute Interaction Sounds' : 'Enable Interaction Sounds',
      subtitle: 'Toggle tactile audio feedback',
      icon: soundEnabled ? <VolumeX className="w-4 h-4 text-[#B97962]" /> : <Volume2 className="w-4 h-4 text-[#6F806A]" />,
      group: 'Preferences',
      run: () => toggleSound(),
    },
    {
      id: 'celebrate',
      title: 'Celebrate Progress',
      subtitle: 'Trigger celebratory confetti burst',
      icon: <Sparkles className="w-4 h-4 text-[#BFA84F]" />,
      group: 'Actions',
      run: () => triggerCelebration(),
    },
    {
      id: 'nav-overview',
      title: 'Go to Overview',
      subtitle: 'Dashboard, focus items & daily statistics',
      icon: <Layers className="w-4 h-4 text-[#6F806A]" />,
      group: 'Navigation',
      run: () => setActiveTab('overview'),
    },
    {
      id: 'nav-all',
      title: 'Go to All Tasks',
      subtitle: 'Full list of workspace tasks',
      icon: <Layers className="w-4 h-4 text-[#77746C]" />,
      group: 'Navigation',
      run: () => setActiveTab('all'),
    },
    {
      id: 'nav-pending',
      title: 'Go to Pending Tasks',
      subtitle: 'Incomplete tasks and upcoming deadlines',
      icon: <Calendar className="w-4 h-4 text-[#B97962]" />,
      group: 'Navigation',
      run: () => setActiveTab('pending'),
    },
    {
      id: 'nav-completed',
      title: 'Go to Completed Tasks',
      subtitle: 'Finished tasks archive',
      icon: <CheckCircle2 className="w-4 h-4 text-[#6F806A]" />,
      group: 'Navigation',
      run: () => setActiveTab('completed'),
    },
    {
      id: 'nav-categories',
      title: 'Go to Categories',
      subtitle: 'Group tasks by college, study, work & personal',
      icon: <Layers className="w-4 h-4 text-[#BFA84F]" />,
      group: 'Navigation',
      run: () => setActiveTab('categories'),
    },
    {
      id: 'nav-stats',
      title: 'Go to Statistics',
      subtitle: 'Detailed completion and priority insights',
      icon: <BarChart3 className="w-4 h-4 text-[#5B7582]" />,
      group: 'Navigation',
      run: () => setActiveTab('statistics'),
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      subtitle: 'Preferences and data management',
      icon: <Settings className="w-4 h-4 text-[#77746C]" />,
      group: 'Navigation',
      run: () => setActiveTab('settings'),
    },
  ];

  // Task Search results
  const matchingTasks = tasks
    .filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.category.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map(t => ({
      id: `task-${t.id}`,
      title: t.title,
      subtitle: `${t.category} • Due ${t.dueDate} • ${t.priority} Priority ${t.completed ? '(Completed)' : ''}`,
      icon: (
        <span
          onClick={e => {
            e.stopPropagation();
            toggleComplete(t.id);
          }}
          className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer ${
            t.completed
              ? 'bg-[#6F806A] border-[#6F806A] text-white'
              : 'border-[#77746C]/40 hover:border-[#6F806A]'
          }`}
        >
          {t.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
        </span>
      ),
      group: 'Tasks',
      run: () => openEditTaskModal(t),
    }));

  const filteredActions = query.trim()
    ? [
        ...matchingTasks,
        ...baseActions.filter(
          a =>
            a.title.toLowerCase().includes(query.toLowerCase()) ||
            a.subtitle.toLowerCase().includes(query.toLowerCase())
        ),
      ]
    : baseActions;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredActions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredActions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        filteredActions[selectedIndex].run();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div
      id="command-palette-backdrop"
      onClick={() => setIsCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24"
    >
      <div
        id="command-palette-modal"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="w-full max-w-xl bg-white dark:bg-[#252622] rounded-2xl border border-[#242421]/15 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 sm:px-6 py-3.5 border-b border-[#242421]/10 dark:border-white/10 gap-3">
          <Search className="w-5 h-5 text-[#77746C] dark:text-[#A8A49A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search tasks..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium placeholder:text-[#77746C]/60 dark:placeholder:text-[#A8A49A]/50 focus:outline-none text-[#242421] dark:text-[#EDEAE1]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#77746C] dark:text-[#A8A49A] hover:bg-[#F8F6F0] dark:hover:bg-[#343630]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono font-medium text-[#77746C] dark:text-[#8E8B83] bg-[#F8F6F0] dark:bg-[#1E1F1C] border border-[#242421]/10 dark:border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
          {filteredActions.length === 0 ? (
            <div className="py-12 text-center text-[#77746C] dark:text-[#A8A49A]">
              <p className="text-sm font-serif italic">No matching commands or tasks found</p>
              <p className="text-xs mt-1">Try searching for a different title or action</p>
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    action.run();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#6F806A]/15 dark:bg-[#6F806A]/25 text-[#242421] dark:text-white'
                      : 'text-[#55524B] dark:text-[#D5D1C6] hover:bg-[#F8F6F0] dark:hover:bg-[#2F302A]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#F8F6F0] dark:bg-[#1C1D1A] border border-[#242421]/5 dark:border-white/5 flex items-center justify-center shrink-0">
                      {action.icon}
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-semibold truncate">
                        {action.title}
                      </p>
                      <p className="text-[11px] text-[#77746C] dark:text-[#A8A49A] truncate">
                        {action.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[#77746C] dark:text-[#A8A49A]">
                      {action.group}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#6F806A] dark:text-[#A8BAA3]" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#F8F6F0] dark:bg-[#20211E] border-t border-[#242421]/10 dark:border-white/10 flex items-center justify-between text-[11px] text-[#77746C] dark:text-[#A8A49A]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Tip: Press Cmd/Ctrl + K anywhere</span>
        </div>
      </div>
    </div>
  );
};
