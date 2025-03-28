
/**
 * A simple rate limiter for chat messages to prevent spam
 */

interface RateLimitConfig {
  maxMessages: number;
  timeWindowMs: number;
  cooldownMs: number;
}

interface RateLimitState {
  messages: number;
  lastMessageTime: number;
  isBlocked: boolean;
  blockUntil: number;
}

export class RateLimiter {
  private config: RateLimitConfig;
  private state: RateLimitState;
  private storageKey: string;

  constructor(
    conversationId: string,
    config: Partial<RateLimitConfig> = {}
  ) {
    // Default config
    this.config = {
      maxMessages: 10,
      timeWindowMs: 10000, // 10 seconds
      cooldownMs: 30000, // 30 seconds
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
          this.resetState();
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
      blockUntil: 0
    };
    this.saveState();
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
        return {
          allowed: false,
          reason: `You're sending too many messages. Please wait ${Math.ceil(timeRemaining / 1000)} seconds.`,
          retryAfterMs: timeRemaining
        };
      } else {
        // Reset if block period has passed
        this.resetState();
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
      this.state.isBlocked = true;
      this.state.blockUntil = now + this.config.cooldownMs;
      this.saveState();

      return {
        allowed: false,
        reason: `You've sent too many messages too quickly. Please wait ${Math.ceil(this.config.cooldownMs / 1000)} seconds.`,
        retryAfterMs: this.config.cooldownMs
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
}
