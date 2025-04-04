
/**
 * Common utility helpers used throughout the application
 */

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

// Set/get cookie functions that use localStorage
export const setCookie = (name: string, value: string, exdays: number = 30): void => {
  try {
    localStorage.setItem(name, value);
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
};

export const getCookie = (name: string): string => {
  try {
    const localValue = localStorage.getItem(name);
    if (localValue) {
      return localValue;
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
  return "";
};

// Set workspace ID in localStorage
export const setWorkspaceId = (workspaceId: string): void => {
  if (!workspaceId) return;
  
  // Set in localStorage
  localStorage.setItem("workspaceId", workspaceId);
  console.log(`Workspace ID set to: ${workspaceId}`);
};

// Set token function
export const handleSetToken = (token: string): boolean => {
  if (!token) {
    console.error("Cannot set empty token");
    return false;
  }
  
  try {
    console.log("Setting auth token in localStorage");
    localStorage.setItem("token", token);
    return true;
  } catch (error) {
    console.error("Error setting token:", error);
    return false;
  }
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
