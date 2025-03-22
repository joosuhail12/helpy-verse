
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for messaging components with accessibility improvements
 */
class MessageErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Message component error:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 border border-red-200 text-center m-4"
        >
          <AlertTriangle className="h-8 w-8 text-red-500 mb-2" aria-hidden="true" />
          <h3 className="text-red-800 font-medium mb-1">
            Something went wrong
          </h3>
          <p className="text-red-600 text-sm mb-3">
            {this.state.error?.message || 'An unexpected error occurred in the messaging component'}
          </p>
          <button
            onClick={this.resetError}
            className="flex items-center gap-1 bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-md text-sm hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            aria-label="Try again"
          >
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Try again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MessageErrorBoundary;
