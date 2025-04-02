
/**
 * Common utility helpers used throughout the application
 */
import { setCookie, getCookie } from "@/api/services/http/cookieManager";
import { handleLogout } from "@/utils/auth/tokenManager";
import { handleSetToken as tokenSetToken } from "@/utils/auth/tokenManager";

// Export imported functions
export { setCookie, getCookie, handleLogout };
export { tokenSetToken as handleSetToken };

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
