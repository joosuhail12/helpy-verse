
import { useEffect } from 'react';
import { HttpClient } from "@/api/services/http";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/auth/userActions';
import { useAuthContext } from '@/hooks/useAuthContext';

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
  const { isAuthenticated } = useAuthContext();
  
  useEffect(() => {
    // Initialize app with authentication if token exists
    try {
      initializeApp();
      
      // Load user data to get workspaceId if we have a token and are authenticated
      if (isAuthenticated) {
        dispatch(fetchUserData());
      }
    } catch (error) {
      console.error("Error during app initialization:", error);
    }
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

export default AppInitializer;
