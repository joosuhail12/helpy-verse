
import { getCookie, setCookie, deleteCookie } from '../cookies/cookieManager';

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCookie("customerToken");
};

// Get token
export const getToken = (): string | null => {
  return getCookie("customerToken");
};

// Set token with optional expiration
export const handleSetToken = (token: string, expiryDays: number = 30): void => {
  setCookie("customerToken", token, expiryDays);
  
  // Also store in localStorage for additional redundancy
  try {
    localStorage.setItem("customerToken", token);
  } catch (error) {
    console.error("Error storing token in localStorage:", error);
  }
};

// Alias for getToken to maintain compatibility with other code that uses getAuthToken
export const getAuthToken = getToken;

// Handle logout
export const handleLogout = (): void => {
  // Remove auth token
  deleteCookie("customerToken");
  
  // Clear any other auth-related items from localStorage
  localStorage.removeItem("userProfile");
  localStorage.removeItem("permissions");
  localStorage.removeItem("customerToken");
  
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

// Get user ID from token
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = parseToken(token);
    return payload?.sub || payload?.userId || null;
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
};

// Get user role from token
export const getUserRoleFromToken = (token: string): string | null => {
  try {
    const payload = parseToken(token);
    return payload?.role || null;
  } catch (error) {
    console.error('Error extracting user role from token:', error);
    return null;
  }
};

// Get token expiration time
export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = parseToken(token);
    if (!payload || !payload.exp) return null;
    
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return null;
  }
};
