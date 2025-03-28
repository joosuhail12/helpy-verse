
// Define session events enum
export enum SessionEvents {
  SESSION_CREATED = 'session:created',
  SESSION_EXPIRED = 'session:expired',
  SESSION_WARNING = 'session:warning',
  SESSION_EXTENDED = 'session:extended',
  SESSION_ENDED = 'session:ended'
}

class SessionManager {
  private sessionKey = 'app_session';
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes by default
  private warningThreshold = 5 * 60 * 1000; // 5 minutes before expiry
  private listeners: { [event: string]: Function[] } = {};
  private monitorIntervals: { [id: number]: NodeJS.Timeout } = {};
  private nextIntervalId = 1;

  // Initialize a session with optional timeout
  public initSession(timeout?: number): void {
    if (timeout) {
      this.sessionTimeout = timeout;
      this.warningThreshold = Math.min(5 * 60 * 1000, timeout * 0.2);
    }
    
    if (!this.getSession()) {
      this.createSession();
    }
  }

  // Create a new session
  public createSession(duration?: number): void {
    const session = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      expiryTime: Date.now() + (duration || this.sessionTimeout),
      lastActivity: Date.now(),
      csrfToken: this.generateCsrfToken()
    };
    
    this.saveSession(session);
    this.notifyListeners(SessionEvents.SESSION_CREATED, session);
  }

  // Get current session
  public getSession(): any {
    const sessionStr = localStorage.getItem(this.sessionKey);
    if (!sessionStr) return null;
    
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      return null;
    }
  }

  // Save session to storage
  private saveSession(session: any): void {
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  // Generate a random session ID
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Generate a random CSRF token
  private generateCsrfToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Check if the session is active
  public isSessionActive(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    return Date.now() < session.expiryTime;
  }

  // Get remaining time in session
  public getSessionTimeRemaining(): number {
    const session = this.getSession();
    if (!session) return 0;
    
    const remainingTime = session.expiryTime - Date.now();
    return Math.max(0, remainingTime);
  }

  // Check if session warning should be shown
  public isSessionWarningNeeded(): boolean {
    if (!this.isSessionActive()) return false;
    
    const remainingTime = this.getSessionTimeRemaining();
    return remainingTime > 0 && remainingTime <= this.warningThreshold;
  }

  // Update the last activity timestamp
  public updateActivity(): void {
    const session = this.getSession();
    if (!session) return;
    
    session.lastActivity = Date.now();
    this.saveSession(session);
  }

  // Extend the current session
  public extendSession(duration?: number): void {
    const session = this.getSession();
    if (!session) {
      this.createSession(duration);
      return;
    }
    
    session.expiryTime = Date.now() + (duration || this.sessionTimeout);
    session.lastActivity = Date.now();
    this.saveSession(session);
    
    this.notifyListeners(SessionEvents.SESSION_EXTENDED, session);
  }

  // End the current session
  public endSession(): void {
    const session = this.getSession();
    localStorage.removeItem(this.sessionKey);
    
    if (session) {
      this.notifyListeners(SessionEvents.SESSION_ENDED, session);
    }
  }

  // Get CSRF token for the current session
  public getCsrfToken(): string {
    const session = this.getSession();
    return session ? session.csrfToken : '';
  }

  // Add event listener
  public addEventListener(event: SessionEvents, callback: Function): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  // Notify listeners of an event
  private notifyListeners(event: SessionEvents, data: any): void {
    if (!this.listeners[event]) return;
    
    for (const callback of this.listeners[event]) {
      try {
        callback(data);
      } catch (e) {
        console.error(`Error in session event listener for ${event}:`, e);
      }
    }
  }

  // Start session monitoring
  public startSessionMonitoring(checkInterval = 60000): number {
    const intervalId = this.nextIntervalId++;
    
    this.monitorIntervals[intervalId] = setInterval(() => {
      const session = this.getSession();
      if (!session) return;
      
      const currentTime = Date.now();
      const timeRemaining = session.expiryTime - currentTime;
      
      // Session expired
      if (timeRemaining <= 0) {
        this.notifyListeners(SessionEvents.SESSION_EXPIRED, { 
          sessionId: session.id, 
          expiredAt: new Date(session.expiryTime) 
        });
        this.endSession();
      }
      // Session warning needed
      else if (timeRemaining <= this.warningThreshold) {
        this.notifyListeners(SessionEvents.SESSION_WARNING, {
          sessionId: session.id,
          expiresIn: timeRemaining,
          expiryTime: new Date(session.expiryTime)
        });
      }
    }, checkInterval);
    
    return intervalId;
  }

  // Stop session monitoring
  public stopSessionMonitoring(intervalId: number): void {
    if (this.monitorIntervals[intervalId]) {
      clearInterval(this.monitorIntervals[intervalId]);
      delete this.monitorIntervals[intervalId];
    }
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;
