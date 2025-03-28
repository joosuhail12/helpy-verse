
// Session management utility for handling user sessions, timing out, CSRF protection, etc.

import { v4 as uuidv4 } from 'uuid';

export enum SessionEvents {
  SESSION_CREATED = 'session:created',
  SESSION_EXPIRED = 'session:expired',
  SESSION_EXTENDED = 'session:extended',
  SESSION_WARNING = 'session:warning',
  SESSION_TERMINATED = 'session:terminated'
}

interface Session {
  id: string;
  startedAt: number;
  expiresAt: number;
  lastActivityAt: number;
  csrfToken: string;
  warningThreshold: number; // in milliseconds before expiry
}

class SessionManager {
  private session: Session | null = null;
  private readonly DEFAULT_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly DEFAULT_WARNING_THRESHOLD = 5 * 60 * 1000;  // 5 minutes before expiry
  private timeoutId: number | null = null;
  private warningTimeoutId: number | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  
  constructor() {
    // Try to restore session from storage on initialization
    this.restoreSession();
    
    // Set up event listener for activity
    document.addEventListener('click', () => this.recordActivity());
    document.addEventListener('keypress', () => this.recordActivity());
    
    // Set up timer to check session expiry
    setInterval(() => this.checkSession(), 60 * 1000); // Check every minute
  }
  
  /**
   * Create a new session
   */
  createSession(duration?: number): void {
    const sessionDuration = duration || this.DEFAULT_SESSION_DURATION;
    const now = Date.now();
    
    this.session = {
      id: uuidv4(),
      startedAt: now,
      expiresAt: now + sessionDuration,
      lastActivityAt: now,
      csrfToken: this.generateCSRFToken(),
      warningThreshold: this.DEFAULT_WARNING_THRESHOLD
    };
    
    this.saveSession();
    this.setupTimeouts();
    
    this.emitEvent(SessionEvents.SESSION_CREATED, { 
      sessionId: this.session.id,
      expiresAt: this.session.expiresAt
    });
    
    console.log('New session created, expires at:', new Date(this.session.expiresAt));
  }
  
  /**
   * End the current session
   */
  endSession(): void {
    if (!this.session) return;
    
    const sessionId = this.session.id;
    this.session = null;
    
    // Clear any pending timeouts
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    if (this.warningTimeoutId !== null) {
      window.clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
    
    // Remove from storage
    sessionStorage.removeItem('userSession');
    
    this.emitEvent(SessionEvents.SESSION_TERMINATED, { sessionId });
    console.log('Session terminated:', sessionId);
  }
  
  /**
   * Extend the current session by the specified duration
   */
  extendSession(duration?: number): void {
    if (!this.session) {
      this.createSession(duration);
      return;
    }
    
    const extensionDuration = duration || this.DEFAULT_SESSION_DURATION;
    const now = Date.now();
    
    this.session.lastActivityAt = now;
    this.session.expiresAt = now + extensionDuration;
    
    this.saveSession();
    this.setupTimeouts();
    
    this.emitEvent(SessionEvents.SESSION_EXTENDED, { 
      sessionId: this.session.id,
      expiresAt: this.session.expiresAt
    });
    
    console.log('Session extended, expires at:', new Date(this.session.expiresAt));
  }
  
  /**
   * Check if the session is active
   */
  isSessionActive(): boolean {
    if (!this.session) return false;
    
    const now = Date.now();
    return now < this.session.expiresAt;
  }
  
  /**
   * Get the session object
   */
  getSession(): Session | null {
    return this.session;
  }
  
  /**
   * Get time remaining in the session in milliseconds
   */
  getSessionTimeRemaining(): number {
    if (!this.session) return 0;
    
    const now = Date.now();
    const remaining = this.session.expiresAt - now;
    
    return Math.max(0, remaining);
  }
  
  /**
   * Check if session needs warning notification
   */
  isSessionWarningNeeded(): boolean {
    if (!this.session) return false;
    
    const timeRemaining = this.getSessionTimeRemaining();
    return timeRemaining > 0 && timeRemaining <= this.session.warningThreshold;
  }
  
  /**
   * Get CSRF token for the current session
   */
  getCsrfToken(): string {
    if (!this.session) {
      this.createSession();
    }
    
    return this.session?.csrfToken || '';
  }
  
  /**
   * Validate a CSRF token against the current session
   */
  validateCsrfToken(token: string): boolean {
    if (!this.session) return false;
    return this.session.csrfToken === token;
  }
  
  /**
   * Record user activity to prevent session timeout
   */
  recordActivity(): void {
    if (!this.session) return;
    
    const now = Date.now();
    this.session.lastActivityAt = now;
    
    // Only save to storage periodically to avoid excessive writes
    if (now - this.session.lastActivityAt > 60000) {
      this.saveSession();
    }
  }
  
  /**
   * Subscribe to session events
   */
  addEventListener(event: SessionEvents, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.add(callback);
    }
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }
  
  /**
   * Remove an event listener
   */
  removeEventListener(event: SessionEvents, callback: (data: any) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }
  
  // Private methods
  
  /**
   * Generate a random CSRF token
   */
  private generateCSRFToken(): string {
    return uuidv4();
  }
  
  /**
   * Save session to storage
   */
  private saveSession(): void {
    if (!this.session) return;
    
    try {
      sessionStorage.setItem('userSession', JSON.stringify(this.session));
    } catch (error) {
      console.error('Failed to save session to storage:', error);
    }
  }
  
  /**
   * Restore session from storage
   */
  private restoreSession(): void {
    try {
      const savedSession = sessionStorage.getItem('userSession');
      
      if (savedSession) {
        this.session = JSON.parse(savedSession);
        
        // Verify session is still valid
        if (!this.isSessionActive()) {
          console.log('Restored session has expired');
          this.endSession();
          return;
        }
        
        this.setupTimeouts();
        console.log('Session restored, expires at:', new Date(this.session.expiresAt));
      }
    } catch (error) {
      console.error('Failed to restore session from storage:', error);
      this.session = null;
    }
  }
  
  /**
   * Set up timeouts for session expiry and warnings
   */
  private setupTimeouts(): void {
    if (!this.session) return;
    
    // Clear any existing timeouts
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    
    if (this.warningTimeoutId !== null) {
      window.clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
    
    const now = Date.now();
    
    // Set timeout for session expiry
    const timeToExpiry = Math.max(0, this.session.expiresAt - now);
    if (timeToExpiry > 0) {
      this.timeoutId = window.setTimeout(() => {
        this.handleSessionExpiry();
      }, timeToExpiry);
      
      // Set timeout for session expiry warning
      const timeToWarning = Math.max(0, timeToExpiry - this.session.warningThreshold);
      if (timeToWarning > 0) {
        this.warningTimeoutId = window.setTimeout(() => {
          this.handleSessionWarning();
        }, timeToWarning);
      } else {
        // We're already in warning period
        this.handleSessionWarning();
      }
    } else {
      // Session already expired
      this.handleSessionExpiry();
    }
  }
  
  /**
   * Handle session expiry
   */
  private handleSessionExpiry(): void {
    if (!this.session) return;
    
    const sessionId = this.session.id;
    
    // End the session
    this.session = null;
    sessionStorage.removeItem('userSession');
    
    // Emit event
    this.emitEvent(SessionEvents.SESSION_EXPIRED, { sessionId });
    console.log('Session expired:', sessionId);
  }
  
  /**
   * Handle session warning
   */
  private handleSessionWarning(): void {
    if (!this.session) return;
    
    const timeRemaining = this.getSessionTimeRemaining();
    
    // Emit warning event
    this.emitEvent(SessionEvents.SESSION_WARNING, { 
      sessionId: this.session.id, 
      timeRemaining 
    });
    
    console.log('Session warning, time remaining:', timeRemaining / 1000, 'seconds');
  }
  
  /**
   * Periodically check session status
   */
  private checkSession(): void {
    if (!this.session) return;
    
    if (!this.isSessionActive()) {
      this.handleSessionExpiry();
    }
  }
  
  /**
   * Emit an event to all subscribers
   */
  private emitEvent(event: SessionEvents, data: any): void {
    const listeners = this.listeners.get(event);
    
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in session event listener for ${event}:`, error);
        }
      });
    }
  }
}

// Export a singleton instance
const sessionManager = new SessionManager();
export default sessionManager;
