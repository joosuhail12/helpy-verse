
/**
 * A robust rate limiter for chat messages to prevent spam and DoS attacks
 */

interface RateLimitConfig {
  maxMessages: number;
  timeWindowMs: number;
  cooldownMs: number;
  maxConsecutiveBlockCount: number;
  escalationFactor: number;
}

interface RateLimitState {
  messages: number;
  lastMessageTime: number;
  isBlocked: boolean;
  blockUntil: number;
  consecutiveBlockCount: number;
  lastBlockReason: string;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private state: RateLimitState;
  private storageKey: string;
  private rateLimitEventEmitted: boolean = false;

  constructor(
    conversationId: string,
    config: Partial<RateLimitConfig> = {}
  ) {
    // Default config
    this.config = {
      maxMessages: 10,
      timeWindowMs: 10000, // 10 seconds
      cooldownMs: 30000, // 30 seconds
      maxConsecutiveBlockCount: 3,
      escalationFactor: 2,
      ...config
    };

    this.storageKey = `rate_limit_${conversationId}`;
    this.loadState();
  }

  private loadState(): void {
    try {
      const savedState = localStorage.getItem(this.storageKey);
      if (savedState) {
        this.state = JSON.parse(savedState);
        
        // If the block has expired, reset the state
        if (this.state.isBlocked && Date.now() > this.state.blockUntil) {
          this.resetBlockState();
        }
      } else {
        this.resetState();
      }
    } catch (error) {
      console.error('Failed to load rate limit state:', error);
      this.resetState();
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save rate limit state:', error);
    }
  }

  private resetState(): void {
    this.state = {
      messages: 0,
      lastMessageTime: 0,
      isBlocked: false,
      blockUntil: 0,
      consecutiveBlockCount: 0,
      lastBlockReason: ''
    };
    this.saveState();
  }
  
  private resetBlockState(): void {
    this.state.messages = 0;
    this.state.isBlocked = false;
    this.state.blockUntil = 0;
    this.saveState();
    
    // Dispatch rate limit cleared event
    this.dispatchRateLimitClearedEvent();
  }
  
  private dispatchRateLimitWarningEvent(message: string, duration: number): void {
    // Only emit the event once per block period
    if (!this.rateLimitEventEmitted) {
      const event = new CustomEvent('rateLimitWarning', { 
        detail: { 
          message, 
          duration 
        } 
      });
      window.dispatchEvent(event);
      this.rateLimitEventEmitted = true;
      
      setTimeout(() => {
        this.rateLimitEventEmitted = false;
      }, duration);
    }
  }
  
  private dispatchRateLimitClearedEvent(): void {
    const event = new CustomEvent('rateLimitCleared');
    window.dispatchEvent(event);
    this.rateLimitEventEmitted = false;
  }
  
  /**
   * Calculate cooldown period with exponential backoff
   */
  private calculateCooldownPeriod(): number {
    const { cooldownMs, escalationFactor, maxConsecutiveBlockCount } = this.config;
    const factor = Math.min(
      Math.pow(escalationFactor, this.state.consecutiveBlockCount), 
      Math.pow(escalationFactor, maxConsecutiveBlockCount)
    );
    return cooldownMs * factor;
  }

  /**
   * Check if the user is allowed to send a message
   * @returns An object with allowed status and reason if not allowed
   */
  canSendMessage(): { allowed: boolean; reason?: string; retryAfterMs?: number } {
    this.loadState();

    // Check if user is blocked
    if (this.state.isBlocked) {
      const timeRemaining = this.state.blockUntil - Date.now();
      if (timeRemaining > 0) {
        const seconds = Math.ceil(timeRemaining / 1000);
        const message = `You're sending too many messages. Please wait ${seconds} second${seconds !== 1 ? 's' : ''}.`;
        
        // Dispatch event for UI notification
        this.dispatchRateLimitWarningEvent(message, timeRemaining);
        
        return {
          allowed: false,
          reason: message,
          retryAfterMs: timeRemaining
        };
      } else {
        // Reset if block period has passed
        this.resetBlockState();
      }
    }

    const now = Date.now();
    const timeSinceLastMessage = now - this.state.lastMessageTime;

    // Check if we should reset the counter
    if (timeSinceLastMessage > this.config.timeWindowMs) {
      this.state.messages = 0;
    }

    // Check if user has exceeded rate limit
    if (this.state.messages >= this.config.maxMessages) {
      const cooldownPeriod = this.calculateCooldownPeriod();
      this.state.isBlocked = true;
      this.state.blockUntil = now + cooldownPeriod;
      this.state.consecutiveBlockCount++;
      this.state.lastBlockReason = 'Too many messages sent too quickly';
      this.saveState();

      const seconds = Math.ceil(cooldownPeriod / 1000);
      const message = `You've sent too many messages too quickly. Please wait ${seconds} second${seconds !== 1 ? 's' : ''}.`;
      
      // Dispatch event for UI notification
      this.dispatchRateLimitWarningEvent(message, cooldownPeriod);
      
      return {
        allowed: false,
        reason: message,
        retryAfterMs: cooldownPeriod
      };
    }

    return { allowed: true };
  }

  /**
   * Record a message being sent
   */
  recordMessage(): void {
    this.state.messages += 1;
    this.state.lastMessageTime = Date.now();
    this.saveState();
  }
  
  /**
   * Get current rate limit state
   */
  getState(): {
    isBlocked: boolean;
    timeRemaining: number;
    messageCount: number;
    maxMessages: number;
  } {
    this.loadState();
    
    return {
      isBlocked: this.state.isBlocked,
      timeRemaining: Math.max(0, this.state.blockUntil - Date.now()),
      messageCount: this.state.messages,
      maxMessages: this.config.maxMessages
    };
  }
  
  /**
   * Reset rate limit state (for testing or administrative purposes)
   */
  reset(): void {
    this.resetState();
    this.dispatchRateLimitClearedEvent();
  }
}
