
/**
 * Storage management utilities to handle authentication tokens and other data
 * Now using only localStorage (no cookies)
 */

// Helper function to get data from localStorage
export const getCookie = (name: string): string => {
    try {
        const localValue = localStorage.getItem(name);
        if (localValue) {
            console.log(`Retrieved ${name} from localStorage`);
            return localValue;
        }
    } catch (error) {
        console.error("Error accessing localStorage:", error);
    }
    
    return "";
};

// Helper function to set data in localStorage
export const setCookie = (name: string, value: string, exdays: number = 30): void => {
    try {
        // Store in localStorage only
        localStorage.setItem(name, value);
        console.log(`Set ${name} in localStorage successfully`);
    } catch (error) {
        console.error("Error setting localStorage:", error);
    }
};

// Logout function to clear local storage
export const handleLogout = (): void => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("workspaceId");
    localStorage.removeItem("customerToken");
    sessionStorage.removeItem("token");
    
    console.log("User logged out - localStorage cleared");
    
    // Use direct navigation for reliability
    window.location.href = "/sign-in";
};

// Export helper functions to reduce circular dependencies
export const cookieFunctions = {
    getCookie,
    setCookie,
    handleLogout
};
