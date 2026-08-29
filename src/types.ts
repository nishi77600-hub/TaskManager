export type Priority = 'High' | 'Medium' | 'Low';

export type Category = 'College' | 'Study' | 'Work' | 'Personal' | 'Other';

export type ThemeMode = 'light' | 'dark';

export type DateFormatStyle = 'editorial' | 'dd-mm-yyyy' | 'yyyy-mm-dd' | 'mm-dd-yyyy';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  dueDate: string; // ISO date string "YYYY-MM-DD"
  completed: boolean;
  createdAt: string;
  notes?: string;
  subtasks?: SubTask[];
  tags?: string[];
  estimatedMinutes?: number;
}

export type NavigationTab = 
  | 'overview' 
  | 'all' 
  | 'pending' 
  | 'completed' 
  | 'categories' 
  | 'priorities' 
  | 'statistics' 
  | 'settings';

export type SortField = 'dueDate' | 'priority' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  category: string; // 'all' or specific
  priority: Priority | 'all';
  status: 'all' | 'pending' | 'completed';
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface TaskStatistics {
  total: number;
  completed: number;
  pending: number;
  completionRate: number; // percentage integer 0-100
  overdueCount: number;
  highPriorityPending: number;
  completedTodayCount: number;
  streakDays: number;
  categoryBreakdown: { category: string; count: number; completedCount: number }[];
  priorityBreakdown: { priority: Priority; total: number; pending: number; completed: number }[];
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'delete';
  undoAction?: () => void;
}
