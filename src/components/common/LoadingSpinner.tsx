
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * A reusable loading spinner component for consistent loading states across the application
 * @param className - Optional additional CSS classes
 */
const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`min-h-screen flex items-center justify-center ${className}`}>
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default LoadingSpinner;
