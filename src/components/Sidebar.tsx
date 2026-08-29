import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  CheckCircle2,
  FolderKanban,
  AlertTriangle,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Command,
} from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { NavigationTab } from '../types';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    stats,
    theme,
    toggleTheme,
    setIsCommandPaletteOpen,
  } = useTaskManager();

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const navSections: {
    group: string;
    items: {
      id: NavigationTab;
      label: string;
      icon: React.ReactNode;
      badge?: number | string;
      badgeVariant?: 'sage' | 'terracotta' | 'neutral' | 'gold';
    }[];
  }[] = [
    {
      group: 'Workspace',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          id: 'all',
          label: 'All Tasks',
          icon: <CheckSquare className="w-4 h-4" />,
          badge: stats.total,
          badgeVariant: 'neutral',
        },
        {
          id: 'pending',
          label: 'Pending',
          icon: <Clock className="w-4 h-4" />,
          badge: stats.pending > 0 ? stats.pending : undefined,
          badgeVariant: 'sage',
        },
        {
          id: 'completed',
          label: 'Completed',
          icon: <CheckCircle2 className="w-4 h-4" />,
          badge: stats.completed > 0 ? stats.completed : undefined,
          badgeVariant: 'neutral',
        },
      ],
    },
    {
      group: 'Organization',
      items: [
        {
          id: 'categories',
          label: 'Categories',
          icon: <FolderKanban className="w-4 h-4" />,
        },
        {
          id: 'priorities',
          label: 'Priorities',
          icon: <AlertTriangle className="w-4 h-4" />,
          badge: stats.highPriorityPending > 0 ? `${stats.highPriorityPending} High` : undefined,
          badgeVariant: 'terracotta',
        },
      ],
    },
    {
      group: 'Insights',
      items: [
        {
          id: 'statistics',
          label: 'Statistics',
          icon: <BarChart3 className="w-4 h-4" />,
          badge: `${stats.completionRate}%`,
          badgeVariant: 'gold',
        },
      ],
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 flex flex-col justify-between bg-[#1E201B] dark:bg-[#181916] text-[#A8A49A] border-r border-[#2D3028] transition-transform duration-200 ease-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Top Brand & Quick launcher */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 sm:p-6 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6F806A] to-[#4F604A] flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs">
              T
            </div>
            <div>
              <h1 className="text-white text-base font-serif font-bold tracking-tight leading-none">
                Task Manager
              </h1>
              <p className="text-[10px] uppercase tracking-wider mt-1 text-[#8E8B83] font-mono">
                Smart Task System
              </p>
            </div>
          </div>

          {/* Quick Command Launcher */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="mt-4 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-[#A8A49A] hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-[#6F806A]" />
              <span>Quick Actions...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="px-3.5 space-y-5 pt-1" aria-label="Main Navigation">
          {navSections.map(section => (
            <div key={section.group} className="space-y-1">
              <p className="px-3 text-[10px] uppercase tracking-widest text-[#706E66] font-semibold">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-xl transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#6F806A] text-white font-medium shadow-xs'
                          : 'text-[#A8A49A] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`transition-colors ${isActive ? 'text-white' : 'text-[#8E8B83]'}`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeVariant === 'terracotta'
                              ? 'bg-[#B97962]/20 text-[#E49E86]'
                              : item.badgeVariant === 'sage'
                              ? 'bg-[#6F806A]/25 text-[#B9CCB5]'
                              : item.badgeVariant === 'gold'
                              ? 'bg-[#BFA84F]/20 text-[#E2CF7C]'
                              : 'bg-white/10 text-[#A8A49A]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Settings & Theme */}
      <div className="p-3.5 border-t border-white/10 bg-[#171815] space-y-1.5">
        <button
          id="nav-item-settings"
          type="button"
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#6F806A] text-white font-medium shadow-xs'
              : 'text-[#A8A49A] hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-[#8E8B83]" />
            <span>Settings</span>
          </div>
        </button>

        <button
          id="sidebar-theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Day mode' : 'Switch to Night mode'}
          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-[#A8A49A] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#E5C365]" />
            ) : (
              <Moon className="w-4 h-4 text-[#6F806A]" />
            )}
            <span>{theme === 'dark' ? 'Day Mode' : 'Night Mode'}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>
      </div>
    </aside>
  );
};
