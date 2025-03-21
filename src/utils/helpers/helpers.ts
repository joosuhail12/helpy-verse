
/**
 * Utility functions
 */

// Import from the correct location to avoid circular dependencies
import { setCookie as cookieSetCookie } from '@/utils/cookies/cookieManager';
import { handleSetToken as tokenManagerSetToken } from '@/utils/auth/tokenManager';

// Re-export the functions from tokenManager to maintain compatibility
export const handleSetToken = tokenManagerSetToken;

// Re-export cookieManager functions to maintain compatibility
export const setCookie = cookieSetCookie;

// Get cookie utility function
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
  
  return "";
};

// Simple Base64 encoder
export const encryptBase64 = (str: string): string => {
  try {
    return btoa(str);
  } catch (e) {
    console.error('Error encoding string to Base64:', e);
    return '';
  }
};

// Simple Base64 decoder
export const decryptBase64 = (encoded: string): string => {
  try {
    return atob(encoded);
  } catch (e) {
    console.error('Error decoding Base64 string:', e);
    return '';
  }
};

// Set workspace ID in localStorage
export const setWorkspaceId = (id: string): void => {
  if (id) {
    try {
      localStorage.setItem("workspaceId", id);
      console.log("Workspace ID set in localStorage:", id);
    } catch (error) {
      console.error("Error setting workspace ID in localStorage:", error);
    }
  }
};

// Format date utility
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format time utility
export const formatTime = (date: Date | string): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format currency utility
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Get initials from name
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Generate random color utility
export const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#F9C80E', '#FF8C42', '#4A5FC1',
    '#45B69C', '#FE5F55', '#59C9A5', '#5A5C75', '#2ec4b6',
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};
