
/**
 * Cookie management utility functions
 */

// Cookie Functions
export const cookieFunctions = {
  setCookie: (name: string, value: string, days: number = 7): void => {
    try {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = "; expires=" + date.toUTCString();
      document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  },

  getCookie: (name: string): string => {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
      }
    } catch (error) {
      console.error("Error getting cookie:", error);
    }
    return "";
  },

  deleteCookie: (name: string): void => {
    try {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    } catch (error) {
      console.error("Error deleting cookie:", error);
    }
  }
};

// Import from interceptors instead of creating circular dependency
import { handleLogout as logoutFromInterceptors } from './interceptors';

// Re-export the logout function
export const handleLogout = logoutFromInterceptors;

// Helper function to set workspaceId in localStorage
export const setWorkspaceId = (id: string): void => {
  if (id) {
    try {
      localStorage.setItem("workspaceId", id);
      console.log("Workspace ID set:", id);
    } catch (error) {
      console.error("Error setting workspace ID:", error);
    }
  }
};

// Helper function to get workspaceId from localStorage
export const getWorkspaceId = (): string => {
  try {
    return localStorage.getItem("workspaceId") || "";
  } catch (error) {
    console.error("Error getting workspace ID:", error);
    return "";
  }
};
