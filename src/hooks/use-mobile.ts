
import { useState, useEffect } from 'react';

/**
 * Hook to determine if the current device is mobile based on a media query
 * @param query The media query to check against (default: '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string = '(max-width: 768px)'): boolean => {
  const [matches, setMatches] = useState<boolean>(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    } 
    // Legacy support for older browsers
    else if ('addListener' in mediaQueryList) {
      // @ts-ignore - For older browsers that don't support addEventListener
      mediaQueryList.addListener(listener);
      return () => {
        // @ts-ignore - For older browsers
        mediaQueryList.removeListener(listener);
      };
    }
  }, [query]);

  return matches;
};

/**
 * Hook to determine if the current device is mobile
 * @returns Boolean indicating if the device is mobile
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)');
};
