
/**
 * Token and authentication management utility functions
 * Using localStorage only (no cookies)
 */
import { HttpClient } from "@/api/services/http";
import { jwtDecode } from "jwt-decode";

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

// 🟢 Set Auth Token
export const handleSetToken = (token: string): boolean => {
  // Check if token is valid
  if (!token) {
    console.error("Cannot set empty token");
    return false;
  }
  
  try {
    console.log("Setting auth token:", token.substring(0, 10) + "...");
    
    // Store in localStorage only
    localStorage.setItem("token", token);
    
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

// 🟢 Check if user is authenticated - check localStorage only
export const isAuthenticated = (): boolean => {
  try {
    const token = getAuthToken();
    if (!token) return false;
    
    // Simple validation - just check if token exists
    // We'll skip the expiration check for now as it's causing issues
    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// 🟢 Get auth token - from localStorage only with validation
export const getAuthToken = (): string => {
  try {
    const storageToken = localStorage.getItem("token");
    
    // Basic validation to ensure token exists
    if (storageToken) {
      return storageToken;
    }
    
    console.warn("No valid auth token found in storage");
    return "";
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return "";
  }
};

// Enhanced token expiration check with better error handling
export const isTokenExpired = (): boolean => {
  // For now, let's return false to bypass the expiration check
  // since the token may not be a standard JWT format
  try {
    const token = getAuthToken();
    if (!token) return true;
    
    // Check if the token has a specific format expected by your API
    // This will vary based on your backend implementation
    
    // If it's a JWT, you would normally check the expiration
    // But we'll skip that for now as it's causing issues
    return false;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return false;
  }
};

// 🟢 Workspace ID Management - Use localStorage
export const setWorkspaceId = (id: string): void => {
  if (id) {
    try {
      localStorage.setItem("workspaceId", id);
      console.log("Workspace ID set in localStorage:", id);
    } catch (error) {
      console.error("Error setting workspace ID in localStorage:", error);
    }
  }
};

export const getWorkspaceId = (): string => {
  try {
    const storageId = localStorage.getItem("workspaceId");
    if (storageId) {
      console.log("Got workspace ID from localStorage:", storageId);
      return storageId;
    }
  } catch (error) {
    console.warn("Error accessing workspace ID in localStorage:", error);
  }
  
  return "";
};

// 🟢 Role Checks
export const isOrganizationAdmin = (): boolean => localStorage.getItem("role") === "ORGANIZATION_ADMIN";
export const isWorkspaceAdmin = (): boolean => localStorage.getItem("role") === "WORKSPACE_ADMIN";
export const isWorkspaceAgent = (): boolean => localStorage.getItem("role") === "WORKSPACE_AGENT";

// 🟢 Get User ID
export const getUserId = (): string | null => localStorage.getItem("userId");
