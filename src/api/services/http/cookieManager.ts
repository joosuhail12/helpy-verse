
/**
 * Storage management utilities to handle authentication tokens and other data
 * Standardized to use localStorage only (no cookies)
 * 
 * LEGACY FILE: New code should use AuthService and WorkspaceService instead.
 */

import { AuthService } from '@/services/authService';

// Helper function to get data from localStorage - for backward compatibility
export const getCookie = (name: string): string => {
    try {
        const localValue = localStorage.getItem(name);
        if (localValue) {
            console.log(`Retrieved ${name} from localStorage`);
            return localValue;
        }
    } catch (error) {
        console.error("Error accessing localStorage:", error);
    }
    
    return "";
};

// Helper function to set data in localStorage - for backward compatibility
export const setCookie = (name: string, value: string, exdays: number = 30): void => {
    try {
        // Store in localStorage only
        localStorage.setItem(name, value);
        console.log(`Set ${name} in localStorage successfully`);
    } catch (error) {
        console.error("Error setting localStorage:", error);
    }
};

// Logout function - now uses AuthService
export const handleLogout = (): void => {
    console.log("Using legacy logout. Consider using AuthService.logout() instead.");
    AuthService.logout();
};

// Export helper functions to reduce circular dependencies
export const cookieFunctions = {
    getCookie,
    setCookie,
    handleLogout
};
