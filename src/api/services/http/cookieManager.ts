
/**
 * Storage management utilities to handle authentication tokens and other data
 * Now using localStorage with js-cookie fallback
 */
import Cookies from 'js-cookie';

// Helper function to get data from localStorage with cookie fallback
export const getCookie = (name: string): string => {
    try {
        // First try localStorage
        const localValue = localStorage.getItem(name);
        if (localValue) {
            console.log(`Retrieved ${name} from localStorage`);
            return localValue;
        }
        
        // Fall back to cookies
        const cookieValue = Cookies.get(name);
        if (cookieValue) {
            console.log(`Retrieved ${name} from cookie`);
            return cookieValue;
        }
    } catch (error) {
        console.error("Error accessing storage:", error);
    }
    
    return "";
};

// Helper function to set data in localStorage with cookie fallback
export const setCookie = (name: string, value: string, exdays: number = 30): void => {
    try {
        // Store in localStorage
        localStorage.setItem(name, value);
        console.log(`Set ${name} in localStorage successfully`);
        
        // Also set as cookie for older browser compatibility
        Cookies.set(name, value, {
            expires: exdays,
            path: '/',
            sameSite: 'Lax'
        });
    } catch (error) {
        console.error("Error setting storage:", error);
        
        // If localStorage fails, try cookie only
        try {
            Cookies.set(name, value, {
                expires: exdays,
                path: '/',
                sameSite: 'Lax'
            });
            console.log(`Fallback: Set ${name} as cookie`);
        } catch (cookieError) {
            console.error("Error setting cookie:", cookieError);
        }
    }
};

// Logout function to clear storage
export const handleLogout = (): void => {
    // Clear localStorage
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("workspaceId");
        localStorage.removeItem("customerToken");
        sessionStorage.removeItem("token");
    } catch (error) {
        console.error("Error clearing localStorage:", error);
    }
    
    // Clear cookies
    try {
        Cookies.remove("token", { path: '/' });
        Cookies.remove("userId", { path: '/' });
        Cookies.remove("role", { path: '/' });
        Cookies.remove("workspaceId", { path: '/' });
        Cookies.remove("customerToken", { path: '/' });
    } catch (error) {
        console.error("Error clearing cookies:", error);
    }
    
    console.log("User logged out - storage cleared");
    
    // Use direct navigation for reliability
    window.location.href = "/sign-in";
};

// Export helper functions to reduce circular dependencies
export const cookieFunctions = {
    getCookie,
    setCookie,
    handleLogout
};
