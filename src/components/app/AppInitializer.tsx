
import { useEffect } from 'react';
import { HttpClient } from "@/api/services/http";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';

export const initializeApp = () => {
  // Check localStorage for token
  const token = localStorage.getItem("token");
  
  // Check for workspace ID in localStorage
  const workspaceId = localStorage.getItem("workspaceId");
  
  if (token) {
    console.log("App initialization: Found token, setting up auth");
    // Configure HTTP client
    HttpClient.setAxiosDefaultConfig(token);
  } else {
    console.log("App initialization: No token found");
  }
  
  // Log workspace ID status
  if (workspaceId) {
    console.log("App initialization: Found workspace ID:", workspaceId);
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
      const token = localStorage.getItem("token");
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
