
/**
 * Centralized Workspace Service
 * Handles workspace-related functionality including ID management
 */
import { HttpClient } from "@/api/services/http";

// Constants
const WORKSPACE_ID_KEY = "workspaceId";

/**
 * Set the workspace ID in localStorage
 */
export const setWorkspaceId = (id: string): void => {
  if (!id) {
    console.warn("Attempted to set empty workspace ID");
    return;
  }
  
  try {
    localStorage.setItem(WORKSPACE_ID_KEY, id);
    console.log(`Workspace ID set to: ${id}`);
    
    // Verify localStorage was set correctly
    const verifiedValue = localStorage.getItem(WORKSPACE_ID_KEY);
    if (verifiedValue) {
      console.log("✅ Workspace ID saved to localStorage and verified:", verifiedValue);
    } else {
      console.error("❌ Failed to save workspace ID to localStorage - verification failed");
    }
  } catch (error) {
    console.error("Error setting workspace ID in localStorage:", error);
  }
};

/**
 * Get the workspace ID from localStorage
 */
export const getWorkspaceId = (): string => {
  const workspaceId = localStorage.getItem(WORKSPACE_ID_KEY) || "";
  
  if (!workspaceId) {
    console.warn("No workspace ID found in localStorage");
  }
  
  return workspaceId;
};

/**
 * Check if workspace ID is set
 */
export const hasWorkspaceId = (): boolean => {
  return !!getWorkspaceId();
};

/**
 * Validate that workspace ID is set before making API calls
 * Returns true if valid, false if not
 */
export const validateWorkspaceContext = (): boolean => {
  const workspaceId = getWorkspaceId();
  
  if (!workspaceId) {
    console.error("No workspace ID found. User may need to log in again.");
    return false;
  }
  
  return true;
};

/**
 * Fetch the current workspace data
 */
export const fetchWorkspaceData = async () => {
  const workspaceId = getWorkspaceId();
  
  if (!workspaceId) {
    throw new Error("No workspace ID available");
  }
  
  try {
    const response = await HttpClient.apiClient.get(`/workspaces/${workspaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching workspace data:", error);
    throw error;
  }
};

// Export all functions as a service object
export const WorkspaceService = {
  setWorkspaceId,
  getWorkspaceId,
  hasWorkspaceId,
  validateWorkspaceContext,
  fetchWorkspaceData
};

export default WorkspaceService;
