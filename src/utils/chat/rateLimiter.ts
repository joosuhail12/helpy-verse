
/**
 * Rate limiter utility for controlling message sending frequency
 */

// RateLimiter class for controlling API request rates
export class RateLimiter {
  private maxAttempts: number;
  private timeWindow: number;
  private attempts: number[];
  private resetTimeout: NodeJS.Timeout | null = null;
  private limitDuration: number;
  private limited: boolean = false;
  private limitEndTime: number = 0;

  constructor(maxAttempts = 5, timeWindow = 10000, resetAfter = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
    this.limitDuration = resetAfter;
    this.attempts = [];
  }

  // Check if action is allowed
  checkAction(): boolean {
    if (this.isLimited()) {
      return false;
    }

    const now = Date.now();
    // Remove attempts outside of the time window
    this.attempts = this.attempts.filter(time => now - time < this.timeWindow);
    
    // Check if we're over the limit
    if (this.attempts.length >= this.maxAttempts) {
      this.setLimited();
      return false;
    }

    // Record this attempt
    this.attempts.push(now);
    return true;
  }

  // Check if currently rate limited
  isLimited(): boolean {
    return this.limited && Date.now() < this.limitEndTime;
  }

  // Set the rate limit
  private setLimited(): void {
    this.limited = true;
    this.limitEndTime = Date.now() + this.limitDuration;
    
    // Reset limit after duration
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    
    this.resetTimeout = setTimeout(() => {
      this.resetRateLimit();
    }, this.limitDuration);
  }

  // Reset the rate limit
  resetRateLimit(): void {
    this.limited = false;
    this.attempts = [];
    this.limitEndTime = 0;
    
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }
  }

  // Get remaining time of rate limit in ms
  getRateLimitTimeRemaining(): number {
    if (!this.isLimited()) {
      return 0;
    }
    return Math.max(0, this.limitEndTime - Date.now());
  }

  // Set custom limit duration
  setLimitDuration(duration: number): void {
    this.limitDuration = duration;
  }
}

// Hook for using rate limiting in components
export const useRateLimiter = (
  maxAttempts = 5, 
  timeWindow = 10000, 
  resetAfter = 60000
) => {
  const rateLimiter = new RateLimiter(maxAttempts, timeWindow, resetAfter);
  
  return {
    checkAction: () => rateLimiter.checkAction(),
    getRateLimitTimeRemaining: () => rateLimiter.getRateLimitTimeRemaining(),
    resetRateLimit: () => rateLimiter.resetRateLimit(),
    setLimitDuration: (duration: number) => rateLimiter.setLimitDuration(duration),
    isLimited: () => rateLimiter.isLimited()
  };
};

export default useRateLimiter;
