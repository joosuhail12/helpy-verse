
/**
 * Rate limiter utility to prevent abuse
 */

export class RateLimiter {
  private actions: number[] = [];
  private maxActions: number;
  private timeWindow: number;
  private isLimited: boolean = false;
  private limitExpiry: number = 0;
  private limitDuration: number = 30000; // 30 seconds default

  constructor(maxActions: number = 10, timeWindow: number = 60000) {
    this.maxActions = maxActions; // Max number of actions in the time window
    this.timeWindow = timeWindow; // Time window in milliseconds
  }

  /**
   * Check if an action is allowed
   * @returns True if action is allowed, false if rate limited
   */
  checkAction(): boolean {
    const now = Date.now();
    
    // Clear expired actions
    this.actions = this.actions.filter(time => time > now - this.timeWindow);
    
    // Check if currently rate limited
    if (this.isLimited) {
      if (now >= this.limitExpiry) {
        // Rate limit has expired
        this.isLimited = false;
        this.actions = [];
      } else {
        // Still rate limited
        return false;
      }
    }
    
    // Add current action
    this.actions.push(now);
    
    // Check if we've exceeded the limit
    if (this.actions.length > this.maxActions) {
      this.isLimited = true;
      this.limitExpiry = now + this.limitDuration;
      return false;
    }
    
    return true;
  }

  /**
   * Get time remaining in rate limit in milliseconds
   */
  getRateLimitTimeRemaining(): number {
    if (!this.isLimited) return 0;
    
    const timeRemaining = Math.max(0, this.limitExpiry - Date.now());
    return timeRemaining;
  }

  /**
   * Set the duration for rate limiting
   * @param duration Duration in milliseconds
   */
  setLimitDuration(duration: number): void {
    this.limitDuration = duration;
  }

  /**
   * Clear the rate limit
   */
  resetRateLimit(): void {
    this.isLimited = false;
    this.actions = [];
  }
}

/**
 * Hook for using rate limiting in components
 */
export const useRateLimiter = (maxActions: number = 10, timeWindow: number = 60000) => {
  const rateLimiter = new RateLimiter(maxActions, timeWindow);
  
  return {
    checkAction: () => rateLimiter.checkAction(),
    getRateLimitTimeRemaining: () => rateLimiter.getRateLimitTimeRemaining(),
    resetRateLimit: () => rateLimiter.resetRateLimit(),
    setLimitDuration: (duration: number) => rateLimiter.setLimitDuration(duration)
  };
};

export default useRateLimiter;
