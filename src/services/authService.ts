
/**
 * Centralized Authentication Service
 * Handles all authentication-related functionality using localStorage only (no cookies)
 */
import { jwtDecode } from "jwt-decode";
import { HttpClient } from "@/api/services/http";

// Token Constants
const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const ROLE_KEY = "role";
const WORKSPACE_ID_KEY = "workspaceId";

/**
 * Set the authentication token in localStorage
 */
export const setAuthToken = (token: string): boolean => {
  try {
    if (!token) {
      console.error("Cannot set empty token");
      return false;
    }

    // Store token in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    console.log("Auth token set successfully");

    // Configure axios with the new token
    HttpClient.setAxiosDefaultConfig(token);
    return true;
  } catch (error) {
    console.error("Error setting auth token:", error);
    return false;
  }
};

/**
 * Get the stored authentication token
 */
export const getAuthToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

/**
 * Check if user is authenticated
 * Verifies the existence of a token and that it's not expired
 */
export const isAuthenticated = (): boolean => {
  try {
    const token = getAuthToken();
    if (!token) return false;
    
    // Check if token is expired
    return !isTokenExpired();
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

/**
 * Check if the current token is expired
 */
export const isTokenExpired = (): boolean => {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    // First check if the token has the right format for JWT
    if (!token.includes('.')) {
      console.warn("Token does not appear to be in JWT format");
      return true;
    }
    
    const decoded = jwtDecode<{exp?: number}>(token);
    if (!decoded || !decoded.exp) {
      console.warn("Token has no expiration claim");
      return true;
    }
    
    // Check if current time is past expiration
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Log out the user
 * Clear all authentication data and redirect to login
 */
export const logout = async (): Promise<void> => {
  try {
    // Attempt to call logout endpoint if we have a token
    const token = getAuthToken();
    if (token) {
      try {
        await HttpClient.apiClient.post('/auth/logout');
        console.log('Logout API call successful');
      } catch (error) {
        console.warn('Logout API call failed, proceeding with local logout', error);
      }
    }
  } catch (error) {
    console.error('Error during logout process:', error);
  } finally {
    // Clear all authentication data
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(WORKSPACE_ID_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    
    // Force page refresh and redirect to sign-in
    window.location.href = "/sign-in";
  }
};

/**
 * Set user ID in localStorage
 */
export const setUserId = (id: string): void => {
  if (id) {
    localStorage.setItem(USER_ID_KEY, id);
  }
};

/**
 * Get user ID from localStorage
 */
export const getUserId = (): string => {
  return localStorage.getItem(USER_ID_KEY) || "";
};

/**
 * Set user role in localStorage
 */
export const setUserRole = (role: string): void => {
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
};

/**
 * Get user role from localStorage
 */
export const getUserRole = (): string => {
  return localStorage.getItem(ROLE_KEY) || "";
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  return getUserRole() === role;
};

/**
 * Check if user is an organization admin
 */
export const isOrganizationAdmin = (): boolean => {
  return hasRole("ORGANIZATION_ADMIN");
};

/**
 * Check if user is a workspace admin
 */
export const isWorkspaceAdmin = (): boolean => {
  return hasRole("WORKSPACE_ADMIN");
};

/**
 * Check if user is a workspace agent
 */
export const isWorkspaceAgent = (): boolean => {
  return hasRole("WORKSPACE_AGENT");
};

// Export all functions as a service object
export const AuthService = {
  setAuthToken,
  getAuthToken,
  isAuthenticated,
  isTokenExpired,
  logout,
  setUserId,
  getUserId,
  setUserRole,
  getUserRole,
  hasRole,
  isOrganizationAdmin,
  isWorkspaceAdmin,
  isWorkspaceAgent
};

export default AuthService;
