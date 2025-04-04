import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { AuthService } from '@/services/authService';
import { WorkspaceService } from '@/services/workspaceService';
import { 
  refreshAuthToken
} from '@/store/slices/auth/authActions';
import { fetchUserData } from '@/store/slices/auth/userActions';
import { logout as logoutAction } from '@/store/slices/auth/authSlice';
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

  useEffect(() => {
    if (authState.isAuthenticated !== isAuthenticated) {
      setIsAuthenticated(authState.isAuthenticated);
    }
  }, [authState.isAuthenticated, isAuthenticated]);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const token = AuthService.getAuthToken();
        
        if (token) {
          HttpClient.setAxiosDefaultConfig(token);
          
          if (AuthService.isTokenExpired()) {
            console.log('AuthContext: Token is expired, attempting refresh');
            await refreshToken();
          } else {
            console.log('AuthContext: Valid token found');
            setIsAuthenticated(true);
          }
          
          setUserId(AuthService.getUserId() || null);
          setUserRole(AuthService.getUserRole() || null);
          
          const wsId = WorkspaceService.getWorkspaceId();
          setWorkspaceId(wsId || null);
          setHasWorkspace(!!wsId);
          
          if (isAuthenticated && !wsId) {
            console.log('AuthContext: No workspace ID found, fetching user data');
            try {
              await dispatch(fetchUserData()).unwrap();
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

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        if (!e.newValue) {
          setIsAuthenticated(false);
          setUserId(null);
          setUserRole(null);
        } else if (e.newValue !== AuthService.getAuthToken()) {
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

  const login = useCallback((token: string) => {
    if (token) {
      const success = AuthService.setAuthToken(token);
      if (success) {
        setIsAuthenticated(true);
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

  const logout = useCallback(() => {
    dispatch(logoutAction());
    setIsAuthenticated(false);
    setUserId(null);
    setUserRole(null);
    setWorkspaceId(null);
    setHasWorkspace(false);
  }, [dispatch]);

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
