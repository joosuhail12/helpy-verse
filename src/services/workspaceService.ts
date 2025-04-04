
/**
 * Workspace Service
 * Handles workspace-related functionality
 */

// Constants
const WORKSPACE_ID_KEY = "workspaceId";

/**
 * Set workspace ID in localStorage
 */
export const setWorkspaceId = (id: string): void => {
  if (id) {
    localStorage.setItem(WORKSPACE_ID_KEY, id);
    console.log(`Workspace ID set: ${id}`);
  } else {
    console.warn("Attempted to set empty workspace ID");
  }
};

/**
 * Get workspace ID from localStorage
 */
export const getWorkspaceId = (): string => {
  return localStorage.getItem(WORKSPACE_ID_KEY) || "";
};

/**
 * Check if workspace ID exists
 */
export const hasWorkspaceId = (): boolean => {
  return !!getWorkspaceId();
};

/**
 * Clear workspace ID from localStorage
 */
export const clearWorkspaceId = (): void => {
  localStorage.removeItem(WORKSPACE_ID_KEY);
};

// Export all functions as a service object
export const WorkspaceService = {
  setWorkspaceId,
  getWorkspaceId,
  hasWorkspaceId,
  clearWorkspaceId
};

export default WorkspaceService;
