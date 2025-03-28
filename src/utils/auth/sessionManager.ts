
/**
 * Session management utility
 */

export enum SessionEvents {
  SESSION_CREATED = 'session:created',
  SESSION_UPDATED = 'session:updated',
  SESSION_EXPIRED = 'session:expired',
  SESSION_WARNING = 'session:warning',
  SESSION_EXTENDED = 'session:extended'
}

class SessionManager {
  private sessionData: Record<string, any> = {};
  private sessionExpiry: number = 0;
  private sessionWarningThreshold: number = 5 * 60 * 1000; // 5 minutes
  private maxSessionTime: number = 60 * 60 * 1000; // 1 hour
  private listeners: Record<string, Function[]> = {};
  private monitorIntervals: Record<number, NodeJS.Timeout> = {};
  private monitorIdCounter: number = 0;
  private csrfToken: string = '';
  
  constructor() {
    // Initialize with default values
    this.initSession();
    // Generate a CSRF token
    this.regenerateCsrfToken();
  }
  
  /**
   * Initialize a new session
   */
  initSession(): void {
    this.sessionData = {
      id: `session-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    this.sessionExpiry = Date.now() + this.maxSessionTime;
    this.notifyListeners(SessionEvents.SESSION_CREATED, { 
      session: this.sessionData, 
      expiry: this.sessionExpiry 
    });
  }
  
  /**
   * Create a new session with specified duration
   */
  createSession(duration?: number): void {
    this.sessionData = {
      id: `session-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    this.sessionExpiry = Date.now() + (duration || this.maxSessionTime);
    this.notifyListeners(SessionEvents.SESSION_CREATED, { 
      session: this.sessionData, 
      expiry: this.sessionExpiry 
    });
  }
  
  /**
   * End the current session
   */
  endSession(): void {
    this.sessionData = {};
    this.sessionExpiry = 0;
    this.notifyListeners(SessionEvents.SESSION_EXPIRED, {});
  }
  
  /**
   * Check if the session is still active
   */
  isSessionActive(): boolean {
    return Date.now() < this.sessionExpiry;
  }
  
  /**
   * Get the remaining session time in milliseconds
   */
  getSessionTimeRemaining(): number {
    return Math.max(0, this.sessionExpiry - Date.now());
  }
  
  /**
   * Check if we should show a session warning
   */
  isSessionWarningNeeded(): boolean {
    return this.isSessionActive() && 
      this.getSessionTimeRemaining() < this.sessionWarningThreshold;
  }
  
  /**
   * Update the last activity time
   */
  updateActivity(): void {
    this.sessionData.lastActivity = new Date().toISOString();
    this.notifyListeners(SessionEvents.SESSION_UPDATED, { session: this.sessionData });
  }
  
  /**
   * Extend the session expiry time
   */
  extendSession(duration?: number): void {
    this.sessionExpiry = Date.now() + (duration || this.maxSessionTime);
    this.notifyListeners(SessionEvents.SESSION_EXTENDED, { 
      session: this.sessionData,
      expiry: this.sessionExpiry
    });
  }
  
  /**
   * Get the current session data
   */
  getSession(): Record<string, any> {
    return { ...this.sessionData };
  }
  
  /**
   * Set session data
   */
  setSessionData(key: string, value: any): void {
    this.sessionData[key] = value;
    this.updateActivity();
  }
  
  /**
   * Get specific session data
   */
  getSessionData(key: string): any {
    return this.sessionData[key];
  }
  
  /**
   * Add a event listener
   */
  addEventListener(event: SessionEvents, callback: Function): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback);
    
    // Return a function to remove the listener
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }
  
  /**
   * Notify all listeners of an event
   */
  private notifyListeners(event: SessionEvents, data: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in session event listener for ${event}:`, error);
        }
      });
    }
  }
  
  /**
   * Generate a new CSRF token
   */
  regenerateCsrfToken(): string {
    // Generate a random token
    this.csrfToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    return this.csrfToken;
  }
  
  /**
   * Get the current CSRF token
   */
  getCsrfToken(): string {
    return this.csrfToken;
  }
  
  /**
   * Validate a CSRF token
   */
  validateCsrfToken(token: string): boolean {
    // In a real implementation, validate against a stored token
    return token === this.csrfToken;
  }
  
  /**
   * Start session monitoring to check for expiry
   */
  startSessionMonitoring(): number {
    const id = ++this.monitorIdCounter;
    
    this.monitorIntervals[id] = setInterval(() => {
      if (!this.isSessionActive()) {
        this.notifyListeners(SessionEvents.SESSION_EXPIRED, {});
      } else if (this.isSessionWarningNeeded()) {
        this.notifyListeners(SessionEvents.SESSION_WARNING, {
          timeRemaining: this.getSessionTimeRemaining()
        });
      }
    }, 10000); // Check every 10 seconds
    
    return id;
  }
  
  /**
   * Stop session monitoring
   */
  stopSessionMonitoring(id: number): void {
    if (this.monitorIntervals[id]) {
      clearInterval(this.monitorIntervals[id]);
      delete this.monitorIntervals[id];
    }
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;
