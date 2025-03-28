
import { useState, useCallback, useRef, useEffect } from 'react';

// Define options interface
interface RateLimiterOptions {
  maxMessages: number;
  timeWindowMs: number;
  cooldownMs?: number;
}

// RateLimiter class for managing rate limiting
export class RateLimiter {
  private conversationId: string;
  private maxMessages: number;
  private timeWindowMs: number;
  private cooldownMs: number;
  private messageTimestamps: number[] = [];
  private isBlocked: boolean = false;
  private blockUntil: number = 0;
  private messageCount: number = 0;

  constructor(
    conversationId: string, 
    options?: RateLimiterOptions
  ) {
    this.conversationId = conversationId;
    this.maxMessages = options?.maxMessages || 5;
    this.timeWindowMs = options?.timeWindowMs || 10000; // 10 seconds default
    this.cooldownMs = options?.cooldownMs || 30000; // 30 seconds default
  }

  public canSendMessage(): { allowed: boolean; reason?: string; retryAfterMs?: number } {
    const now = Date.now();
    
    // Check if currently blocked
    if (this.isBlocked && now < this.blockUntil) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded. Please wait before sending more messages.',
        retryAfterMs: this.blockUntil - now
      };
    }
    
    // If block expired, reset it
    if (this.isBlocked && now >= this.blockUntil) {
      this.isBlocked = false;
      this.messageTimestamps = [];
      
      // Dispatch event to notify cooldown is over
      this.dispatchCooldownEndedEvent();
    }
    
    // Remove timestamps outside the window
    this.messageTimestamps = this.messageTimestamps.filter(
      timestamp => now - timestamp < this.timeWindowMs
    );
    
    // Check if we've hit the limit
    if (this.messageTimestamps.length >= this.maxMessages) {
      this.isBlocked = true;
      this.blockUntil = now + this.cooldownMs;
      
      return {
        allowed: false,
        reason: 'Rate limit exceeded. Please wait before sending more messages.',
        retryAfterMs: this.cooldownMs
      };
    }
    
    return { allowed: true };
  }

  public recordMessage(): void {
    this.messageTimestamps.push(Date.now());
    this.messageCount++;
  }

  public reset(): void {
    this.messageTimestamps = [];
    this.isBlocked = false;
    this.blockUntil = 0;
    this.dispatchCooldownEndedEvent();
  }

  public getState(): { isBlocked: boolean; timeRemaining: number; messageCount: number } {
    const now = Date.now();
    const timeRemaining = this.isBlocked ? Math.max(0, this.blockUntil - now) : 0;
    
    return {
      isBlocked: this.isBlocked,
      timeRemaining,
      messageCount: this.messageCount
    };
  }

  private dispatchCooldownEndedEvent(): void {
    const event = new CustomEvent('rateLimitCleared', {
      detail: { conversationId: this.conversationId }
    });
    window.dispatchEvent(event);
  }
}

// React hook for rate limiting
export function useRateLimiter(options: RateLimiterOptions) {
  const { maxMessages, timeWindowMs } = options;
  const [isLimited, setIsLimited] = useState(false);
  const messageTimestamps = useRef<number[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(0);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    
    // Remove timestamps outside the window
    messageTimestamps.current = messageTimestamps.current.filter(
      timestamp => now - timestamp < timeWindowMs
    );
    
    // Check if we've hit the limit
    if (messageTimestamps.current.length >= maxMessages) {
      setIsLimited(true);
      
      // Calculate time until oldest message leaves the window
      const oldestTimestamp = messageTimestamps.current[0];
      const timeToWait = timeWindowMs - (now - oldestTimestamp);
      remainingTimeRef.current = timeToWait;
      
      // Set timeout to clear rate limit
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        setIsLimited(false);
        remainingTimeRef.current = 0;
        messageTimestamps.current.shift(); // Remove oldest message
      }, timeToWait);
      
      return false;
    }
    
    // Add current timestamp and allow the message
    messageTimestamps.current.push(now);
    return true;
  }, [maxMessages, timeWindowMs]);

  const isRateLimited = useCallback(() => {
    return isLimited;
  }, [isLimited]);

  const getRemainingTime = useCallback(() => {
    if (!isLimited) return 0;
    return Math.ceil(remainingTimeRef.current / 1000); // Return seconds
  }, [isLimited]);

  return {
    isRateLimited,
    getRemainingTime,
    checkRateLimit,
  };
}
