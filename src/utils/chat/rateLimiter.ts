
import { ChatEventType } from '@/utils/events/eventTypes';
import eventManager from '@/utils/events/eventManager';

/**
 * Rate limiter for controlling message sending frequency
 */
export class RateLimiter {
  private lastActionTime: number = 0;
  private isRateLimited: boolean = false;
  private rateLimitExpiry: number = 0;
  private readonly minInterval: number; // Minimum time between actions in ms
  private readonly rateLimitDuration: number; // Duration of rate limiting in ms
  private readonly maxActionsPerMinute: number;
  private actions: number[] = []; // Timestamps of recent actions
  
  constructor({
    minInterval = 500, // 500ms between messages
    rateLimitDuration = 30000, // 30 seconds
    maxActionsPerMinute = 20 // 20 messages per minute
  } = {}) {
    this.minInterval = minInterval;
    this.rateLimitDuration = rateLimitDuration;
    this.maxActionsPerMinute = maxActionsPerMinute;
  }
  
  /**
   * Check if an action is allowed at the current time
   */
  checkAction(): boolean {
    const now = Date.now();
    
    // If already rate limited, check if it's expired
    if (this.isRateLimited) {
      if (now >= this.rateLimitExpiry) {
        this.clearRateLimit();
        return true;
      }
      return false;
    }
    
    // Check minimum interval between actions
    if (now - this.lastActionTime < this.minInterval) {
      this.applyRateLimit();
      return false;
    }
    
    // Check actions per minute limit
    const oneMinuteAgo = now - 60000;
    this.actions = this.actions.filter(time => time > oneMinuteAgo);
    
    if (this.actions.length >= this.maxActionsPerMinute) {
      this.applyRateLimit();
      return false;
    }
    
    // Action is allowed, record it
    this.lastActionTime = now;
    this.actions.push(now);
    return true;
  }
  
  /**
   * Apply rate limiting
   */
  private applyRateLimit(): void {
    const now = Date.now();
    this.isRateLimited = true;
    this.rateLimitExpiry = now + this.rateLimitDuration;
    
    // Dispatch rate limit event
    eventManager.publish({
      type: ChatEventType.RATE_LIMIT_TRIGGERED,
      timestamp: new Date().toISOString(),
      source: 'rateLimiter',
      duration: this.rateLimitDuration,
      expiry: this.rateLimitExpiry
    });
    
    // Set timeout to clear rate limit
    setTimeout(() => {
      this.clearRateLimit();
    }, this.rateLimitDuration);
  }
  
  /**
   * Clear rate limiting
   */
  private clearRateLimit(): void {
    if (this.isRateLimited) {
      this.isRateLimited = false;
      this.rateLimitExpiry = 0;
      
      // Dispatch rate limit cleared event
      eventManager.publish({
        type: ChatEventType.RATE_LIMIT_CLEARED,
        timestamp: new Date().toISOString(),
        source: 'rateLimiter'
      });
    }
  }
  
  /**
   * Check if currently rate limited
   */
  isLimited(): boolean {
    // If rate limit has expired, clear it
    if (this.isRateLimited && Date.now() >= this.rateLimitExpiry) {
      this.clearRateLimit();
    }
    
    return this.isRateLimited;
  }
  
  /**
   * Get time remaining for rate limit in milliseconds
   */
  getRateLimitTimeRemaining(): number {
    if (!this.isRateLimited) return 0;
    
    const remaining = this.rateLimitExpiry - Date.now();
    return Math.max(0, remaining);
  }
  
  /**
   * Reset rate limiter state
   */
  reset(): void {
    this.lastActionTime = 0;
    this.actions = [];
    this.clearRateLimit();
  }
}

/**
 * Hook for using rate limiter
 */
export const useRateLimiter = (options = {}) => {
  const rateLimiter = new RateLimiter(options);
  
  return {
    checkAction: () => rateLimiter.checkAction(),
    isLimited: () => rateLimiter.isLimited(),
    getRateLimitTimeRemaining: () => rateLimiter.getRateLimitTimeRemaining(),
    reset: () => rateLimiter.reset()
  };
};

export default useRateLimiter;
