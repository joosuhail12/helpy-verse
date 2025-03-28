
/**
 * Rate limiter utility for chat operations
 */

export interface RateLimiter {
  checkAction: () => boolean;
  checkRateLimit: () => boolean;
  getRateLimitTimeRemaining: () => number;
  resetRateLimit: () => void;
  setLimitDuration: (duration: number) => void;
}

export function useRateLimiter(
  maxAttempts: number = 5,
  timeWindow: number = 10000,  // 10 seconds
  resetAfter: number = 30000   // 30 seconds
): RateLimiter {
  // Store attempts in an array to track their timestamps
  let attempts: number[] = [];
  let limitUntil: number = 0;
  let limitDuration: number = resetAfter;
  
  /**
   * Record an action and check if it's allowed
   */
  const checkAction = (): boolean => {
    const now = Date.now();
    
    // If we're still in the rate limit period, block the action
    if (limitUntil > now) {
      return false;
    }
    
    // Clean out old attempts
    attempts = attempts.filter(timestamp => now - timestamp < timeWindow);
    
    // Register the new attempt
    attempts.push(now);
    
    // Check if we've hit the max attempts
    if (attempts.length > maxAttempts) {
      limitUntil = now + limitDuration;
      return false;
    }
    
    return true;
  };
  
  /**
   * Check if rate limit is currently active
   */
  const checkRateLimit = (): boolean => {
    return limitUntil > Date.now();
  };
  
  /**
   * Get remaining time in rate limit in milliseconds
   */
  const getRateLimitTimeRemaining = (): number => {
    const remaining = limitUntil - Date.now();
    return remaining > 0 ? remaining : 0;
  };
  
  /**
   * Reset the rate limiter
   */
  const resetRateLimit = (): void => {
    attempts = [];
    limitUntil = 0;
  };
  
  /**
   * Set the limit duration
   */
  const setLimitDuration = (duration: number): void => {
    limitDuration = duration;
  };
  
  return {
    checkAction,
    checkRateLimit,
    getRateLimitTimeRemaining,
    resetRateLimit,
    setLimitDuration
  };
}

export const createRateLimiter = (
  maxAttempts: number = 5,
  timeWindow: number = 10000,
  resetAfter: number = 30000
): RateLimiter => {
  return useRateLimiter(maxAttempts, timeWindow, resetAfter);
};

export default useRateLimiter;
