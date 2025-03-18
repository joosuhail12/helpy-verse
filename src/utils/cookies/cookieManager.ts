
/**
 * Cookie management utility functions
 */

// 🟢 Get Cookie
export const getCookie = (cname: string): string => {
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
    
    console.log(`Getting cookie ${cname}: not found`);
    return "";
};

// 🟢 Set Cookie
export const setCookie = (cname: string, cvalue: string, exdays: number = 30): void => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    const cookieString = `${cname}=${cvalue};${expires};path=/;SameSite=Lax`;
    document.cookie = cookieString;
    console.log(`Setting cookie ${cname}: ${cvalue ? "value set" : "empty"}`);
};

// 🟢 Delete Cookie
export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    console.log(`Deleted cookie ${name}`);
};

// Check if cookie exists - new helper function
export const cookieExists = (name: string): boolean => {
    return getCookie(name) !== "";
};
