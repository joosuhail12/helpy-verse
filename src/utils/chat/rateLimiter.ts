
interface RateLimiterOptions {
  maxAttempts: number;      // Maximum number of attempts in the time window
  timeWindow: number;       // Time window in milliseconds
  resetAfter?: number;      // Optional: Full reset after this many milliseconds
}

export function useRateLimiter(options: RateLimiterOptions) {
  const attempts: number[] = [];
  let isLimitedFlag = false;
  let resetTimeout: number | null = null;

  const { maxAttempts, timeWindow, resetAfter } = options;

  /**
   * Register an action and check if rate limit is exceeded
   */
  const checkAction = (): boolean => {
    const now = Date.now();
    
    // Remove attempts outside the time window
    const validAttempts = attempts.filter(timestamp => now - timestamp < timeWindow);
    attempts.length = 0;
    attempts.push(...validAttempts);
    
    // Add current attempt
    attempts.push(now);
    
    // Check if limit exceeded
    if (attempts.length > maxAttempts) {
      isLimitedFlag = true;
      
      // Set timeout to reset the limited flag after resetAfter ms (if provided)
      if (resetAfter && !resetTimeout) {
        resetTimeout = window.setTimeout(() => {
          reset();
        }, resetAfter);
      }
      
      return false;
    }
    
    return true;
  };

  /**
   * Check if currently rate limited
   */
  const isLimited = (): boolean => {
    const now = Date.now();
    
    // If we're not in limited state, return false immediately
    if (!isLimitedFlag) return false;
    
    // If in limited state, check if we should exit it
    // This happens when the oldest attempt is now outside the time window
    // AND we have fewer than maxAttempts in the time window
    
    // Remove attempts outside the time window
    const validAttempts = attempts.filter(timestamp => now - timestamp < timeWindow);
    
    if (validAttempts.length < maxAttempts) {
      isLimitedFlag = false;
      
      // Clear any reset timeout
      if (resetTimeout) {
        clearTimeout(resetTimeout);
        resetTimeout = null;
      }
      
      // Update our attempts array
      attempts.length = 0;
      attempts.push(...validAttempts);
      
      return false;
    }
    
    return true;
  };

  /**
   * Get remaining time until rate limit clears
   */
  const getRateLimitTimeRemaining = (): number => {
    if (!isLimitedFlag || attempts.length === 0) return 0;
    
    const now = Date.now();
    const oldestAttempt = attempts[0];
    
    // Calculate when the oldest attempt will exit the time window
    return Math.max(0, timeWindow - (now - oldestAttempt));
  };

  /**
   * Reset the rate limiter
   */
  const reset = (): void => {
    attempts.length = 0;
    isLimitedFlag = false;
    
    if (resetTimeout) {
      clearTimeout(resetTimeout);
      resetTimeout = null;
    }
  };

  return {
    checkAction,
    isLimited,
    getRateLimitTimeRemaining,
    reset
  };
}

export default useRateLimiter;
