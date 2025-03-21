
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
        
        // Only check localStorage for tokens, not for workspace IDs
        if (cname === 'customerToken' || cname === 'token') {
            const localValue = localStorage.getItem(cname);
            if (localValue) {
                console.log(`Retrieved ${cname} from localStorage instead of cookie`);
                return localValue;
            }
        }
    } catch (error) {
        console.error("Error accessing cookie:", error);
        
        // Only try localStorage as fallback for tokens
        if (cname === 'customerToken' || cname === 'token') {
            const localValue = localStorage.getItem(cname);
            if (localValue) {
                console.log(`Retrieved ${cname} from localStorage due to cookie error`);
                return localValue;
            }
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
        
        // Only store tokens in localStorage as backup, not workspace IDs
        if (cname === 'customerToken' || cname === 'token') {
            localStorage.setItem(cname, cvalue);
        }
        
        try {
            // Try to set the cookie
            const cookieString = `${cname}=${cvalue};${expires};path=/;SameSite=Lax`;
            document.cookie = cookieString;
            console.log(`Setting cookie ${cname}: ${cvalue ? (cvalue.length > 10 ? cvalue.substring(0, 10) + '...' : cvalue) : "empty"}`);
        } catch (cookieError) {
            console.warn(`Couldn't set cookie for ${cname}, using localStorage only:`, cookieError);
            // We already saved to localStorage above for tokens
        }
    } catch (error) {
        console.error("Critical error setting cookie:", error);
        // Last attempt to save tokens in localStorage
        if (cname === 'customerToken' || cname === 'token') {
            try {
                localStorage.setItem(cname, cvalue);
            } catch (localError) {
                console.error("Failed to save to localStorage as well:", localError);
            }
        }
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
    sessionStorage.removeItem("token");
    
    console.log("User logged out");
    
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
