
/**
 * Token and authentication management utility functions
 */
import { HttpClient, cookieFunctions } from "@/api/services/http";
import { jwtDecode } from "jwt-decode";

// Get cookie helpers from HttpClient to avoid circular dependencies
const { getCookie, setCookie } = cookieFunctions;

// 🟢 Logout User
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
    // Clear workspace ID from localStorage
    localStorage.removeItem("workspaceId");
    console.log("Cleared workspace ID from localStorage");
    
    // Always clear local tokens regardless of API call success
    cookieFunctions.handleLogout();
  }
};

// 🟢 Set Auth Token
export const handleSetToken = (token: string): boolean => {
  // Check if token is valid
  if (!token) {
    console.error("Cannot set empty token");
    return false;
  }
  
  try {
    console.log("Setting auth token:", token.substring(0, 10) + "...");
    
    // Always store in localStorage first as a reliable backup
    localStorage.setItem("token", token);
    
    // Try to set in cookies (this may fail in some environments)
    try {
      setCookie("customerToken", token, 30);
    } catch (cookieError) {
      console.warn("Could not set cookie, using localStorage only", cookieError);
      // Already saved to localStorage above
    }
    
    // Configure axios with the new token
    if (HttpClient && HttpClient.setAxiosDefaultConfig) {
      HttpClient.setAxiosDefaultConfig(token);
    }
    
    return true;
  } catch (error) {
    console.error("Error setting token:", error);
    return false;
  }
};

// 🟢 Check if user is authenticated - check both cookie and localStorage
export const isAuthenticated = (): boolean => {
  try {
    const tokenInCookie = !!getCookie("customerToken");
    const tokenInStorage = !!localStorage.getItem("token");
    
    // Consider authenticated if token exists in either place
    return tokenInCookie || tokenInStorage;
  } catch (error) {
    // If cookie access fails, fall back to localStorage
    return !!localStorage.getItem("token");
  }
};

// 🟢 Get auth token - prioritize localStorage for reliability
export const getAuthToken = (): string => {
  // Prioritize localStorage for more reliable token access
  const storageToken = localStorage.getItem("token");
  if (storageToken) {
    return storageToken;
  }
  
  // Fall back to cookie if needed
  try {
    const cookieToken = getCookie("customerToken");
    if (cookieToken) {
      // Sync to localStorage for future reliability
      localStorage.setItem("token", cookieToken);
      return cookieToken;
    }
  } catch (error) {
    console.warn("Error accessing cookie:", error);
  }
  
  return "";
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

// 🟢 Workspace ID Management - Use localStorage instead of cookies
export const setWorkspaceId = (id: string): void => {
  if (id) {
    // Only set in localStorage, not cookies
    try {
      localStorage.setItem("workspaceId", id);
      console.log("Workspace ID set in localStorage:", id);
    } catch (error) {
      console.error("Error setting workspace ID in localStorage:", error);
    }
  }
};

export const getWorkspaceId = (): string => {
  // Only check localStorage, not cookies
  try {
    const storageId = localStorage.getItem("workspaceId");
    if (storageId) {
      console.log("Got workspace ID from localStorage:", storageId);
      return storageId;
    }
  } catch (error) {
    console.warn("Error accessing workspace ID in localStorage:", error);
  }
  
  // Return empty string if no workspace ID found in localStorage
  return "";
};

// 🟢 Role Checks
export const isOrganizationAdmin = (): boolean => localStorage.getItem("role") === "ORGANIZATION_ADMIN";
export const isWorkspaceAdmin = (): boolean => localStorage.getItem("role") === "WORKSPACE_ADMIN";
export const isWorkspaceAgent = (): boolean => localStorage.getItem("role") === "WORKSPACE_AGENT";

// 🟢 Get User ID
export const getUserId = (): string | null => localStorage.getItem("userId");
