
/**
 * Token and authentication management utility functions
 */
import { HttpClient } from "@/api/services/HttpClient";
import { getCookie, setCookie, deleteCookie, cookieExists } from "../cookies/cookieManager";

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
        console.log("Setting auth token:", token.substring(0, 10) + "...");
        
        // Set the cookie with a long expiration (30 days)
        setCookie("customerToken", token, 30);
        
        // Also store in localStorage as backup
        localStorage.setItem("token", token);
        
        // Configure axios with the new token
        HttpClient.apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Verify that the token was set correctly
        const tokenInCookie = getCookie("customerToken");
        const tokenInStorage = localStorage.getItem("token");
        
        console.log("Token verification:", {
            cookie: !!tokenInCookie,
            localStorage: !!tokenInStorage
        });
        
        return !!tokenInCookie;
    } catch (error) {
        console.error("Error setting token:", error);
        return false;
    }
};

// 🟢 Check if user is authenticated - check both cookie and localStorage
export const isAuthenticated = (): boolean => {
    const tokenInCookie = cookieExists("customerToken");
    const tokenInStorage = !!localStorage.getItem("token");
    
    // Consider authenticated if token exists in either place
    return tokenInCookie || tokenInStorage;
};

// 🟢 Get auth token - prioritize cookie, fall back to localStorage
export const getAuthToken = (): string => {
    const cookieToken = getCookie("customerToken");
    if (cookieToken) return cookieToken;
    
    const storageToken = localStorage.getItem("token");
    if (storageToken) {
        // If token only exists in localStorage, sync it to cookie
        setCookie("customerToken", storageToken);
        return storageToken;
    }
    
    return "";
};

// 🟢 Workspace ID Management
export const setWorkspaceId = (id: string): void => {
    if (id) {
        setCookie("workspaceId", id);
    }
};

export const getWorkspaceId = (): string => {
    return getCookie("workspaceId") || "";
};

// 🟢 Role Checks
export const isOrganizationAdmin = (): boolean => localStorage.getItem("role") === "ORGANIZATION_ADMIN";
export const isWorkspaceAdmin = (): boolean => localStorage.getItem("role") === "WORKSPACE_ADMIN";
export const isWorkspaceAgent = (): boolean => localStorage.getItem("role") === "WORKSPACE_AGENT";

// 🟢 Get User ID
export const getUserId = (): string | null => localStorage.getItem("userId");
