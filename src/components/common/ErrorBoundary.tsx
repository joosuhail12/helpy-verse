import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error | null; reset: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A generic error boundary component that catches JavaScript errors in its child component tree
 * and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error("ErrorBoundary caught an error:", error.message);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    console.log("Resetting error boundary state");
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback component is provided, use it
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />;
      }

      // Otherwise, use the default error UI
      return (
        <Alert variant="destructive" className="m-4 max-w-lg mx-auto shadow-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {this.state.error?.message || 'An unexpected error occurred'}
            {this.state.error?.stack && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-sm">Technical details</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
              </details>
            )}
          </AlertDescription>
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mr-2"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reload Page
            </Button>
            <Button 
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
