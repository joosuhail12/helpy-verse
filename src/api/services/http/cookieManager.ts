
/**
 * Cookie management utilities to handle authentication tokens and other cookies
 */

// Helper function to get cookies with localStorage fallback
export const getCookie = (cname: string): string => {
    try {
        // Try to get from cookie first
        const name = `${cname}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        
        // If not found in cookie, check localStorage for all values
        const localValue = localStorage.getItem(cname);
        if (localValue) {
            console.log(`Retrieved ${cname} from localStorage instead of cookie`);
            return localValue;
        }
    } catch (error) {
        console.error("Error accessing cookie:", error);
        
        // Fall back to localStorage
        const localValue = localStorage.getItem(cname);
        if (localValue) {
            console.log(`Retrieved ${cname} from localStorage due to cookie error`);
            return localValue;
        }
    }
    
    return "";
};

// Helper function to set cookies with localStorage backup
export const setCookie = (cname: string, cvalue: string, exdays: number = 30): void => {
    try {
        // Always store in localStorage first (this is more reliable)
        localStorage.setItem(cname, cvalue);
        console.log(`Set ${cname} in localStorage successfully`);
        
        // Then try to set the cookie as well
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = `expires=${d.toUTCString()}`;
        
        try {
            // Try to set the cookie with secure settings
            const cookieString = `${cname}=${cvalue};${expires};path=/;SameSite=Lax`;
            document.cookie = cookieString;
            console.log(`Attempted to set cookie ${cname}: ${cvalue ? (cvalue.length > 10 ? cvalue.substring(0, 10) + '...' : cvalue) : "empty"}`);
        } catch (cookieError) {
            console.warn(`Couldn't set cookie for ${cname}, but it's safely stored in localStorage`, cookieError);
        }
    } catch (error) {
        console.error("Critical error setting storage:", error);
    }
};

// Logout function to clear cookies and local storage
export const handleLogout = (): void => {
    // Clear all authentication-related cookies
    try {
        document.cookie = `customerToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
        document.cookie = `agent_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
        document.cookie = `workspaceId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    } catch (error) {
        console.warn("Error clearing cookies:", error);
    }
    
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("workspaceId");
    localStorage.removeItem("customerToken");
    sessionStorage.removeItem("token");
    
    console.log("User logged out - storage cleared");
    
    // Use direct navigation for reliability
    window.location.href = "/sign-in";
};

// Export cookie helper functions to reduce circular dependencies
export const cookieFunctions = {
    getCookie,
    setCookie,
    handleLogout
};
