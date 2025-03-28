
/**
 * Utility for validating if the current origin is allowed to load the chat widget
 */

// List of allowed domains (would be fetched from backend in production)
const DEFAULT_ALLOWED_ORIGINS = [
  'localhost',
  '127.0.0.1',
  'pullseai.com',
  'app.pullseai.com',
  'dev-socket.pullseai.com',
];

/**
 * Validates if the current origin is allowed to load the chat widget
 * @param workspaceId The workspace ID to validate against
 * @param allowedOrigins Optional override for allowed origins
 * @returns Boolean indicating if origin is valid
 */
export const isOriginAllowed = (
  workspaceId: string,
  allowedOrigins: string[] = []
): boolean => {
  // In development, always allow
  if (import.meta.env.DEV) {
    console.log('Origin validation bypassed in development mode');
    return true;
  }

  try {
    const currentOrigin = window.location.origin;
    const hostname = window.location.hostname;
    
    // Combine default and provided allowed origins
    const combinedAllowedOrigins = [...DEFAULT_ALLOWED_ORIGINS, ...allowedOrigins];
    
    // Check if origin is explicitly allowed
    if (combinedAllowedOrigins.some(origin => 
      hostname === origin || 
      hostname.endsWith(`.${origin}`)
    )) {
      console.log(`Origin validated: ${currentOrigin}`);
      return true;
    }
    
    // TODO: In production, this would make an API call to validate the domain
    // against the specific workspace's allowed domains
    console.warn(`Origin validation failed for ${currentOrigin} with workspace ${workspaceId}`);
    return false;
  } catch (error) {
    console.error('Error validating origin:', error);
    // Fail closed (deny by default on error)
    return false;
  }
};

/**
 * Gets allowed origins for a workspace
 * In a real implementation, this would fetch from backend
 */
export const getAllowedOrigins = async (workspaceId: string): Promise<string[]> => {
  // TODO: Replace with actual API call to fetch allowed origins for the workspace
  // This would be implemented in the backend
  
  // Simulating async API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock response - in real implementation, this would come from the backend
      const mockAllowedOrigins = [
        'example.com',
        'customer1.com',
        'customer2.org',
      ];
      resolve(mockAllowedOrigins);
    }, 100);
  });
};
