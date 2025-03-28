
/**
 * Cookie management utility functions
 */
import Cookies from 'js-cookie';

// 🟢 Get Cookie
export const getCookie = (cname: string): string => {
    return Cookies.get(cname) || "";
};

// 🟢 Set Cookie
export const setCookie = (cname: string, cvalue: string, exdays: number = 30): void => {
    Cookies.set(cname, cvalue, {
        expires: exdays,
        path: '/',
        sameSite: 'Lax'
    });
    
    console.log(`Setting cookie ${cname}: ${cvalue ? (cvalue.length > 10 ? cvalue.substring(0, 10) + '...' : cvalue) : "empty"}`);

    // Verify the cookie was set properly
    const verifyCookie = getCookie(cname);
    if (verifyCookie) {
        console.log(`Cookie ${cname} verified successfully`);
    } else {
        console.error(`Failed to set cookie ${cname}`);
    }
};

// 🟢 Delete Cookie
export const deleteCookie = (name: string): void => {
    Cookies.remove(name, { path: '/' });
    console.log(`Deleted cookie ${name}`);
    
    // Verify cookie was removed
    const verifyCookie = getCookie(name);
    if (!verifyCookie) {
        console.log(`Cookie ${name} removal verified`);
    } else {
        console.error(`Failed to delete cookie ${name}`);
    }
};

// Check if cookie exists - helper function
export const cookieExists = (name: string): boolean => {
    return getCookie(name) !== "";
};
