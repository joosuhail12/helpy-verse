
import { useEffect } from 'react';
import { getCookie, handleSetToken } from "@/utils/helpers/helpers";
import { HttpClient } from "@/api/services/http";
import { logEnvironmentInfo } from "@/utils/environment";

export const initializeApp = () => {
  // Log environment information
  logEnvironmentInfo();
  
  const token = getCookie("customerToken") || localStorage.getItem("token");
  if (token) {
    console.log("App initialization: Found token, setting up auth");
    handleSetToken(token);
    HttpClient.setAxiosDefaultConfig();
  } else {
    console.log("App initialization: No token found");
  }
};

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  useEffect(() => {
    // Initialize app with authentication if token exists
    initializeApp();
    
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
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
