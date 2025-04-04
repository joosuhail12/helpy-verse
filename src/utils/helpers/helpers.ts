
/**
 * Common utility helpers used throughout the application
 */
import { cookieFunctions } from "@/api/services/http";

// Re-export storage functions from cookieManager to avoid circular dependencies
export const { getCookie, setCookie, handleLogout } = cookieFunctions;

// Base64 encoding for email addresses (simple obfuscation)
export const encryptBase64 = (text: string): string => {
  return window.btoa(unescape(encodeURIComponent(text)));
};

// Base64 decoding
export const decryptBase64 = (encoded: string): string => {
  try {
    return decodeURIComponent(escape(window.atob(encoded)));
  } catch (e) {
    console.error("Error decoding base64:", e);
    return "";
  }
};

// Set workspace ID in localStorage
export const setWorkspaceId = (workspaceId: string): void => {
  if (!workspaceId) return;
  
  // Set in localStorage
  localStorage.setItem("workspaceId", workspaceId);
  console.log(`Workspace ID set to: ${workspaceId}`);
};

// Format date to a readable format
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

// Check if running in development mode
export const isDevelopment = (): boolean => {
  return import.meta.env.MODE === 'development';
};

// Handle setting token - direct implementation to avoid circular dependency
export const handleSetToken = (token: string): boolean => {
  if (!token) {
    console.error("Cannot set empty token");
    return false;
  }
  
  try {
    console.log("Setting auth token:", token.substring(0, 10) + "...");
    
    // Store in localStorage only
    localStorage.setItem("token", token);
    
    // The token manager will configure axios with this token
    return true;
  } catch (error) {
    console.error("Error setting token:", error);
    return false;
  }
};
