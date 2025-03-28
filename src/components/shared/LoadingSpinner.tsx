
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * A reusable loading spinner component for displaying loading states
 */
export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default LoadingSpinner;
