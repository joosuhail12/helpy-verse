
/**
 * Common utility helpers used throughout the application
 */
import { cookieFunctions } from "@/api/services/http";
import { handleSetToken as tokenManagerSetToken } from "@/utils/auth/tokenManager";

// Re-export cookie functions from cookieManager to avoid circular dependencies
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

// Set workspace ID in localStorage (not cookie) for reliability
export const setWorkspaceId = (workspaceId: string): void => {
  if (!workspaceId) return;
  
  // Set in localStorage
  localStorage.setItem("workspaceId", workspaceId);
  
  console.log(`Workspace ID set to: ${workspaceId}`);
};

// Re-export the token manager's handleSetToken function
export const handleSetToken = tokenManagerSetToken;

// Format date to a readable format
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

// Check if running in development mode
export const isDevelopment = (): boolean => {
  return import.meta.env.MODE === 'development';
};
