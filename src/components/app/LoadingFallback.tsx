
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-gray-600">Loading application...</p>
    </div>
  </div>
);

export default LoadingFallback;
