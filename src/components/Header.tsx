import React from 'react';
import { Menu, Plus, Calendar, Sun, Moon, Command } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { SearchBar } from './SearchBar';
import { formatDateByStyle, getTodayDateString } from '../utils/dateUtils';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    activeTab,
    openAddTaskModal,
    theme,
    toggleTheme,
    dateFormat,
    setIsCommandPaletteOpen,
  } = useTaskManager();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview';
      case 'all':
        return 'All Tasks';
      case 'pending':
        return 'Pending Tasks';
      case 'completed':
        return 'Completed Tasks';
      case 'categories':
        return 'Categories';
      case 'priorities':
        return 'Priorities';
      case 'statistics':
        return 'Task Statistics';
      case 'settings':
        return 'Settings';
      default:
        return 'Workspace';
    }
  };

  const todayFormatted = formatDateByStyle(getTodayDateString(), dateFormat);

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-8 md:px-10 py-3.5 bg-[#F8F6F0] dark:bg-[#1C1D1A] border-b border-[#242421]/10 dark:border-white/10"
    >
      {/* Left side: Hamburger button + Page Title */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle-btn"
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl border border-[#77746C]/20 bg-white dark:bg-[#282A25] text-[#55524B] dark:text-[#C5C1B6] hover:bg-[#F8F6F0] dark:hover:bg-[#343630] transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 id="header-page-title" className="text-lg sm:text-xl font-serif font-bold text-[#242421] dark:text-[#EDEAE1] tracking-tight">
            {getPageTitle()}
          </h2>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#77746C] dark:text-[#A8A49A]">
            <Calendar className="w-3 h-3 text-[#8A867E]" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Right side: Search, Cmd+K, Theme & Add CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="w-32 sm:w-56 lg:w-64">
          <SearchBar placeholder="Search..." />
        </div>

        {/* Command Palette Trigger Button */}
        <button
          id="header-cmd-k-btn"
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          title="Open Command Palette (Cmd+K)"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25] text-[#77746C] dark:text-[#A8A49A] hover:text-[#242421] dark:hover:text-white hover:border-[#6F806A]/40 transition-colors text-xs font-mono cursor-pointer shadow-2xs"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="text-[11px] font-sans font-medium">K</span>
        </button>

        {/* Day / Night Theme Toggle */}
        <button
          id="header-theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Day mode' : 'Switch to Night mode'}
          title={theme === 'dark' ? 'Switch to Day mode' : 'Switch to Night mode'}
          className="p-2 rounded-full border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25] text-[#77746C] dark:text-[#A8A49A] hover:text-[#242421] dark:hover:text-white hover:bg-[#F8F6F0] dark:hover:bg-[#343630] transition-colors cursor-pointer shrink-0 shadow-2xs"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#E5C365]" />
          ) : (
            <Moon className="w-4 h-4 text-[#6F806A]" />
          )}
        </button>

        {/* Add Task Button */}
        <button
          id="header-add-task-btn"
          type="button"
          onClick={() => openAddTaskModal()}
          className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#6F806A] text-white text-xs sm:text-sm font-medium hover:bg-[#5A6956] shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden xs:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
};
