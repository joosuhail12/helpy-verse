
import { memo, useMemo, useCallback } from 'react';
import type { ComponentType, MemoExoticComponent } from 'react';

/**
 * Creates a memoized version of a component to prevent unnecessary re-renders
 * 
 * @param component - The component to memoize
 * @param displayName - Optional display name for the component (helpful for debugging)
 * @returns Memoized component
 */
export function createMemoizedComponent<T extends ComponentType<any>>(
  component: T,
  displayName?: string
): MemoExoticComponent<T> {
  const MemoizedComponent = memo(component);
  
  if (displayName) {
    MemoizedComponent.displayName = `Memo(${displayName})`;
  }
  
  return MemoizedComponent;
}

/**
 * Custom hook to create a stable callback function that only changes when dependencies change
 * 
 * @param callback - The callback function to stabilize
 * @param dependencies - Array of dependencies that should trigger recreation of the callback
 * @returns Memoized callback function
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, dependencies);
}

/**
 * Custom hook to create a memoized value that only recalculates when dependencies change
 * 
 * @param valueFactory - Function that creates the value
 * @param dependencies - Array of dependencies that should trigger recalculation
 * @returns Memoized value
 */
export function useStableValue<T>(
  valueFactory: () => T,
  dependencies: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(valueFactory, dependencies);
}
