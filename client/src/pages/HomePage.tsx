import * as React from 'react';
import { EmojiPanel } from '@/components/emoji-panel/EmojiPanel';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center sm:text-left">
          Emoji Panel
        </h1>
        <EmojiPanel />
      </div>
    </div>
  );
}
