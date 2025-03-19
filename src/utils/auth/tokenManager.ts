
/**
 * Token and authentication management utility functions
 */
import { HttpClient, cookieFunctions } from "@/api/services/http";
import { jwtDecode } from "jwt-decode";

// Get cookie helpers from HttpClient to avoid circular dependencies
const { getCookie, setCookie } = cookieFunctions;

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
        // Always clear local tokens regardless of API call success
        cookieFunctions.handleLogout();
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
        
        // Try to decode the token to validate and extract expiry
        try {
            const decoded = jwtDecode(token);
            const expiry = decoded.exp;
            
            if (expiry && typeof expiry === 'number') {
                // Calculate days until expiry for cookie
                const now = Math.floor(Date.now() / 1000);
                const secondsUntilExpiry = expiry - now;
                const daysUntilExpiry = Math.max(1, Math.floor(secondsUntilExpiry / (60 * 60 * 24)));
                
                console.log(`Token valid for approximately ${daysUntilExpiry} days`);
                
                // Set the cookie with proper expiration from JWT
                setCookie("customerToken", token, daysUntilExpiry);
            } else {
                // Fallback to 30 day expiry if we couldn't extract from token
                setCookie("customerToken", token, 30);
            }
        } catch (decodeError) {
            console.warn("Could not decode token, using default expiry", decodeError);
            // Set the cookie with a long expiration (30 days)
            setCookie("customerToken", token, 30);
        }
        
        // Also store in localStorage as backup
        localStorage.setItem("token", token);
        
        // Configure axios with the new token
        if (HttpClient && HttpClient.setAxiosDefaultConfig) {
            HttpClient.setAxiosDefaultConfig(token);
        }
        
        // Verify that the token was set correctly
        const tokenInCookie = getCookie("customerToken");
        const tokenInStorage = localStorage.getItem("token");
        
        console.log("Token verification:", {
            cookie: !!tokenInCookie,
            localStorage: !!tokenInStorage
        });
        
        return !!tokenInCookie || !!tokenInStorage; // Consider successful if either is set
    } catch (error) {
        console.error("Error setting token:", error);
        
        // Even if cookie setting fails, we still have localStorage as backup
        return !!localStorage.getItem("token");
    }
};

// 🟢 Check if user is authenticated - check both cookie and localStorage
export const isAuthenticated = (): boolean => {
    try {
        const tokenInCookie = !!getCookie("customerToken");
        const tokenInStorage = !!localStorage.getItem("token");
        
        // Consider authenticated if token exists in either place
        return tokenInCookie || tokenInStorage;
    } catch (error) {
        // If cookie access fails (e.g., in some cross-origin contexts), fall back to localStorage
        return !!localStorage.getItem("token");
    }
};

// 🟢 Get auth token - prioritize cookie, fall back to localStorage
export const getAuthToken = (): string => {
    try {
        const cookieToken = getCookie("customerToken");
        if (cookieToken) return cookieToken;
    } catch (error) {
        console.warn("Error accessing cookie:", error);
    }
    
    // Fall back to localStorage
    const storageToken = localStorage.getItem("token");
    if (storageToken) {
        // If token only exists in localStorage, try to sync it to cookie
        try {
            setCookie("customerToken", storageToken);
        } catch (error) {
            console.warn("Failed to sync token to cookie:", error);
        }
        return storageToken;
    }
    
    return "";
};

// Check if token is expired
export const isTokenExpired = (): boolean => {
    const token = getAuthToken();
    if (!token) return true;
    
    try {
        const decoded = jwtDecode<{exp: number}>(token);
        if (!decoded.exp) return true;
        
        // Check if current time is past expiration
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Error checking token expiration:", error);
        return true; // If we can't decode, consider it expired
    }
};

// 🟢 Workspace ID Management
export const setWorkspaceId = (id: string): void => {
    if (id) {
        try {
            setCookie("workspaceId", id);
        } catch (error) {
            console.warn("Error setting workspace cookie, using localStorage:", error);
            localStorage.setItem("workspaceId", id);
        }
    }
};

export const getWorkspaceId = (): string => {
    try {
        const cookieId = getCookie("workspaceId");
        if (cookieId) return cookieId;
    } catch (error) {
        console.warn("Error accessing workspace cookie:", error);
    }
    
    return localStorage.getItem("workspaceId") || "";
};

// 🟢 Role Checks
export const isOrganizationAdmin = (): boolean => localStorage.getItem("role") === "ORGANIZATION_ADMIN";
export const isWorkspaceAdmin = (): boolean => localStorage.getItem("role") === "WORKSPACE_ADMIN";
export const isWorkspaceAgent = (): boolean => localStorage.getItem("role") === "WORKSPACE_AGENT";

// 🟢 Get User ID
export const getUserId = (): string | null => localStorage.getItem("userId");
