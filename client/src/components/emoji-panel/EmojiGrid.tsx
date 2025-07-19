import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { emojiCategories } from '@/lib/emoji-data';

interface EmojiGridProps {
  isPiPMode: boolean;
  onEmojiInsert: (emoji: string) => void;
  selectedCategory: string | null;
  searchTerm: string;
}

export function EmojiGrid({ isPiPMode, onEmojiInsert, selectedCategory, searchTerm }: EmojiGridProps) {
  const { copyToClipboard } = useCopyToClipboard();

  const handleEmojiClick = (emoji: string) => {
    onEmojiInsert(emoji);
  };

  const handleEmojiRightClick = (e: React.MouseEvent, emoji: string) => {
    e.preventDefault();
    copyToClipboard(emoji);
  };

  // Filter categories and emojis based on selection and search
  const filteredCategories = React.useMemo(() => {
    let categories = emojiCategories;

    // Filter by selected category
    if (selectedCategory) {
      categories = categories.filter(category => category.name === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      categories = categories.map(category => ({
        ...category,
        emojis: category.emojis.filter(emoji => {
          // Simple search - you could enhance this with emoji names/descriptions
          const searchLower = searchTerm.toLowerCase();
          return emoji.includes(searchTerm) || 
                 category.name.toLowerCase().includes(searchLower);
        })
      })).filter(category => category.emojis.length > 0);
    }

    return categories;
  }, [selectedCategory, searchTerm]);

  // Calculate grid columns based on screen size and mode
  const getGridCols = () => {
    if (isPiPMode) {
      return 'grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8';
    }
    return 'grid-cols-6 xs:grid-cols-7 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12';
  };

  if (filteredCategories.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        <p className="text-sm">No emojis found</p>
      </div>
    );
  }

  return (
    <div className={`${isPiPMode ? 'max-h-[45vh] sm:max-h-[55vh]' : 'max-h-[35vh] sm:max-h-[45vh] lg:max-h-[55vh]'} overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>
      {filteredCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          {!isPiPMode && !searchTerm && (
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground px-1">
              {category.name}
            </h3>
          )}
          <div className={`grid ${getGridCols()} gap-1`}>
            {category.emojis.map((emoji, index) => (
              <Button
                key={`${category.name}-${index}`}
                variant="ghost"
                size="sm"
                className="emoji-font h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 hover:bg-accent text-sm sm:text-base md:text-lg rounded-md"
                onClick={() => handleEmojiClick(emoji)}
                onContextMenu={(e) => handleEmojiRightClick(e, emoji)}
                title={`${emoji}`}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
