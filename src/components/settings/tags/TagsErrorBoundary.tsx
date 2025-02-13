
import ErrorBoundary from '@/components/common/ErrorBoundary';
import type { ReactNode } from 'react';

interface TagsErrorBoundaryProps {
  children: ReactNode;
}

const TagsErrorBoundary = ({ children }: TagsErrorBoundaryProps) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default TagsErrorBoundary;
