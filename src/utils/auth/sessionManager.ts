
/**
 * Session management utility for handling user sessions
 */
class SessionManager {
  private sessionKey = 'app_session';
  private sessionTimeoutKey = 'app_session_timeout';
  private csrfTokenKey = 'app_csrf_token';
  private monitorIntervals: Record<number, NodeJS.Timeout> = {};
  private nextIntervalId = 1;
  private listeners: Record<string, Function[]> = {};

  // Initialize or restore a session
  public initSession(timeoutMs = 30 * 60 * 1000): void {
    const existingSession = this.getSession();
    
    if (!existingSession) {
      this.createSession(timeoutMs);
    } else {
      this.updateActivity();
    }
    
    // Create CSRF token if it doesn't exist
    if (!this.getCsrfToken()) {
      this.generateCsrfToken();
    }
  }
  
  // Create a new session
  public createSession(timeoutMs = 30 * 60 * 1000): void {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    
    const session = {
      sessionId,
      createdAt: timestamp,
      lastActivity: timestamp,
      expiresAt: timestamp + timeoutMs
    };
    
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    localStorage.setItem(this.sessionTimeoutKey, timeoutMs.toString());
    
    this.triggerEvent('session_created', session);
  }
  
  // Get the current session data
  public getSession(): any {
    const sessionStr = localStorage.getItem(this.sessionKey);
    if (!sessionStr) return null;
    
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      return null;
    }
  }
  
  // Update the last activity timestamp
  public updateActivity(): void {
    const session = this.getSession();
    if (!session) return;
    
    session.lastActivity = Date.now();
    
    // Get timeout from storage or use default 30 minutes
    const timeoutMs = Number(localStorage.getItem(this.sessionTimeoutKey)) || 30 * 60 * 1000;
    session.expiresAt = session.lastActivity + timeoutMs;
    
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    
    this.triggerEvent('activity_updated', session);
  }
  
  // Check if the session is still active
  public isSessionActive(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    const now = Date.now();
    return session.expiresAt > now;
  }
  
  // Get time remaining in session (milliseconds)
  public getSessionTimeRemaining(): number {
    const session = this.getSession();
    if (!session) return 0;
    
    const now = Date.now();
    return Math.max(0, session.expiresAt - now);
  }
  
  // Check if session warning should be shown
  public isSessionWarningNeeded(): boolean {
    const timeRemaining = this.getSessionTimeRemaining();
    const timeoutMs = Number(localStorage.getItem(this.sessionTimeoutKey)) || 30 * 60 * 1000;
    
    // Show warning when less than 10% of session time remains
    return timeRemaining > 0 && timeRemaining < (timeoutMs * 0.1);
  }
  
  // End the current session
  public endSession(): void {
    const session = this.getSession();
    
    localStorage.removeItem(this.sessionKey);
    this.triggerEvent('session_ended', session);
  }
  
  // Extend the current session
  public extendSession(timeoutMs?: number): void {
    const session = this.getSession();
    if (!session) return;
    
    const now = Date.now();
    const timeout = timeoutMs || Number(localStorage.getItem(this.sessionTimeoutKey)) || 30 * 60 * 1000;
    
    session.lastActivity = now;
    session.expiresAt = now + timeout;
    
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    
    this.triggerEvent('session_extended', session);
  }
  
  // Start session monitoring
  public startSessionMonitoring(checkIntervalMs = 60000): number {
    const intervalId = this.nextIntervalId++;
    
    this.monitorIntervals[intervalId] = setInterval(() => {
      if (!this.isSessionActive()) {
        this.triggerEvent('session_expired', { sessionId: this.getSession()?.sessionId });
      } else if (this.isSessionWarningNeeded()) {
        this.triggerEvent('session_expiring_soon', { 
          timeRemaining: this.getSessionTimeRemaining(),
          sessionId: this.getSession()?.sessionId
        });
      }
    }, checkIntervalMs);
    
    return intervalId;
  }
  
  // Stop session monitoring
  public stopSessionMonitoring(intervalId: number): void {
    if (this.monitorIntervals[intervalId]) {
      clearInterval(this.monitorIntervals[intervalId]);
      delete this.monitorIntervals[intervalId];
    }
  }
  
  // Generate a new CSRF token
  public generateCsrfToken(): string {
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    localStorage.setItem(this.csrfTokenKey, token);
    return token;
  }
  
  // Get the current CSRF token
  public getCsrfToken(): string | null {
    return localStorage.getItem(this.csrfTokenKey);
  }
  
  // Validate a CSRF token
  public validateCsrfToken(token: string): boolean {
    const storedToken = this.getCsrfToken();
    return storedToken !== null && token === storedToken;
  }
  
  // Add event listener
  public addEventListener(event: string, callback: Function): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback);
    
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      if (this.listeners[event].length === 0) {
        delete this.listeners[event];
      }
    };
  }
  
  // Trigger event
  private triggerEvent(event: string, data: any): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (e) {
        console.error(`Error in session event listener for ${event}:`, e);
      }
    });
  }
}

export const sessionManager = new SessionManager();

// Session events enum for type safety
export enum SessionEvents {
  CREATED = 'session_created',
  UPDATED = 'activity_updated',
  ENDED = 'session_ended',
  EXTENDED = 'session_extended',
  EXPIRED = 'session_expired',
  EXPIRING_SOON = 'session_expiring_soon'
}

export default sessionManager;
