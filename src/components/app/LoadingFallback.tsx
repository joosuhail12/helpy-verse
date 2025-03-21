
import React from 'react';

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen w-full gradient-background flex items-center justify-center">
    <div className="w-full max-w-3xl p-6 md:p-8">
      <div className="auth-card opacity-40">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingFallback;
