
import { getCookie, removeCookie } from '../helpers/helpers';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCookie("customerToken");
};

// Get token
export const getToken = (): string | null => {
  return getCookie("customerToken");
};

// Handle logout
export const handleLogout = (): void => {
  // Remove auth token
  removeCookie("customerToken");
  
  // Clear any other auth-related items from localStorage
  localStorage.removeItem("userProfile");
  localStorage.removeItem("permissions");
  
  // Dispatch a logout event that can be caught by other components
  const logoutEvent = new CustomEvent('user:logout');
  window.dispatchEvent(logoutEvent);
};

// Parse JWT token to get payload
export const parseToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = parseToken(token);
    if (!payload || !payload.exp) return true;
    
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if there's an error
  }
};
