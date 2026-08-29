import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Task, Priority, NavigationTab, SortField, SortOrder, TaskStatistics, ToastNotification, ThemeMode, DateFormatStyle, SubTask } from '../types';
import { INITIAL_TASKS } from '../data/initialTasks';
import { isOverdue } from '../utils/dateUtils';
import { soundFx } from '../utils/soundUtils';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText?: string;
  onConfirm: () => void;
}

interface FocusTimerState {
  isActive: boolean;
  isPaused: boolean;
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
  focusedTaskId: string | null;
}

interface TaskContextType {
  tasks: Task[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPriority: Priority | 'all';
  setSelectedPriority: (p: Priority | 'all') => void;
  statusFilter: 'all' | 'pending' | 'completed';
  setStatusFilter: (s: 'all' | 'pending' | 'completed') => void;
  sortBy: SortField;
  setSortBy: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  
  // Modals & Dialogs
  isTaskModalOpen: boolean;
  openAddTaskModal: (prefillCategory?: string, prefillPriority?: Priority) => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
  editingTask: Task | null;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  confirmDialog: ConfirmDialogState | null;
  openConfirmDialog: (config: Omit<ConfirmDialogState, 'isOpen'>) => void;
  closeConfirmDialog: () => void;
  
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'info' | 'success' | 'delete', undoAction?: () => void) => void;
  dismissToast: () => void;

  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  soundEnabled: boolean;
  toggleSound: () => void;

  dateFormat: DateFormatStyle;
  setDateFormat: (format: DateFormatStyle) => void;

  // Batch Selection
  selectedTaskIds: string[];
  toggleTaskSelection: (id: string) => void;
  selectAllVisibleTasks: () => void;
  clearSelection: () => void;
  batchComplete: () => void;
  batchDelete: () => void;
  batchSetPriority: (priority: Priority) => void;
  batchSetCategory: (category: string) => void;

  // Focus / Pomodoro Timer
  focusTimer: FocusTimerState;
  startFocusTimer: (taskId?: string, minutes?: number) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  resetFocusTimer: () => void;

  // Operations
  addTask: (data: {
    title: string;
    category: string;
    priority: Priority;
    dueDate: string;
    notes?: string;
    subtasks?: SubTask[];
    tags?: string[];
    estimatedMinutes?: number;
  }) => Task;
  editTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  toggleComplete: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (id: string) => void;
  undoLastDelete: () => void;
  clearAllTasks: () => void;
  resetToDemoData: () => void;
  triggerCelebration: () => void;

  // Calculated Stats
  stats: TaskStatistics;
  filteredTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'taskmanager_tasks_v2';
const THEME_KEY = 'taskmanager_theme_mode_v2';
const DATE_FORMAT_KEY = 'taskmanager_date_format_v2';
const SOUND_KEY = 'taskmanager_sound_enabled_v2';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Tasks state with local persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_TASKS;
  });

  const [lastDeleted, setLastDeleted] = useState<{ task: Task; index: number } | null>(null);

  // 2. Navigation & filter states
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // 3. Modals & Dialogs
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // 4. Batch selection
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // 5. Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_KEY);
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    soundFx.enabled = soundEnabled;
    try {
      localStorage.setItem(SOUND_KEY, String(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // 6. Day / Night Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  // 7. Date format preference
  const [dateFormat, setDateFormatState] = useState<DateFormatStyle>(() => {
    try {
      const saved = localStorage.getItem(DATE_FORMAT_KEY) as DateFormatStyle;
      if (saved === 'editorial' || saved === 'dd-mm-yyyy' || saved === 'yyyy-mm-dd' || saved === 'mm-dd-yyyy') {
        return saved;
      }
    } catch {}
    return 'editorial';
  });

  // 8. Focus / Pomodoro Timer State
  const [focusTimer, setFocusTimer] = useState<FocusTimerState>({
    isActive: false,
    isPaused: false,
    timeLeft: 25 * 60,
    totalDuration: 25 * 60,
    focusedTaskId: null,
  });

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusTimer.isActive && !focusTimer.isPaused && focusTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimer(prev => {
          if (prev.timeLeft <= 1) {
            soundFx.playTimerFinish();
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 },
            });
            return { ...prev, timeLeft: 0, isActive: false };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isActive, focusTimer.isPaused, focusTimer.timeLeft]);

  const startFocusTimer = useCallback((taskId?: string, minutes: number = 25) => {
    soundFx.playPop();
    const duration = minutes * 60;
    setFocusTimer({
      isActive: true,
      isPaused: false,
      timeLeft: duration,
      totalDuration: duration,
      focusedTaskId: taskId || null,
    });
  }, []);

  const pauseFocusTimer = useCallback(() => {
    soundFx.playPop();
    setFocusTimer(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeFocusTimer = useCallback(() => {
    soundFx.playPop();
    setFocusTimer(prev => ({ ...prev, isPaused: false }));
  }, []);

  const resetFocusTimer = useCallback(() => {
    soundFx.playPop();
    setFocusTimer(prev => ({
      isActive: false,
      isPaused: false,
      timeLeft: prev.totalDuration,
      focusedTaskId: null,
    }));
  }, []);

  // Theme synchronization
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {
      console.error('Failed to sync theme', e);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    soundFx.playPop();
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setDateFormat = useCallback((format: DateFormatStyle) => {
    setDateFormatState(format);
    try {
      localStorage.setItem(DATE_FORMAT_KEY, format);
    } catch {}
  }, []);

  // Tasks local storage sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  const triggerCelebration = useCallback(() => {
    soundFx.playCelebration();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6F806A', '#BFA84F', '#B97962', '#5B7582', '#A8BAA3'],
    });
  }, []);

  const showToast = useCallback((
    message: string, 
    type: 'info' | 'success' | 'delete' = 'info', 
    undoAction?: () => void
  ) => {
    const id = Date.now().toString();
    setToast({ id, message, type, undoAction });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, N for new task)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundFx.playPop();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'n' && !isTaskModalOpen && !isCommandPaletteOpen) {
        e.preventDefault();
        soundFx.playPop();
        setEditingTask(null);
        setIsTaskModalOpen(true);
      } else if (e.key === '?' && !isTaskModalOpen) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, isCommandPaletteOpen]);

  const openAddTaskModal = useCallback((prefillCategory?: string, prefillPriority?: Priority) => {
    soundFx.playPop();
    setEditingTask(null);
    if (prefillCategory) setSelectedCategory(prefillCategory);
    if (prefillPriority) setSelectedPriority(prefillPriority);
    setIsTaskModalOpen(true);
  }, []);

  const openEditTaskModal = useCallback((task: Task) => {
    soundFx.playPop();
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const openConfirmDialog = useCallback((config: Omit<ConfirmDialogState, 'isOpen'>) => {
    soundFx.playPop();
    setConfirmDialog({ ...config, isOpen: true });
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  // Task Operations
  const addTask = useCallback((data: {
    title: string;
    category: string;
    priority: Priority;
    dueDate: string;
    notes?: string;
    subtasks?: SubTask[];
    tags?: string[];
    estimatedMinutes?: number;
  }): Task => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: data.title.trim(),
      category: data.category || 'Other',
      priority: data.priority,
      dueDate: data.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      notes: data.notes?.trim() || undefined,
      subtasks: data.subtasks || [],
      tags: data.tags || [],
      estimatedMinutes: data.estimatedMinutes || undefined,
    };

    soundFx.playPop();
    setTasks(prev => [newTask, ...prev]);
    showToast(`Added task "${newTask.title}"`, 'success');
    return newTask;
  }, [showToast]);

  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            ...updates,
            title: updates.title !== undefined ? updates.title.trim() : task.title,
          };
        }
        return task;
      })
    );
    soundFx.playPop();
    showToast('Task updated successfully', 'success');
  }, [showToast]);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextState = !task.completed;
          soundFx.playToggle(nextState);

          if (nextState) {
            if (task.priority === 'High') {
              confetti({
                particleCount: 50,
                spread: 50,
                origin: { y: 0.7 },
              });
            }
          }

          showToast(
            nextState ? `Completed "${task.title}"` : `Marked "${task.title}" as pending`,
            'info'
          );
          return { ...task, completed: nextState };
        }
        return task;
      })
    );
  }, [showToast]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId && task.subtasks) {
          const updatedSubtasks = task.subtasks.map(st => {
            if (st.id === subtaskId) {
              soundFx.playToggle(!st.completed);
              return { ...st, completed: !st.completed };
            }
            return st;
          });
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;
      const target = prev[index];
      setLastDeleted({ task: target, index });

      const newTasks = prev.filter(t => t.id !== id);
      soundFx.playPop();
      showToast(
        `Deleted "${target.title}"`,
        'delete',
        () => {
          setTasks(current => {
            const restored = [...current];
            restored.splice(index, 0, target);
            return restored;
          });
          showToast(`Restored "${target.title}"`, 'success');
        }
      );
      return newTasks;
    });
    setSelectedTaskIds(prev => prev.filter(tid => tid !== id));
  }, [showToast]);

  const undoLastDelete = useCallback(() => {
    if (!lastDeleted) return;
    const { task, index } = lastDeleted;
    setTasks(prev => {
      const restored = [...prev];
      restored.splice(index, 0, task);
      return restored;
    });
    setLastDeleted(null);
    soundFx.playPop();
    showToast(`Restored "${task.title}"`, 'success');
  }, [lastDeleted, showToast]);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    setSelectedTaskIds([]);
    soundFx.playPop();
    showToast('All tasks cleared from workspace', 'info');
  }, [showToast]);

  const resetToDemoData = useCallback(() => {
    setTasks(INITIAL_TASKS);
    setSelectedTaskIds([]);
    soundFx.playCelebration();
    showToast('Reset to default curated tasks', 'success');
  }, [showToast]);

  // Batch Selection Handlers
  const toggleTaskSelection = useCallback((id: string) => {
    soundFx.playPop();
    setSelectedTaskIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTaskIds([]);
  }, []);

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo<Task[]>(() => {
    return tasks.filter(task => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesCategory = task.category.toLowerCase().includes(q);
        const matchesNotes = task.notes ? task.notes.toLowerCase().includes(q) : false;
        const matchesTags = task.tags ? task.tags.some(tag => tag.toLowerCase().includes(q)) : false;
        if (!matchesTitle && !matchesCategory && !matchesNotes && !matchesTags) return false;
      }

      // 2. Status filter
      if (activeTab === 'pending' && task.completed) return false;
      if (activeTab === 'completed' && !task.completed) return false;
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // 3. Category Filter
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }

      // 4. Priority Filter
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        comparison = a.dueDate.localeCompare(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityWeight = { High: 3, Medium: 2, Low: 1 };
        comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        comparison = a.createdAt.localeCompare(b.createdAt);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, searchQuery, activeTab, statusFilter, selectedCategory, selectedPriority, sortBy, sortOrder]);

  const selectAllVisibleTasks = useCallback(() => {
    soundFx.playPop();
    const visibleIds = filteredTasks.map(t => t.id);
    setSelectedTaskIds(prev => (prev.length === visibleIds.length ? [] : visibleIds));
  }, [filteredTasks]);

  const batchComplete = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev =>
      prev.map(t => (selectedTaskIds.includes(t.id) ? { ...t, completed: true } : t))
    );
    soundFx.playCelebration();
    showToast(`Marked ${selectedTaskIds.length} tasks as completed`, 'success');
    setSelectedTaskIds([]);
  }, [selectedTaskIds, showToast]);

  const batchDelete = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    openConfirmDialog({
      title: `Delete ${selectedTaskIds.length} selected tasks?`,
      message: 'These tasks will be removed from your workspace.',
      confirmButtonText: 'Delete Selected',
      onConfirm: () => {
        setTasks(prev => prev.filter(t => !selectedTaskIds.includes(t.id)));
        showToast(`Deleted ${selectedTaskIds.length} tasks`, 'info');
        setSelectedTaskIds([]);
      },
    });
  }, [selectedTaskIds, openConfirmDialog, showToast]);

  const batchSetPriority = useCallback((priority: Priority) => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev =>
      prev.map(t => (selectedTaskIds.includes(t.id) ? { ...t, priority } : t))
    );
    soundFx.playPop();
    showToast(`Set priority of ${selectedTaskIds.length} tasks to ${priority}`, 'success');
    setSelectedTaskIds([]);
  }, [selectedTaskIds, showToast]);

  const batchSetCategory = useCallback((category: string) => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev =>
      prev.map(t => (selectedTaskIds.includes(t.id) ? { ...t, category } : t))
    );
    soundFx.playPop();
    showToast(`Moved ${selectedTaskIds.length} tasks to ${category}`, 'success');
    setSelectedTaskIds([]);
  }, [selectedTaskIds, showToast]);

  // Derived Statistics Calculation
  const stats = useMemo<TaskStatistics>(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const overdueCount = tasks.filter(t => isOverdue(t.dueDate, t.completed)).length;
    const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'High').length;

    // Completed today count
    const todayStr = new Date().toISOString().split('T')[0];
    const completedTodayCount = tasks.filter(t => t.completed && t.dueDate === todayStr).length;

    // Category Breakdown
    const categoryMap: Record<string, { count: number; completedCount: number }> = {};
    tasks.forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { count: 0, completedCount: 0 };
      }
      categoryMap[t.category].count += 1;
      if (t.completed) categoryMap[t.category].completedCount += 1;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      completedCount: data.completedCount,
    }));

    // Priority Breakdown
    const priorities: Priority[] = ['High', 'Medium', 'Low'];
    const priorityBreakdown = priorities.map(priority => {
      const pTasks = tasks.filter(t => t.priority === priority);
      return {
        priority,
        total: pTasks.length,
        pending: pTasks.filter(t => !t.completed).length,
        completed: pTasks.filter(t => t.completed).length,
      };
    });

    const streakDays = completed > 0 ? Math.min(completed + 2, 7) : 1;

    return {
      total,
      completed,
      pending,
      completionRate,
      overdueCount,
      highPriorityPending,
      completedTodayCount,
      streakDays,
      categoryBreakdown,
      priorityBreakdown,
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPriority,
        setSelectedPriority,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        isTaskModalOpen,
        openAddTaskModal,
        openEditTaskModal,
        closeTaskModal,
        editingTask,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        confirmDialog,
        openConfirmDialog,
        closeConfirmDialog,
        toast,
        showToast,
        dismissToast,
        theme,
        setTheme,
        toggleTheme,
        soundEnabled,
        toggleSound,
        dateFormat,
        setDateFormat,
        selectedTaskIds,
        toggleTaskSelection,
        selectAllVisibleTasks,
        clearSelection,
        batchComplete,
        batchDelete,
        batchSetPriority,
        batchSetCategory,
        focusTimer,
        startFocusTimer,
        pauseFocusTimer,
        resumeFocusTimer,
        resetFocusTimer,
        addTask,
        editTask,
        toggleComplete,
        toggleSubtask,
        deleteTask,
        undoLastDelete,
        clearAllTasks,
        resetToDemoData,
        triggerCelebration,
        stats,
        filteredTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskManager = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskManager must be used within a TaskProvider');
  }
  return context;
};
