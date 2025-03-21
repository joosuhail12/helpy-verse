
import React from 'react';

interface ResponseErrorProps {
  error: string;
}

export const ResponseError = ({ error }: ResponseErrorProps) => {
  return (
    <div className="p-6">
      <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
        Error: {error}
      </div>
    </div>
  );
};
