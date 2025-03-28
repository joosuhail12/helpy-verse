
// Simple token management utility

// Get token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Check if token exists and is valid
export const hasValidToken = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  // Here you could add additional validation like checking expiry
  // For example, if you're using JWT, you could decode and check exp
  
  return true;
};
