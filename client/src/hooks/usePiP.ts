import * as React from 'react';

export function usePiP() {
  const [isPiPSupported] = React.useState(true); // Always supported since we use popup
  const [isPiPActive, setIsPiPActive] = React.useState(false);
  const popupWindowRef = React.useRef<Window | null>(null);
  const textSyncRef = React.useRef<string>('');

  const checkPopupClosed = React.useCallback(() => {
    if (popupWindowRef.current?.closed) {
      setIsPiPActive(false);
      popupWindowRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    let interval: number;
    if (isPiPActive && popupWindowRef.current) {
      interval = window.setInterval(checkPopupClosed, 500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPiPActive, checkPopupClosed]);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'TEXT_UPDATE') {
        textSyncRef.current = event.data.text;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const startPiP = React.useCallback(async () => {
    try {
      // Calculate responsive popup size
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      
      let width = 400;
      let height = 600;
      
      // Adjust for smaller screens
      if (screenWidth < 768) {
        width = Math.min(350, screenWidth * 0.9);
        height = Math.min(500, screenHeight * 0.8);
      } else if (screenWidth < 1024) {
        width = 450;
        height = 650;
      } else {
        width = 500;
        height = 700;
      }
      
      const left = (screenWidth - width) / 2;
      const top = (screenHeight - height) / 2;

      const popup = window.open(
        '/emoji',
        'emojiPanel',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no`
      );

      if (popup) {
        popupWindowRef.current = popup;
        setIsPiPActive(true);
        
        // Focus the popup
        popup.focus();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to open popup:', error);
      return false;
    }
  }, []);

  const stopPiP = React.useCallback(async () => {
    if (popupWindowRef.current && !popupWindowRef.current.closed) {
      popupWindowRef.current.close();
    }
    setIsPiPActive(false);
    popupWindowRef.current = null;
  }, []);

  const getPopupText = React.useCallback((): string => {
    return textSyncRef.current;
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (popupWindowRef.current && !popupWindowRef.current.closed) {
        popupWindowRef.current.close();
      }
    };
  }, []);

  return {
    isPiPSupported,
    isPiPActive,
    startPiP,
    stopPiP,
    getPopupText,
    // Legacy props for compatibility
    canvasRef: React.useRef<HTMLCanvasElement>(null),
    videoRef: React.useRef<HTMLVideoElement>(null)
  };
}
