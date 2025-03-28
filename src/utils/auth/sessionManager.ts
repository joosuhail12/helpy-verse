import { v4 as uuidv4 } from 'uuid';
import { emitEvent } from '../events/eventManager';
import { ChatEventType } from '../events/eventTypes';
import { getCookie, setCookie } from '../cookies/cookieManager';

interface Session {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  expiresAt: number;
  csrfToken: string;
}

class SessionManager {
  private session: Session | null = null;
  private readonly SESSION_KEY = 'chat_session';
  private readonly CSRF_TOKEN_KEY = 'chat_csrf_token';
  private monitoringIntervals: number[] = [];
  
  /**
   * Initialize a new session or resume an existing one
   */
  initSession(sessionTimeoutMs: number = 30 * 60 * 1000): Session {
    // Try to restore existing session
    const savedSession = this.getStoredSession();
    const now = Date.now();
    
    if (savedSession && savedSession.expiresAt > now) {
      // Existing valid session found
      this.session = savedSession;
      this.session.lastActivity = now;
      this.updateSessionStorage();
      
      console.log('Resumed existing session:', this.session.sessionId);
    } else {
      // Create new session
      const sessionId = uuidv4();
      const csrfToken = this.generateCsrfToken();
      
      this.session = {
        sessionId,
        startTime: now,
        lastActivity: now,
        expiresAt: now + sessionTimeoutMs,
        csrfToken
      };
      
      this.updateSessionStorage();
      
      // Emit session start event
      emitEvent({
        type: ChatEventType.SESSION_STARTED,
        timestamp: new Date().toISOString(),
        source: 'session-manager',
        sessionId,
        expiresAt: new Date(now + sessionTimeoutMs).toISOString()
      });
      
      console.log('Started new session:', sessionId);
    }
    
    return this.session;
  }
  
  /**
   * Get current session
   */
  getSession(): Session | null {
    if (!this.session) {
      // Try to restore from storage
      const savedSession = this.getStoredSession();
      if (savedSession && savedSession.expiresAt > Date.now()) {
        this.session = savedSession;
      }
    }
    
    return this.session;
  }
  
  /**
   * Update activity timestamp
   */
  updateActivity(): void {
    if (this.session) {
      this.session.lastActivity = Date.now();
      this.updateSessionStorage();
    }
  }
  
  /**
   * Extend session timeout
   */
  extendSession(sessionTimeoutMs: number = 30 * 60 * 1000): void {
    if (this.session) {
      const now = Date.now();
      this.session.lastActivity = now;
      this.session.expiresAt = now + sessionTimeoutMs;
      this.updateSessionStorage();
      
      console.log('Extended session:', this.session.sessionId);
    }
  }
  
  /**
   * End current session
   */
  endSession(): void {
    if (this.session) {
      const sessionId = this.session.sessionId;
      
      // Emit session end event
      emitEvent({
        type: ChatEventType.SESSION_ENDED,
        timestamp: new Date().toISOString(),
        source: 'session-manager',
        sessionId,
        duration: Date.now() - this.session.startTime
      });
      
      this.session = null;
      localStorage.removeItem(this.SESSION_KEY);
      
      // Clear any monitoring intervals
      this.stopAllSessionMonitoring();
      
      console.log('Ended session:', sessionId);
    }
  }
  
  /**
   * Start monitoring session expiry
   */
  startSessionMonitoring(checkIntervalMs: number = 60000): number {
    const intervalId = window.setInterval(() => {
      const session = this.getSession();
      
      if (!session) {
        return;
      }
      
      const now = Date.now();
      const timeUntilExpiry = session.expiresAt - now;
      
      if (timeUntilExpiry <= 0) {
        console.log('Session expired, ending session');
        this.endSession();
      } else if (timeUntilExpiry < 5 * 60 * 1000) {
        // Emit warning when less than 5 minutes remaining
        console.log(`Session expiring in ${Math.round(timeUntilExpiry / 1000)} seconds`);
        
        // Emit a custom event that UI can listen for
        const event = new CustomEvent('session:expiring', {
          detail: {
            timeRemaining: timeUntilExpiry,
            sessionId: session.sessionId
          }
        });
        window.dispatchEvent(event);
      }
    }, checkIntervalMs);
    
    this.monitoringIntervals.push(intervalId);
    return intervalId;
  }
  
  /**
   * Stop a specific monitoring interval
   */
  stopSessionMonitoring(intervalId: number): void {
    clearInterval(intervalId);
    this.monitoringIntervals = this.monitoringIntervals.filter(id => id !== intervalId);
  }
  
  /**
   * Stop all monitoring intervals
   */
  private stopAllSessionMonitoring(): void {
    this.monitoringIntervals.forEach(id => clearInterval(id));
    this.monitoringIntervals = [];
  }
  
  /**
   * Get the CSRF token for the current session
   */
  getCsrfToken(): string | null {
    if (this.session) {
      return this.session.csrfToken;
    }
    
    // Try to get from cookies as fallback
    return getCookie(this.CSRF_TOKEN_KEY);
  }
  
  /**
   * Validate a CSRF token against the current session
   */
  validateCsrfToken(token: string): boolean {
    const currentToken = this.getCsrfToken();
    return !!currentToken && currentToken === token;
  }
  
  /**
   * Generate a new CSRF token
   */
  private generateCsrfToken(): string {
    const token = uuidv4();
    setCookie(this.CSRF_TOKEN_KEY, token, 1); // Short expiry for CSRF tokens
    return token;
  }
  
  /**
   * Get session from storage
   */
  private getStoredSession(): Session | null {
    try {
      const sessionJson = localStorage.getItem(this.SESSION_KEY);
      return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (error) {
      console.error('Error retrieving session from storage:', error);
      return null;
    }
  }
  
  /**
   * Update session in storage
   */
  private updateSessionStorage(): void {
    if (this.session) {
      try {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.session));
      } catch (error) {
        console.error('Error saving session to storage:', error);
      }
    }
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;
