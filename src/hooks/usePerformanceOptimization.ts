
import { useRef, useMemo, useCallback, DependencyList, useEffect } from 'react';

/**
 * Hook to measure and log component render time
 * @param componentName - Name of the component to track
 */
export const useRenderTime = (componentName: string) => {
  const startTimeRef = useRef<number>(0);
  
  useEffect(() => {
    startTimeRef.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTimeRef.current;
      
      // Only log in development and if it's slower than 5ms
      if (process.env.NODE_ENV === 'development' && renderTime > 5) {
        console.log(`[Render Time] ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};

/**
 * Memoizes an expensive operation and ensures it's only recalculated when dependencies change
 * @param computeFn - Function to memoize
 * @param deps - Dependency array
 * @returns Memoized result
 */
export function useMemoizedValue<T>(computeFn: () => T, deps: DependencyList): T {
  return useMemo(() => {
    const start = performance.now();
    const result = computeFn();
    const end = performance.now();
    
    // Log slow computations in development
    if (process.env.NODE_ENV === 'development' && (end - start) > 5) {
      console.log(`[Slow computation]: ${end - start}ms`);
    }
    
    return result;
  }, deps);
}

/**
 * Creates a debounced version of a function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function useDebounced<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
}

export default {
  useRenderTime,
  useMemoizedValue,
  useDebounced
};
