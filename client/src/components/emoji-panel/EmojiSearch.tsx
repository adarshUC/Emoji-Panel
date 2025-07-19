import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmojiSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function EmojiSearch({ searchTerm, onSearchChange }: EmojiSearchProps) {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
      <Input
        placeholder="Search emojis..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-7 sm:pl-8 pr-8 h-8 sm:h-9 text-sm"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
