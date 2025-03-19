
/**
 * Cookie management utilities to handle authentication tokens and other cookies
 */

// Helper function to get cookies
export const getCookie = (cname: string): string => {
    const name = `${cname}=`;
    try {
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
    } catch (error) {
        console.error("Error accessing cookie:", error);
    }
    
    return "";
};

// Helper function to set cookies
export const setCookie = (cname: string, cvalue: string, exdays: number = 30): void => {
    try {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = `expires=${d.toUTCString()}`;
        
        // Use a more compatible cookie string with explicit path and SameSite
        const cookieString = `${cname}=${cvalue};${expires};path=/;SameSite=Lax`;
        document.cookie = cookieString;
        console.log(`Setting cookie ${cname}: ${cvalue ? (cvalue.length > 10 ? cvalue.substring(0, 10) + '...' : cvalue) : "empty"}`);

        // Verify the cookie was set properly
        const verifyCookie = getCookie(cname);
        if (verifyCookie) {
            console.log(`Cookie ${cname} verified successfully`);
        } else {
            console.error(`Failed to set cookie ${cname}`);
        }
    } catch (error) {
        console.error("Error setting cookie:", error);
    }
};

// Logout function to clear cookies and local storage
export const handleLogout = (): void => {
    // Clear all authentication-related cookies
    document.cookie = `customerToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    document.cookie = `agent_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    document.cookie = `workspaceId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    
    // Force clear browser storage too
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    console.log("User logged out by API client");
    
    // Don't use router here, use direct navigation for reliability
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
