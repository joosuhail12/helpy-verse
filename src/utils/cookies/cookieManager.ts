
/**
 * Cookie management utility functions
 */

// 🟢 Get Cookie
export const getCookie = (cname: string): string => {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cname}=`))
        ?.split("=")[1]
        ?.trim() || "";
    
    console.log(`Getting cookie ${cname}:`, !!cookieValue);
    return cookieValue;
};

// 🟢 Set Cookie
export const setCookie = (cname: string, cvalue: string, exdays: number = 30): void => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    const cookieString = `${cname}=${cvalue};${expires};path=/;SameSite=Lax`;
    document.cookie = cookieString;
    console.log(`Setting cookie ${cname}:`, cookieString);
};

// 🟢 Delete Cookie
export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    console.log(`Deleted cookie ${name}`);
};
