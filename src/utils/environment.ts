
/**
 * Environment utility functions
 */

/**
 * Check if the application is running in development mode
 */
export const isDevelopmentMode = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
         process.env.REACT_APP_ENV === 'development';
};

/**
 * Get the current environment name
 */
export const getEnvironmentName = (): string => {
  if (isDevelopmentMode()) {
    return 'development';
  }
  return process.env.REACT_APP_ENV || 'production';
};

/**
 * Log environment information
 */
export const logEnvironmentInfo = (): void => {
  console.log(`Application running in ${getEnvironmentName()} mode`);
  console.log(`API URL: ${process.env.REACT_APP_API_URL || 'Using default API URL'}`);
};
