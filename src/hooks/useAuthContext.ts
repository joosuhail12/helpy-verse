
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook to access the centralized auth context
 * This provides a simplified interface to the auth context
 */
export const useAuthContext = () => {
  const auth = useAuth();
  
  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    hasWorkspace: auth.hasWorkspace,
    userId: auth.userId,
    userRole: auth.userRole,
    workspaceId: auth.workspaceId,
    login: auth.login,
    logout: auth.logout,
    refreshToken: auth.refreshToken,
    validateAuthContext: auth.validateAuthContext,
    
    // Role-based helpers
    isAdmin: auth.userRole === 'ORGANIZATION_ADMIN' || auth.userRole === 'WORKSPACE_ADMIN',
    isAgent: auth.userRole === 'WORKSPACE_AGENT',
    isOrganizationAdmin: auth.userRole === 'ORGANIZATION_ADMIN',
    isWorkspaceAdmin: auth.userRole === 'WORKSPACE_ADMIN'
  };
};

export default useAuthContext;
