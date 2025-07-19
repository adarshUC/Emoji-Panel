import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';

interface PiPToggleProps {
  isPiPMode: boolean;
  isPiPSupported: boolean;
  onToggle: () => void;
}

export function PiPToggle({ isPiPMode, isPiPSupported, onToggle }: PiPToggleProps) {
  if (!isPiPSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="h-8 w-8 p-0"
      title={isPiPMode ? "Close popup window" : "Open emoji panel in popup window"}
    >
      {isPiPMode ? (
        <X className="h-4 w-4" />
      ) : (
        <ExternalLink className="h-4 w-4" />
      )}
    </Button>
  );
}
