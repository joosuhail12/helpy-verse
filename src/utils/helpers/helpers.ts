
/**
 * Main helpers file that re-exports all utility functions
 * This maintains backward compatibility while organizing code better
 */

// Import cookieFunctions first
import { cookieFunctions } from '@/api/services/http';

// Re-export utilities from HTTP client cookie manager
export { cookieFunctions };
export const { getCookie, setCookie, handleLogout } = cookieFunctions;

// Re-export all other utilities
export * from '../auth/tokenManager';
export * from '../encoding/encodingUtils';
export * from '../performance/performanceUtils';
export * from '../validation/validationUtils';
export * from '../formatting/queryStringUtils';
