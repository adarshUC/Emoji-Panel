import * as React from 'react';

export function useCookieStorage(key: string, defaultValue: string = '') {
  const [value, setValue] = React.useState<string>(defaultValue);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from cookie on mount
  React.useEffect(() => {
    const getCookie = (name: string): string => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return decodeURIComponent(parts.pop()?.split(';').shift() || '');
      }
      return '';
    };

    const cookieValue = getCookie(key);
    if (cookieValue) {
      setValue(cookieValue);
    }
    setIsLoaded(true);
  }, [key]);

  // Save to cookie whenever value changes
  const setCookieValue = React.useCallback((newValue: string) => {
    setValue(newValue);
    
    // Set cookie with 1 year expiration
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    
    document.cookie = `${key}=${encodeURIComponent(newValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  }, [key]);

  return { value, setValue: setCookieValue, isLoaded };
}
