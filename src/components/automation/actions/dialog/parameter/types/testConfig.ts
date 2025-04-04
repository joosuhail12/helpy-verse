
// Define test configuration interface
export interface TestConfig {
  paramValues?: Record<string, any>;
  parameterValues?: Record<string, any>;
  savedAt?: string;
  responseTime?: number;
  lastResponse?: {
    status: number;
    data: any;
    headers: Record<string, string>;
  };
  results?: {
    success: boolean;
    data?: any;
    error?: string;
  };
  lastRun?: string;
}

export interface TestPanelProps {
  form: any;
  isTestSuccessful: boolean;
  onTest: (paramValues: Record<string, any>) => Promise<void>;
  parameters: any[];
  testConfig?: TestConfig;
  onSaveConfig?: (config: TestConfig) => void;
}
