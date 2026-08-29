import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTaskManager } from '../context/TaskContext';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search tasks...', 
  className = '' 
}) => {
  const { searchQuery, setSearchQuery } = useTaskManager();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // If user presses '/' or Ctrl+F / Cmd+F while not typing in an input
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f')) &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77746C] dark:text-[#A8A49A] pointer-events-none flex items-center justify-center">
        <Search className="w-3.5 h-3.5 text-[#77746C] dark:text-[#A8A49A]" />
      </span>
      <input
        ref={inputRef}
        id="task-search-input"
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white dark:bg-[#282A25] border border-[#77746C]/20 dark:border-white/10 rounded-full py-1.5 pl-8 pr-12 text-xs sm:text-sm text-[#242421] dark:text-[#EDEAE1] placeholder:text-[#88857C] dark:placeholder:text-[#7A7870] focus:outline-none focus:border-[#6F806A] focus:ring-1 focus:ring-[#6F806A]/30 shadow-2xs transition-all"
      />
      {searchQuery ? (
        <button
          id="search-clear-btn"
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 p-0.5 rounded-full text-[#77746C] hover:text-[#242421] dark:text-[#A8A49A] dark:hover:text-[#EDEAE1] transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#242421]/5 dark:bg-white/10 text-[#77746C] dark:text-[#A8A49A] border border-[#242421]/10 dark:border-white/10">
            /
          </kbd>
        </div>
      )}
    </div>
  );
};

