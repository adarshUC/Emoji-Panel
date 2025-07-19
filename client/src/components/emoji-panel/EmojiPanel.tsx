import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmojiGrid } from './EmojiGrid';
import { EmojiSearch } from './EmojiSearch';
import { CategoryFilter } from './CategoryFilter';
import { PiPToggle } from './PiPToggle';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useCookieStorage } from '@/hooks/useCookieStorage';
import { usePiP } from '@/hooks/usePiP';
import { Copy, Type } from 'lucide-react';

export function EmojiPanel() {
  const { value: textInput, setValue: setTextInput, isLoaded } = useCookieStorage('emoji-panel-text', '');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const { copyToClipboard, copied } = useCopyToClipboard();
  const { isPiPSupported, isPiPActive, startPiP, stopPiP, getPopupText } = usePiP();

  const handleCopyText = () => {
    if (textInput.trim()) {
      copyToClipboard(textInput);
    }
  };

  const handleEmojiInsert = (emoji: string) => {
    setTextInput(textInput + emoji);
  };

  const handlePiPToggle = async () => {
    if (isPiPActive) {
      // Get text from popup before closing
      const popupText = getPopupText();
      if (popupText) {
        setTextInput(popupText);
      }
      await stopPiP();
    } else {
      const success = await startPiP();
      if (!success) {
        console.log('Failed to start PiP mode');
      }
    }
  };

  // Listen for text updates from popup
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TEXT_UPDATE') {
        setTextInput(event.data.text);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setTextInput]);

  // Don't render until cookie data is loaded
  if (!isLoaded) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-9 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg font-semibold">Emoji Panel</CardTitle>
        <div className="flex items-center gap-2">
          {isPiPSupported && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {isPiPActive ? 'Popup Active' : 'Popup Available'}
            </span>
          )}
          <PiPToggle 
            isPiPMode={isPiPActive} 
            isPiPSupported={isPiPSupported}
            onToggle={handlePiPToggle} 
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input" className="text-xs sm:text-sm font-medium">
            Custom Text
          </Label>
          <div className="flex gap-2">
            <Input
              id="text-input"
              placeholder="Enter text or click emojis..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 emoji-font text-sm sm:text-base"
            />
            <Button
              onClick={handleCopyText}
              disabled={!textInput.trim()}
              size="sm"
              className="px-2 sm:px-3"
            >
              {copied ? (
                <Type className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Left click emoji to insert • Right click emoji to copy • Data saved automatically
            {isPiPSupported && (
              <span className="hidden sm:inline"> • Click popup button to open in separate window</span>
            )}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium">Search & Filter</Label>
          <EmojiSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
          />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isPiPMode={false}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium">Emoji Collection</Label>
          <EmojiGrid 
            isPiPMode={false} 
            onEmojiInsert={handleEmojiInsert}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
          />
        </div>
      </CardContent>
    </Card>
  );
}
