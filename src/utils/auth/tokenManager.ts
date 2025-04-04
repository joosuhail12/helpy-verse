
/**
 * Token Manager (LEGACY)
 * This file is maintained for backward compatibility.
 * New code should use src/services/authService.ts instead.
 */
import { AuthService } from '@/services/authService';
import { WorkspaceService } from '@/services/workspaceService';

// Re-export from AuthService for backward compatibility
export const handleLogout = AuthService.logout;
export const handleSetToken = AuthService.setAuthToken;
export const isAuthenticated = AuthService.isAuthenticated;
export const getAuthToken = AuthService.getAuthToken;
export const isTokenExpired = AuthService.isTokenExpired;

// Re-export from WorkspaceService for backward compatibility
export const setWorkspaceId = WorkspaceService.setWorkspaceId;
export const getWorkspaceId = WorkspaceService.getWorkspaceId;

// Re-export role checks from AuthService
export const isOrganizationAdmin = AuthService.isOrganizationAdmin;
export const isWorkspaceAdmin = AuthService.isWorkspaceAdmin;
export const isWorkspaceAgent = AuthService.isWorkspaceAgent;

// Re-export user ID getter
export const getUserId = AuthService.getUserId;
