import React, { useState } from 'react';
import { TaskProvider, useTaskManager } from './context/TaskContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TaskModal } from './components/TaskModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import { CommandPalette } from './components/CommandPalette';

import { Overview } from './pages/Overview';
import { AllTasks } from './pages/AllTasks';
import { PendingTasks } from './pages/PendingTasks';
import { CompletedTasks } from './pages/CompletedTasks';
import { CategoriesView } from './pages/CategoriesView';
import { PrioritiesView } from './pages/PrioritiesView';
import { StatisticsPage } from './pages/StatisticsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab } = useTaskManager();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'all':
        return <AllTasks />;
      case 'pending':
        return <PendingTasks />;
      case 'completed':
        return <CompletedTasks />;
      case 'categories':
        return <CategoriesView />;
      case 'priorities':
        return <PrioritiesView />;
      case 'statistics':
        return <StatisticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F6F0] dark:bg-[#1C1D1A] text-[#242421] dark:text-[#EDEAE1] transition-colors duration-200 selection:bg-[#6F806A]/20 selection:text-[#3B4638]">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onToggleMobileMenu={() => setMobileSidebarOpen(prev => !prev)} />

        <main id="main-content-workspace" className="flex-1 p-4 sm:p-8 md:p-10 max-w-6xl w-full mx-auto flex flex-col">
          {renderActivePage()}

          <footer className="mt-auto flex flex-col sm:flex-row justify-between items-center py-6 border-t border-[#242421]/5 dark:border-white/5 gap-3 text-xs text-[#77746C] dark:text-[#A8A49A]">
            <p className="font-serif italic">Plan clearly. Focus deeply. Finish what matters.</p>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-medium font-mono">
              <span>Task Manager</span>
              <span>•</span>
              <span>Smart Task Management System</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Modals, Dialogs, Command Palette, and Toasts */}
      <CommandPalette />
      <TaskModal />
      <ConfirmDialog />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
