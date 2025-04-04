
import { setCookie, deleteCookie as removeCookie, getCookie } from '../cookies/cookieManager';

/**
 * Set an authentication cookie
 * @param token The authentication token to store
 * @param expiryDays Number of days until cookie expiration
 */
export const setAuthCookie = (token: string, expiryDays: number = 30) => {
  setCookie('customerToken', token, expiryDays);
};

/**
 * Clear the authentication cookie
 */
export const clearAuthCookie = () => {
  removeCookie('customerToken');
};

// Re-export existing cookie functions for convenience
export { setCookie, getCookie, removeCookie } from '../cookies/cookieManager';
