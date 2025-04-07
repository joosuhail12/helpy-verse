
import type { RootState } from '@/store/store';
import type { AuthState } from './types';

// Basic selectors
export const selectAuthState = (state: RootState): AuthState => state.auth;
export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState): boolean => state.auth.loading;
export const selectAuthError = (state: RootState): string | null => state.auth.error;
export const selectUser = (state: RootState): AuthState['user'] => state.auth.user;
export const selectPermissions = (state: RootState): AuthState['permissions'] => state.auth.permissions;

// Derived selectors
export const selectUserId = (state: RootState): string | undefined => state.auth.user?.data?.id;
export const selectUserEmail = (state: RootState): string | undefined => {
  const userData = state.auth.user?.data;
  // Use optional chaining and type assertions to safely access potentially missing properties
  return (userData as any)?.email || (userData as any)?.username;
};

export const selectWorkspaceId = (state: RootState): string | undefined => 
  state.auth.user?.data?.defaultWorkspaceId;

// Role-based selectors
export const selectUserRole = (state: RootState): string | undefined => {
  // Get role from user data if available, using type assertion to avoid TypeScript errors
  return (state.auth.user?.data as any)?.role;
};

export const selectIsAdmin = (state: RootState): boolean => {
  const role = selectUserRole(state);
  return role === 'admin' || role === 'ORGANIZATION_ADMIN' || role === 'WORKSPACE_ADMIN';
};
