
/**
 * Authentication utility for contacts
 */
class ContactAuth {
  private contactKey = 'app_contact';
  private authStateKey = 'app_auth_state';
  private tokenKey = 'app_auth_token';
  
  // Authenticate a contact
  public async authenticate(contactId: string, token: string): Promise<boolean> {
    // In a real app, you would verify this with your backend
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!contactId || !token) return false;
      
      // Store contact information
      localStorage.setItem(this.contactKey, JSON.stringify({
        id: contactId,
        authenticated: true,
        authenticatedAt: new Date().toISOString(),
        token
      }));
      
      // Update auth state
      localStorage.setItem(this.authStateKey, 'authenticated');
      localStorage.setItem(this.tokenKey, token);
      
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }
  
  // Check if contact is authenticated
  public isAuthenticated(): boolean {
    const contactStr = localStorage.getItem(this.contactKey);
    if (!contactStr) return false;
    
    try {
      const contact = JSON.parse(contactStr);
      return contact.authenticated === true;
    } catch (e) {
      return false;
    }
  }
  
  // Get current contact
  public getContact(): any {
    const contactStr = localStorage.getItem(this.contactKey);
    if (!contactStr) return null;
    
    try {
      return JSON.parse(contactStr);
    } catch (e) {
      return null;
    }
  }
  
  // Get contact ID
  public getContactId(): string | null {
    const contact = this.getContact();
    return contact ? contact.id : null;
  }
  
  // Get auth token
  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  // Logout
  public logout(): void {
    localStorage.removeItem(this.contactKey);
    localStorage.removeItem(this.authStateKey);
    localStorage.removeItem(this.tokenKey);
  }
  
  // Verify contact with verification code
  public async verifyContact(email: string, code: string): Promise<boolean> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would verify this with your backend
      // For demo purposes, we'll accept any non-empty code
      if (!email || !code) return false;
      
      // Simple validation: code must be 6 digits
      if (!/^\d{6}$/.test(code)) return false;
      
      // Create a contact record
      const contactId = `contact_${Date.now()}`;
      localStorage.setItem(this.contactKey, JSON.stringify({
        id: contactId,
        email,
        authenticated: true,
        authenticatedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString()
      }));
      
      // Update auth state
      localStorage.setItem(this.authStateKey, 'authenticated');
      
      return true;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }
  
  // Request verification code
  public async requestVerificationCode(email: string): Promise<boolean> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you would call your backend to send a verification code
      if (!email || !this.isValidEmail(email)) return false;
      
      // For demo purposes, we'll just return success
      console.log(`Verification code requested for: ${email}`);
      return true;
    } catch (error) {
      console.error('Request verification code error:', error);
      return false;
    }
  }
  
  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const contactAuth = new ContactAuth();
export default contactAuth;
