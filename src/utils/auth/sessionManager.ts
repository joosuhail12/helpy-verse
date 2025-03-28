
import { v4 as uuidv4 } from 'uuid';
import { contactAuth } from './contactAuth';
import { emitEvent } from '@/utils/events/eventManager';
import { ChatEventType } from '@/utils/events/eventTypes';

interface SessionData {
  sessionId: string;
  created: number;
  lastActivity: number;
  expiresAt: number;
  contactId: string | null;
  csrfToken: string;
  warningShown: boolean;
}

// Default session timeout (30 minutes)
const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000;
// Warning before timeout (5 minutes)
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000;

// Session events
export enum SessionEvents {
  SESSION_EXPIRED = 'session_expired',
  SESSION_WARNING = 'session_warning',
  SESSION_RENEWED = 'session_renewed'
}

// Session event listener type
type SessionEventListener = (event: SessionEvents, timeRemaining?: number) => void;

// Session event listeners
const sessionEventListeners: SessionEventListener[] = [];

/**
 * Session Manager
 * Handles secure session management for chat widget
 */
export const sessionManager = {
  // Initialize or validate existing session
  initSession(timeout: number = DEFAULT_SESSION_TIMEOUT): string {
    let session: SessionData | null = this.getSession();
    const now = Date.now();
    
    // If no session exists or the session is expired, create a new one
    if (!session || session.expiresAt < now) {
      const sessionId = uuidv4();
      const csrfToken = this.generateCsrfToken();
      
      session = {
        sessionId,
        created: now,
        lastActivity: now,
        expiresAt: now + timeout,
        contactId: contactAuth.getContactId(),
        csrfToken,
        warningShown: false
      };
      
      this.saveSession(session);
      
      // Track the session creation
      emitEvent({
        type: ChatEventType.SESSION_CREATED,
        timestamp: new Date().toISOString(),
        source: 'session-manager',
        sessionId,
        metadata: {
          expiresAt: new Date(session.expiresAt).toISOString()
        }
      });
      
      return sessionId;
    }
    
    // Update the session with new expiration time and activity
    session.lastActivity = now;
    session.expiresAt = now + timeout;
    session.warningShown = false;
    this.saveSession(session);
    
    // If session was updated, emit event
    this.notifyListeners(SessionEvents.SESSION_RENEWED, timeout);
    
    return session.sessionId;
  },
  
  // Get current session data
  getSession(): SessionData | null {
    const sessionData = localStorage.getItem('chatSession');
    if (!sessionData) return null;
    
    try {
      return JSON.parse(sessionData) as SessionData;
    } catch {
      return null;
    }
  },
  
  // Save session data
  saveSession(session: SessionData): void {
    localStorage.setItem('chatSession', JSON.stringify(session));
  },
  
  // End current session
  endSession(): void {
    const session = this.getSession();
    if (session) {
      // Track session end
      emitEvent({
        type: ChatEventType.SESSION_ENDED,
        timestamp: new Date().toISOString(),
        source: 'session-manager',
        sessionId: session.sessionId,
        metadata: {
          duration: Date.now() - session.created
        }
      });
    }
    
    localStorage.removeItem('chatSession');
    this.notifyListeners(SessionEvents.SESSION_EXPIRED);
  },
  
  // Check if session is active
  isSessionActive(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    const now = Date.now();
    return session.expiresAt > now;
  },
  
  // Check if session is about to expire
  isSessionWarningNeeded(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    const now = Date.now();
    const timeRemaining = session.expiresAt - now;
    
    // If session is about to expire and warning hasn't been shown
    return timeRemaining <= WARNING_BEFORE_TIMEOUT && !session.warningShown;
  },
  
  // Mark warning as shown
  markWarningShown(): void {
    const session = this.getSession();
    if (!session) return;
    
    session.warningShown = true;
    this.saveSession(session);
  },
  
  // Extend session timeout
  extendSession(additionalTime: number = DEFAULT_SESSION_TIMEOUT): void {
    const session = this.getSession();
    if (!session) return;
    
    const now = Date.now();
    session.lastActivity = now;
    session.expiresAt = now + additionalTime;
    session.warningShown = false;
    this.saveSession(session);
    
    // Track session extension
    emitEvent({
      type: ChatEventType.SESSION_EXTENDED,
      timestamp: new Date().toISOString(),
      source: 'session-manager',
      sessionId: session.sessionId,
      metadata: {
        newExpiresAt: new Date(session.expiresAt).toISOString()
      }
    });
    
    this.notifyListeners(SessionEvents.SESSION_RENEWED, additionalTime);
  },
  
  // Get time remaining in session (in milliseconds)
  getSessionTimeRemaining(): number {
    const session = this.getSession();
    if (!session) return 0;
    
    const now = Date.now();
    return Math.max(0, session.expiresAt - now);
  },
  
  // Update session on activity
  updateActivity(): void {
    const session = this.getSession();
    if (!session) return;
    
    session.lastActivity = Date.now();
    this.saveSession(session);
  },
  
  // Generate CSRF token
  generateCsrfToken(): string {
    return uuidv4();
  },
  
  // Get current CSRF token
  getCsrfToken(): string {
    const session = this.getSession();
    if (!session) return this.generateCsrfToken();
    
    return session.csrfToken;
  },
  
  // Validate CSRF token
  validateCsrfToken(token: string): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    return session.csrfToken === token;
  },
  
  // Add session event listener
  addEventListener(listener: SessionEventListener): void {
    sessionEventListeners.push(listener);
  },
  
  // Remove session event listener
  removeEventListener(listener: SessionEventListener): void {
    const index = sessionEventListeners.indexOf(listener);
    if (index > -1) {
      sessionEventListeners.splice(index, 1);
    }
  },
  
  // Notify all listeners of a session event
  notifyListeners(event: SessionEvents, timeRemaining?: number): void {
    sessionEventListeners.forEach(listener => {
      try {
        listener(event, timeRemaining);
      } catch (error) {
        console.error('Error in session event listener:', error);
      }
    });
  },
  
  // Start session monitoring
  startSessionMonitoring(checkInterval: number = 60 * 1000): number {
    // Set up interval to check session status
    const intervalId = window.setInterval(() => {
      const session = this.getSession();
      if (!session) return;
      
      const now = Date.now();
      const timeRemaining = session.expiresAt - now;
      
      // If session is expired
      if (timeRemaining <= 0) {
        this.endSession();
        return;
      }
      
      // If session is about to expire and warning hasn't been shown
      if (timeRemaining <= WARNING_BEFORE_TIMEOUT && !session.warningShown) {
        this.notifyListeners(SessionEvents.SESSION_WARNING, timeRemaining);
        this.markWarningShown();
      }
    }, checkInterval);
    
    return intervalId;
  },
  
  // Stop session monitoring
  stopSessionMonitoring(intervalId: number): void {
    clearInterval(intervalId);
  }
};
