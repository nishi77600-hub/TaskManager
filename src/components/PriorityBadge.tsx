import React from 'react';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'High':
      return (
        <span
          id={`priority-badge-${priority.toLowerCase()}`}
          className="text-[10px] text-[#B97962] font-semibold uppercase tracking-wider italic"
        >
          High
        </span>
      );
    case 'Medium':
      return (
        <span
          id={`priority-badge-${priority.toLowerCase()}`}
          className="text-[10px] text-[#BFA84F] dark:text-[#E5D89F] font-semibold uppercase tracking-wider italic"
        >
          Medium
        </span>
      );
    case 'Low':
      return (
        <span
          id={`priority-badge-${priority.toLowerCase()}`}
          className="text-[10px] text-[#6F806A] dark:text-[#A8BAA3] font-semibold uppercase tracking-wider italic"
        >
          Low
        </span>
      );
    default:
      return null;
  }
};

