
import { useEffect } from 'react';
import { getCookie, handleSetToken } from "@/utils/helpers/helpers";
import { HttpClient } from "@/api/services/http";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/auth/userActions';

export const initializeApp = () => {
  // Check both cookie and localStorage for token, but only cookie for workspace ID
  const token = getCookie("customerToken") || localStorage.getItem("token");
  if (token) {
    console.log("App initialization: Found token, setting up auth");
    // Set token in both places to ensure consistency
    handleSetToken(token);
    // Configure HTTP client
    HttpClient.setAxiosDefaultConfig(token);
  } else {
    console.log("App initialization: No token found");
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
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;
