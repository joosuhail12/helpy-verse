
import { getCookie, setCookie, removeCookie } from '../helpers/helpers';
import { emitEvent } from '../events/eventManager';
import { ChatEventType } from '../events/eventTypes';

class SessionManager {
  private sessionKey = 'session_last_activity';
  private timeoutMs: number = 30 * 60 * 1000; // Default 30 minutes
  private monitorIds: Map<number, NodeJS.Timeout> = new Map();
  private nextMonitorId: number = 1;
  
  // Initialize session with timeout
  public initSession(timeoutMs?: number): void {
    if (timeoutMs) {
      this.timeoutMs = timeoutMs;
    }
    
    // Set initial activity timestamp
    localStorage.setItem(this.sessionKey, Date.now().toString());
    
    // Create session started event
    emitEvent({
      type: ChatEventType.SESSION_STARTED,
      timestamp: new Date().toISOString(),
      source: 'session-manager',
      expiresAt: new Date(Date.now() + this.timeoutMs).toISOString()
    });
  }
  
  // Update session activity timestamp
  public updateActivity(): void {
    localStorage.setItem(this.sessionKey, Date.now().toString());
  }
  
  // Extend session timeout
  public extendSession(timeoutMs?: number): void {
    if (timeoutMs) {
      this.timeoutMs = timeoutMs;
    }
    
    this.updateActivity();
  }
  
  // End session
  public endSession(): void {
    localStorage.removeItem(this.sessionKey);
    
    // Stop all monitor intervals
    this.monitorIds.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    
    this.monitorIds.clear();
    
    // Create session ended event
    emitEvent({
      type: ChatEventType.SESSION_ENDED,
      timestamp: new Date().toISOString(),
      source: 'session-manager',
      reason: 'manual'
    });
  }
  
  // Check if session is expired
  public isSessionExpired(): boolean {
    const lastActivity = localStorage.getItem(this.sessionKey);
    
    if (!lastActivity) {
      return true;
    }
    
    const lastActivityTime = parseInt(lastActivity, 10);
    const now = Date.now();
    
    return now - lastActivityTime > this.timeoutMs;
  }
  
  // Get remaining session time in milliseconds
  public getRemainingTime(): number {
    const lastActivity = localStorage.getItem(this.sessionKey);
    
    if (!lastActivity) {
      return 0;
    }
    
    const lastActivityTime = parseInt(lastActivity, 10);
    const now = Date.now();
    const expirationTime = lastActivityTime + this.timeoutMs;
    
    return Math.max(0, expirationTime - now);
  }
  
  // Start session monitoring
  public startSessionMonitoring(checkIntervalMs: number = 60000): number {
    const monitorId = this.nextMonitorId++;
    
    const intervalId = setInterval(() => {
      if (this.isSessionExpired()) {
        this.endSession();
        
        // Create expired event
        emitEvent({
          type: ChatEventType.SESSION_ENDED,
          timestamp: new Date().toISOString(),
          source: 'session-manager',
          reason: 'expired'
        });
      }
    }, checkIntervalMs);
    
    this.monitorIds.set(monitorId, intervalId);
    
    return monitorId;
  }
  
  // Stop session monitoring
  public stopSessionMonitoring(monitorId: number): void {
    const intervalId = this.monitorIds.get(monitorId);
    
    if (intervalId) {
      clearInterval(intervalId);
      this.monitorIds.delete(monitorId);
    }
  }
}

export const sessionManager = new SessionManager();
