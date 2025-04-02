
/**
 * Token management utility functions
 */

// Check if user is authenticated based on token
export const isAuthenticated = (): boolean => {
  try {
    return !!localStorage.getItem("token");
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Handle setting token
export const handleSetToken = (token: string): void => {
  try {
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token set successfully");
    }
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

// Handle logout
export const handleLogout = (): void => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("workspaceId");
    sessionStorage.removeItem("token");
    
    console.log("User logged out - cleared all tokens and storage");
    
    // Force page refresh and redirect to sign-in
    window.location.href = "/sign-in";
  } catch (error) {
    console.error('Error during logout process:', error);
  }
};
