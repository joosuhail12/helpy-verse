
// Define test configuration interface
export interface TestConfig {
  paramValues: Record<string, any>;
  results?: {
    success: boolean;
    data?: any;
    error?: string;
  };
  lastRun?: string;
}
