
// Create this file if it doesn't exist
export interface TestConfig {
  paramValues: Record<string, any>;
  results?: {
    success: boolean;
    data?: any;
    error?: string;
  };
  lastRun?: string;
}
