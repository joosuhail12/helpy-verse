
/**
 * Cookie management utilities to handle authentication tokens and other cookies
 */

// Helper function to get cookies
export const getCookie = (cname: string): string => {
    try {
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
        
        // Also check localStorage as fallback
        const localValue = localStorage.getItem(cname);
        if (localValue) {
            console.log(`Retrieved ${cname} from localStorage instead of cookie`);
            return localValue;
        }
    } catch (error) {
        console.error("Error accessing cookie:", error);
        // Try localStorage as fallback
        const localValue = localStorage.getItem(cname);
        if (localValue) {
            console.log(`Retrieved ${cname} from localStorage due to cookie error`);
            return localValue;
        }
    }
    
    return "";
};

// Helper function to set cookies
export const setCookie = (cname: string, cvalue: string, exdays: number = 30): void => {
    try {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = `expires=${d.toUTCString()}`;
        
        // Always store in localStorage as a backup
        localStorage.setItem(cname, cvalue);
        
        try {
            // Try to set the cookie
            const cookieString = `${cname}=${cvalue};${expires};path=/;SameSite=Lax`;
            document.cookie = cookieString;
            console.log(`Setting cookie ${cname}: ${cvalue ? (cvalue.length > 10 ? cvalue.substring(0, 10) + '...' : cvalue) : "empty"}`);
        } catch (cookieError) {
            console.warn(`Couldn't set cookie for ${cname}, using localStorage only:`, cookieError);
            // We already saved to localStorage above, so no need to do anything else
        }
    } catch (error) {
        console.error("Critical error setting cookie:", error);
        // Last attempt to save in localStorage
        try {
            localStorage.setItem(cname, cvalue);
        } catch (localError) {
            console.error("Failed to save to localStorage as well:", localError);
        }
    }
};

// Improved logout function to clear cookies and local storage
export const handleLogout = (): void => {
    // Clear all authentication-related cookies
    try {
        // First, explicitly set each cookie to an empty value with an expired date
        document.cookie = `customerToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
        document.cookie = `agent_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
        document.cookie = `workspaceId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
        
        // Clear any other potential auth-related cookies
        document.cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
        document.cookie = `refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    } catch (error) {
        console.warn("Error clearing cookies:", error);
    }
    
    // Clear localStorage
    const keysToRemove = [
        "token", 
        "customerToken", 
        "workspaceId", 
        "agent_email", 
        "userId", 
        "role", 
        "refreshToken"
    ];
    
    keysToRemove.forEach(key => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn(`Error removing ${key} from localStorage:`, error);
        }
    });
    
    // Also clear sessionStorage
    try {
        sessionStorage.clear();
    } catch (error) {
        console.warn("Error clearing sessionStorage:", error);
    }
    
    console.log("User logged out - all credentials cleared");
    
    // Use direct navigation for reliability
    setTimeout(() => {
        window.location.href = "/sign-in";
    }, 100);
};

// Export cookie helper functions to reduce circular dependencies
export const cookieFunctions = {
    getCookie,
    setCookie,
    handleLogout
};
