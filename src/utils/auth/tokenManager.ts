
import { cookieFunctions } from "@/api/services/http";

// Get the auth token from localStorage or cookie
export const getAuthToken = (): string => {
  const token = localStorage.getItem("token") || cookieFunctions.getCookie("customerToken");
  return token || "";
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Handle setting the token in localStorage and cookie
export const handleSetToken = (token: string): void => {
  if (!token) {
    console.warn("Attempted to set empty token");
    return;
  }
  
  localStorage.setItem("token", token);
  console.log("Token set in localStorage");
};

// Handle logging out
export const handleLogout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("workspaceId");
  cookieFunctions.handleLogout();
  console.log("User logged out, tokens cleared");
};
