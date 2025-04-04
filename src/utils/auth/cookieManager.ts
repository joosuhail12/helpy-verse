
import { setCookie, deleteCookie as removeCookie, getCookie } from '../cookies/cookieManager';

export const setAuthCookie = (token: string, expiryDays: number = 30) => {
  setCookie('customerToken', token, expiryDays);
};

export const clearAuthCookie = () => {
  removeCookie('customerToken');
};

// Re-export existing cookie functions for convenience
export { setCookie, getCookie, removeCookie } from '../cookies/cookieManager';
