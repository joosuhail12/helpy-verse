
/**
 * Token and authentication management utility functions
 */
import { HttpClient } from "@/api/services/HttpClient";
import { getCookie, setCookie, deleteCookie } from "../cookies/cookieManager";

// 🟢 Logout User
export const handleLogout = (): void => {
    // Clear all authentication-related cookies
    deleteCookie("customerToken");
    deleteCookie("agent_email");
    deleteCookie("workspaceId");
    
    // Reset HTTP client configuration - clear Authorization header
    delete HttpClient.apiClient.defaults.headers.common["Authorization"];
    console.log("Cleared Authorization headers during logout");
    
    // Force clear browser storage too
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    console.log("User logged out");
    
    // Don't use router here, use direct navigation for reliability
    setTimeout(() => {
        window.location.href = "/sign-in";
    }, 100);
};

// 🟢 Set Auth Token
export const handleSetToken = (token: string): boolean => {
    // Check if token is valid
    if (!token) {
        console.error("Cannot set empty token");
        return false;
    }
    
    try {
        // Set the cookie with a long expiration (30 days)
        setCookie("customerToken", token, 30);
        
        // Also store in localStorage as backup
        localStorage.setItem("token", token);
        
        // Configure axios with the new token - both in the default config and the specific client
        HttpClient.apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        HttpClient.setAxiosDefaultConfig();
        
        console.log("Token set successfully:", !!token);
        console.log("Authorization header set for future requests");
        return true;
    } catch (error) {
        console.error("Error setting token:", error);
        return false;
    }
};

// 🟢 Workspace ID Management
export const setWorkspaceId = (id: string): void => {
    setCookie("workspaceId", id);
};

export const getWorkspaceId = (): string => {
    return getCookie("workspaceId");
};

// 🟢 Role Checks
export const isOrganizationAdmin = (): boolean => localStorage.getItem("role") === "ORGANIZATION_ADMIN";
export const isWorkspaceAdmin = (): boolean => localStorage.getItem("role") === "WORKSPACE_ADMIN";
export const isWorkspaceAgent = (): boolean => localStorage.getItem("role") === "WORKSPACE_AGENT";

// 🟢 Get User ID
export const getUserId = (): string | null => localStorage.getItem("userId");
