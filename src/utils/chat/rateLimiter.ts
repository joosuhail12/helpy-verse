
import { useState, useCallback, useRef, useEffect } from 'react';

interface RateLimiterOptions {
  maxMessages: number;
  timeWindowMs: number;
}

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
