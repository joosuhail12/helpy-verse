
import { useEffect, useState } from 'react';

/**
 * Custom hook to check if the current viewport matches a given media query
 * @param query Media query string to match against
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
};

/**
 * Hook to determine if the current viewport is mobile-sized
 * @returns Boolean indicating if the viewport is mobile-sized
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)');
};

/**
 * Hook to detect touch devices
 * @returns Boolean indicating if the device supports touch
 */
export const useTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const checkTouch = () => {
      return 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;
    };
    
    setIsTouch(checkTouch());
  }, []);
  
  return isTouch;
};

/**
 * Hook to get the current viewport dimensions
 * @returns Object containing viewport width and height
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return viewport;
};
