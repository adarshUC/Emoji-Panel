import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmojiGrid } from './EmojiGrid';
import { EmojiSearch } from './EmojiSearch';
import { CategoryFilter } from './CategoryFilter';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useCookieStorage } from '@/hooks/useCookieStorage';
import { Copy, Type, X } from 'lucide-react';

export function EmojiPanelPopup() {
  const { value: textInput, setValue: setTextInput, isLoaded } = useCookieStorage('emoji-panel-text', '');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const { copyToClipboard, copied } = useCopyToClipboard();

  const handleCopyText = () => {
    if (textInput.trim()) {
      copyToClipboard(textInput);
    }
  };

  const handleEmojiInsert = (emoji: string) => {
    setTextInput(textInput + emoji);
  };

  const handleClose = () => {
    window.close();
  };

  React.useEffect(() => {
    // Listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'EMOJI_INSERT') {
        handleEmojiInsert(event.data.emoji);
      } else if (event.data.type === 'GET_TEXT') {
        event.source?.postMessage({
          type: 'TEXT_RESPONSE',
          text: textInput
        }, event.origin);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [textInput]);

  // Send text updates to parent window
  React.useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({
        type: 'TEXT_UPDATE',
        text: textInput
      }, window.location.origin);
    }
  }, [textInput]);

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background p-2 sm:p-3">
      {/* Close button */}
      <div className="flex justify-end mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-6 w-6 sm:h-8 sm:w-8 p-0"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
      
      {/* Text input */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Click emojis..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="flex-1 emoji-font text-sm sm:text-base h-8 sm:h-9"
        />
        <Button
          onClick={handleCopyText}
          disabled={!textInput.trim()}
          size="sm"
          className="px-2 sm:px-3 h-8 sm:h-9"
        >
          {copied ? (
            <Type className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
      </div>
      
      {/* Search and filter */}
      <div className="space-y-2 mb-3">
        <EmojiSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isPiPMode={true}
        />
      </div>
      
      {/* Emoji grid */}
      <div className="flex-1 overflow-hidden">
        <EmojiGrid 
          isPiPMode={true} 
          onEmojiInsert={handleEmojiInsert}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}
