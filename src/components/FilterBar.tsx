import React from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';
import { Priority, SortField } from '../types';
import { CATEGORIES } from '../data/initialTasks';

export const FilterBar: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    tasks,
  } = useTaskManager();

  // Extract unique categories from actual tasks
  const allCategories = Array.from(
    new Set([...CATEGORIES, ...tasks.map(t => t.category)])
  ).filter(Boolean);

  const hasActiveFilters = selectedCategory !== 'all' || selectedPriority !== 'all';

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriority('all');
  };

  return (
    <div id="filter-bar" className="flex flex-wrap items-center justify-between gap-3 py-2 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-[#77746C] dark:text-[#A8A49A] font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-[#77746C]" />
          <span className="uppercase tracking-wider text-[11px]">Filter:</span>
        </div>

        {/* Category Select */}
        <select
          id="filter-category-select"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 rounded-full border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25] text-[#242421] dark:text-[#EDEAE1] focus:outline-none focus:border-[#6F806A] shadow-2xs cursor-pointer"
        >
          <option value="all">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Priority Select */}
        <select
          id="filter-priority-select"
          value={selectedPriority}
          onChange={e => setSelectedPriority(e.target.value as Priority | 'all')}
          className="px-3 py-1.5 rounded-full border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25] text-[#242421] dark:text-[#EDEAE1] focus:outline-none focus:border-[#6F806A] shadow-2xs cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {hasActiveFilters && (
          <button
            id="filter-clear-all-btn"
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[#B97962] bg-[#B97962]/10 hover:bg-[#B97962]/20 font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Sort Section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-[#77746C] dark:text-[#A8A49A] font-medium">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#77746C]" />
          <span className="uppercase tracking-wider text-[11px]">Sort:</span>
        </div>

        <select
          id="sort-field-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortField)}
          className="px-3 py-1.5 rounded-full border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25] text-[#242421] dark:text-[#EDEAE1] focus:outline-none focus:border-[#6F806A] shadow-2xs cursor-pointer"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title (A-Z)</option>
          <option value="createdAt">Created Date</option>
        </select>

        <button
          id="sort-order-toggle-btn"
          type="button"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          className="px-3 py-1.5 rounded-full border border-[#242421]/10 dark:border-white/10 bg-white dark:bg-[#282A25] text-[#77746C] hover:text-[#242421] dark:hover:text-[#EDEAE1] transition-colors font-mono shadow-2xs cursor-pointer"
        >
          {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>
    </div>
  );
};

