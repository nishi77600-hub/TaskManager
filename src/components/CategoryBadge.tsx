import React from 'react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <span
      id={`category-badge-${category.toLowerCase().replace(/\s+/g, '-')}`}
      className="text-[10px] text-[#77746C] dark:text-[#A8A49A] px-2 py-0.5 border border-[#77746C]/30 dark:border-[#77746C]/40 rounded uppercase tracking-wider font-medium"
    >
      {category}
    </span>
  );
};

