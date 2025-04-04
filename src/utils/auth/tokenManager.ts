
/**
 * Token Manager (LEGACY)
 * This file is maintained for backward compatibility.
 * New code should use src/services/authService.ts instead.
 */

// Constants
const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const ROLE_KEY = "role";
const WORKSPACE_ID_KEY = "workspaceId";

// Re-export basic token functions without directly importing AuthService
export const handleLogout = () => {
  // Clear all authentication data
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(WORKSPACE_ID_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  
  // Force page refresh and redirect to sign-in
  window.location.href = "/sign-in";
};

export const handleSetToken = (token: string): boolean => {
  try {
    if (!token) {
      console.error("Cannot set empty token");
      return false;
    }

    // Store token in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    console.log("Auth token set successfully");
    return true;
  } catch (error) {
    console.error("Error setting auth token:", error);
    return false;
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token; // Simple check for token existence
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

export const getAuthToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const isTokenExpired = (): boolean => {
  // Basic implementation without JWT decode
  return !getAuthToken();
};

// Workspace management
export const setWorkspaceId = (id: string): void => {
  if (id) {
    localStorage.setItem(WORKSPACE_ID_KEY, id);
  }
};

export const getWorkspaceId = (): string => {
  return localStorage.getItem(WORKSPACE_ID_KEY) || "";
};

// Role checks - simplified versions
export const isOrganizationAdmin = (): boolean => {
  return localStorage.getItem(ROLE_KEY) === "ORGANIZATION_ADMIN";
};

export const isWorkspaceAdmin = (): boolean => {
  return localStorage.getItem(ROLE_KEY) === "WORKSPACE_ADMIN";
};

export const isWorkspaceAgent = (): boolean => {
  return localStorage.getItem(ROLE_KEY) === "WORKSPACE_AGENT";
};

// User ID getter
export const getUserId = (): string => {
  return localStorage.getItem(USER_ID_KEY) || "";
};
