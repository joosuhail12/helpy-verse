
/**
 * Validation utility functions for emails, URLs, etc.
 */

// 🟢 Email Validator
export const isEmail = (email: string): boolean => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

// 🟢 URL Validator
export const isValidHttpUrl = (str: string): boolean => {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
};

// 🟢 Extract Name from URL
export const getNameFromUrl = (url: string): string => {
    const regex = /[http,https]:\/\/(.+?)\./;
    const match = url.match(regex);
    return match ? match[1] : "";
};
