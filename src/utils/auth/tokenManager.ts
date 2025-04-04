
/**
 * Token and authentication management utility functions
 */
import { HttpClient } from "@/api/services/http";
import { cookieFunctions } from "@/api/services/http/cookieManager";
import { jwtDecode } from "jwt-decode";

// Get storage helpers from cookieFunctions to avoid circular dependencies
const { getCookie, setCookie } = cookieFunctions;

// Logout User
export const handleLogout = async (): Promise<void> => {
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
    // Clear all tokens and storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("workspaceId");
    sessionStorage.removeItem("token");
    
    console.log("User logged out - cleared all tokens and storage");
    
    // Force page refresh and redirect to sign-in
    window.location.href = "/sign-in";
  }
};

// Set Auth Token
export const handleSetToken = (token: string): boolean => {
  // Check if token is valid
  if (!token) {
    console.error("Cannot set empty token");
    return false;
  }
  
  try {
    console.log("Setting auth token");
    
    // Store in localStorage only
    localStorage.setItem("token", token);
    
    // Configure axios with the new token
    try {
      if (HttpClient && HttpClient.setAxiosDefaultConfig) {
        HttpClient.setAxiosDefaultConfig(token);
      } else {
        console.warn("HttpClient or setAxiosDefaultConfig is not available");
      }
    } catch (error) {
      console.error("Error configuring Axios with token:", error);
    }
    
    return true;
  } catch (error) {
    console.error("Error setting token:", error);
    return false;
  }
};

// Check if user is authenticated - check localStorage only for simplicity
export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem("token");
    const hasToken = !!token;
    console.log(`isAuthenticated check: Token ${hasToken ? 'exists' : 'does not exist'}`);
    return hasToken;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Get auth token - from localStorage only
export const getAuthToken = (): string => {
  try {
    const storageToken = localStorage.getItem("token");
    return storageToken || "";
  } catch (error) {
    console.error("Error getting auth token:", error);
    return "";
  }
};

// Check if token is expired - safer version that handles invalid tokens
export const isTokenExpired = (): boolean => {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    // First check if the token has the right format for JWT
    if (!token.includes('.')) {
      console.warn("Token does not appear to be in JWT format");
      return true; // Consider non-JWT tokens as expired
    }
    
    // Now try to decode it
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
    // To be safe, we'll consider any token we can't validate as expired
    return true;
  }
};

// Workspace ID Management - Use localStorage
export const setWorkspaceId = (id: string): void => {
  if (id) {
    localStorage.setItem("workspaceId", id);
  }
};

export const getWorkspaceId = (): string => {
  return localStorage.getItem("workspaceId") || "";
};

// Role Checks
export const isOrganizationAdmin = (): boolean => localStorage.getItem("role") === "ORGANIZATION_ADMIN";
export const isWorkspaceAdmin = (): boolean => localStorage.getItem("role") === "WORKSPACE_ADMIN";
export const isWorkspaceAgent = (): boolean => localStorage.getItem("role") === "WORKSPACE_AGENT";

// Get User ID
export const getUserId = (): string | null => localStorage.getItem("userId");
