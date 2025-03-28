
import Cookies from 'js-cookie';

// Cookie management helpers
export const setCookie = (name: string, value: string, days: number = 7): void => {
  Cookies.set(name, value, { expires: days, sameSite: 'strict' });
};

export const getCookie = (name: string): string | null => {
  return Cookies.get(name) || null;
};

export const removeCookie = (name: string): void => {
  Cookies.remove(name);
};

// Base64 encoding/decoding helpers with encryption simulation
export const encryptBase64 = (text: string): string => {
  // This is a simple base64 encoding, not actual encryption
  return btoa(encodeURIComponent(text));
};

export const decryptBase64 = (encoded: string): string => {
  // This is a simple base64 decoding, not actual decryption
  try {
    return decodeURIComponent(atob(encoded));
  } catch (error) {
    console.error('Failed to decode base64 string:', error);
    return '';
  }
};

// Date formatting helper
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time helper
export const formatTime = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format datetime helper
export const formatDateTime = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(d.getTime())) return '';
  
  return `${formatDate(d)} ${formatTime(d)}`;
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(d);
  }
};

// String truncation helper
export const truncateString = (str: string, maxLength: number = 100): string => {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

// Generate a random ID (for testing/mock data)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Convert object to URL query string
export const objectToQueryString = (obj: Record<string, any>): string => {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

// Parse URL query string to object
export const queryStringToObject = (queryString: string): Record<string, string> => {
  if (!queryString || queryString === '') return {};
  
  const params = queryString.startsWith('?') 
    ? queryString.substring(1).split('&') 
    : queryString.split('&');
    
  return params.reduce((result, param) => {
    const [key, value] = param.split('=');
    if (key && value) {
      result[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return result;
  }, {} as Record<string, string>);
};

// Detect if we're running in a browser environment
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

// Detect if the device is mobile
export const isMobile = (): boolean => {
  if (!isBrowser()) return false;
  return window.innerWidth <= 768;
};

// Safely parse JSON with error handling
export const safeJsonParse = (jsonString: string, fallback: any = null): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
};

// Debounce function for performance optimization
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};
