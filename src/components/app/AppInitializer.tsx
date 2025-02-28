
import { useEffect } from 'react';
import { getCookie, handleSetToken } from "@/utils/helpers/helpers";
import { HttpClient } from "@/api/services/http";

export const initializeApp = () => {
  // Check both cookie and localStorage for token
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
  useEffect(() => {
    // Initialize app with authentication if token exists
    try {
      initializeApp();
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
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
