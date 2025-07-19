import * as React from 'react';
import { Button } from '@/components/ui/button';
import { emojiCategories } from '@/lib/emoji-data';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  isPiPMode: boolean;
}

export function CategoryFilter({ selectedCategory, onCategoryChange, isPiPMode }: CategoryFilterProps) {
  return (
    <div className={`flex gap-1 overflow-x-auto pb-2 ${isPiPMode ? 'scrollbar-none' : ''}`}>
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className={`flex-shrink-0 ${isPiPMode ? 'text-xs px-2 h-7' : 'text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8'}`}
      >
        All
      </Button>
      {emojiCategories.map((category) => (
        <Button
          key={category.name}
          variant={selectedCategory === category.name ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.name)}
          className={`flex-shrink-0 ${isPiPMode ? 'text-xs px-2 h-7' : 'text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8'}`}
        >
          {category.name.split(' ')[0]}
        </Button>
      ))}
    </div>
  );
}
