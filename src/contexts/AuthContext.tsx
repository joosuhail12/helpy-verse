
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { AuthService } from '@/services/authService';
import { WorkspaceService } from '@/services/workspaceService';
import { 
  refreshAuthToken, 
  fetchUserData, 
  logout as logoutAction 
} from '@/store/slices/auth/authActions';
import { toast } from '@/components/ui/use-toast';
import { HttpClient } from '@/api/services/http';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasWorkspace: boolean;
  userId: string | null;
  userRole: string | null;
  workspaceId: string | null;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  validateAuthContext: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  hasWorkspace: false,
  userId: null,
  userRole: null,
  workspaceId: null,
  login: () => {},
  logout: () => {},
  refreshToken: async () => false,
  validateAuthContext: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [userId, setUserId] = useState<string | null>(AuthService.getUserId() || null);
  const [userRole, setUserRole] = useState<string | null>(AuthService.getUserRole() || null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(WorkspaceService.getWorkspaceId() || null);
  const [hasWorkspace, setHasWorkspace] = useState(WorkspaceService.hasWorkspaceId());

  // Sync with Redux state when it changes
  useEffect(() => {
    if (authState.isAuthenticated !== isAuthenticated) {
      setIsAuthenticated(authState.isAuthenticated);
    }
  }, [authState.isAuthenticated, isAuthenticated]);

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const token = AuthService.getAuthToken();
        
        if (token) {
          // Configure HTTP client
          HttpClient.setAxiosDefaultConfig(token);
          
          // Verify token validity
          if (AuthService.isTokenExpired()) {
            console.log('AuthContext: Token is expired, attempting refresh');
            await refreshToken();
          } else {
            console.log('AuthContext: Valid token found');
            setIsAuthenticated(true);
          }
          
          // Load user ID and role
          setUserId(AuthService.getUserId() || null);
          setUserRole(AuthService.getUserRole() || null);
          
          // Check workspace
          const wsId = WorkspaceService.getWorkspaceId();
          setWorkspaceId(wsId || null);
          setHasWorkspace(!!wsId);
          
          // If authenticated but missing workspace, try to fetch user data
          if (isAuthenticated && !wsId) {
            console.log('AuthContext: No workspace ID found, fetching user data');
            try {
              await dispatch(fetchUserData()).unwrap();
              // Update workspace state after fetch
              const newWsId = WorkspaceService.getWorkspaceId();
              setWorkspaceId(newWsId || null);
              setHasWorkspace(!!newWsId);
            } catch (error) {
              console.error('Failed to fetch user data:', error);
            }
          }
        } else {
          console.log('AuthContext: No token found, not authenticated');
          setIsAuthenticated(false);
          setUserId(null);
          setUserRole(null);
          setWorkspaceId(null);
          setHasWorkspace(false);
        }
      } catch (error) {
        console.error('Error initializing auth context:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Monitor localStorage changes for multi-tab support
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        if (!e.newValue) {
          // Token removed in another tab
          setIsAuthenticated(false);
          setUserId(null);
          setUserRole(null);
        } else if (e.newValue !== AuthService.getAuthToken()) {
          // Token changed in another tab
          setIsAuthenticated(true);
          setUserId(AuthService.getUserId() || null);
          setUserRole(AuthService.getUserRole() || null);
        }
      }
      
      if (e.key === "workspaceId") {
        const newWsId = e.newValue || null;
        setWorkspaceId(newWsId);
        setHasWorkspace(!!newWsId);
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login function - set token and update state
  const login = useCallback((token: string) => {
    if (token) {
      const success = AuthService.setAuthToken(token);
      if (success) {
        setIsAuthenticated(true);
        // After setting token, fetch user data to get workspace
        dispatch(fetchUserData())
          .unwrap()
          .then(() => {
            setUserId(AuthService.getUserId() || null);
            setUserRole(AuthService.getUserRole() || null);
            const wsId = WorkspaceService.getWorkspaceId();
            setWorkspaceId(wsId || null);
            setHasWorkspace(!!wsId);
          })
          .catch(error => {
            console.error('Error fetching user data after login:', error);
            toast({
              title: "Error",
              description: "Failed to load user data",
              variant: "destructive",
            });
          });
      }
    }
  }, [dispatch]);

  // Logout function - clear token and update state
  const logout = useCallback(() => {
    dispatch(logoutAction());
    setIsAuthenticated(false);
    setUserId(null);
    setUserRole(null);
    setWorkspaceId(null);
    setHasWorkspace(false);
  }, [dispatch]);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const result = await dispatch(refreshAuthToken()).unwrap();
      const newToken = result?.data?.accessToken?.token;
      
      if (newToken) {
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [dispatch]);

  // Validate auth context function
  const validateAuthContext = useCallback((): boolean => {
    if (!isAuthenticated) {
      console.warn('Authentication context validation failed: Not authenticated');
      return false;
    }
    
    if (!hasWorkspace) {
      console.warn('Authentication context validation failed: No workspace');
      return false;
    }
    
    return true;
  }, [isAuthenticated, hasWorkspace]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    hasWorkspace,
    userId,
    userRole,
    workspaceId,
    login,
    logout,
    refreshToken,
    validateAuthContext
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
