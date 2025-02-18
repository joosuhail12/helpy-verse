
export interface TestConfig {
  parameterValues: Record<string, any>;
  savedAt: string;
  responseTime?: number;
  lastResponse?: {
    status: number;
    data: any;
    headers: Record<string, string>;
  };
}

export interface TestPanelProps {
  form: any;
  isTestSuccessful: boolean;
  onTest: (paramValues: Record<string, any>) => Promise<void>;
  parameters: any[];
  testConfig?: TestConfig;
  onSaveConfig?: (config: TestConfig) => void;
}
