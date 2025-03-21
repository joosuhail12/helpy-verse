
import { useEffect } from 'react';
import { getCookie, handleSetToken } from "@/utils/helpers/helpers";
import { HttpClient } from "@/api/services/http";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/auth/userActions';

export const initializeApp = () => {
  // Check both cookie and localStorage for token
  const token = getCookie("customerToken") || localStorage.getItem("token");
  
  // Check for workspace ID in localStorage first, then cookie
  const workspaceId = localStorage.getItem("workspaceId") || getCookie("workspaceId");
  
  if (token) {
    console.log("App initialization: Found token, setting up auth");
    // Set token in both places to ensure consistency
    handleSetToken(token);
    // Configure HTTP client
    HttpClient.setAxiosDefaultConfig(token);
  } else {
    console.log("App initialization: No token found");
  }
  
  // Log workspace ID status and ensure it's set in localStorage
  if (workspaceId) {
    console.log("App initialization: Found workspace ID:", workspaceId);
    // Ensure it's set in localStorage for consistent access
    localStorage.setItem("workspaceId", workspaceId);
  } else {
    console.warn("App initialization: No workspace ID found - API requests will likely fail");
  }
};

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Initialize app with authentication if token exists
    try {
      initializeApp();
      
      // Load user data to get workspaceId if we have a token
      const token = getCookie("customerToken") || localStorage.getItem("token");
      if (token) {
        dispatch(fetchUserData());
      }
    } catch (error) {
      console.error("Error during app initialization:", error);
    }
    
    // Set up event listener for storage changes (for multi-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        // Token was removed in another tab, log out here too
        window.location.href = "/sign-in";
      }
      
      // Also sync workspace ID changes across tabs
      if (e.key === "workspaceId" && e.newValue !== localStorage.getItem("workspaceId")) {
        localStorage.setItem("workspaceId", e.newValue || "");
        console.log("Workspace ID synced from another tab:", e.newValue);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;
