
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateParameterValue } from './validation';
import type { ParameterTestProps } from './types';

export const ParameterTest = ({ parameter, onUpdate }: ParameterTestProps) => {
  const [testValue, setTestValue] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidation = () => {
    setIsValidating(true);
    const { error } = validateParameterValue(parameter, testValue, onUpdate);
    setValidationError(error);
    setIsValidating(false);
  };

  return (
    <div className="space-y-2 mt-2">
      <Input
        value={testValue}
        onChange={(e) => setTestValue(e.target.value)}
        placeholder={`Enter test ${parameter.type} value`}
        className={`flex-1 ${validationError ? 'border-red-500' : ''}`}
      />
      {validationError && (
        <div className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {validationError}
        </div>
      )}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleValidation}
        disabled={isValidating}
      >
        Validate
      </Button>
    </div>
  );
};

