
import { v4 as uuidv4 } from 'uuid';
import { contactAuth } from './contactAuth';

interface SessionData {
  sessionId: string;
  created: number;
  lastActivity: number;
  expiresAt: number;
  contactId: string | null;
}

// Default session timeout (30 minutes)
const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000;

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
      session = {
        sessionId,
        created: now,
        lastActivity: now,
        expiresAt: now + timeout,
        contactId: contactAuth.getContactId(),
      };
      this.saveSession(session);
      return sessionId;
    }
    
    // Update the session with new expiration time and activity
    session.lastActivity = now;
    session.expiresAt = now + timeout;
    this.saveSession(session);
    
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
    localStorage.removeItem('chatSession');
  },
  
  // Check if session is active
  isSessionActive(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    const now = Date.now();
    return session.expiresAt > now;
  },
  
  // Extend session timeout
  extendSession(additionalTime: number = DEFAULT_SESSION_TIMEOUT): void {
    const session = this.getSession();
    if (!session) return;
    
    const now = Date.now();
    session.lastActivity = now;
    session.expiresAt = now + additionalTime;
    this.saveSession(session);
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
};
