
import React, { Component, ErrorInfo } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * A specialized error boundary for catching dynamic import errors
 */
class DynamicImportErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error("Dynamic import error caught:", error.message);
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dynamic import error details:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    console.log("Attempting to reload the failed module...");
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Force a page reload if it's a critical module
    if (this.state.error?.message?.includes("Failed to fetch dynamically imported module")) {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            
            <h2 className="mb-4 text-xl font-bold text-center">
              {this.props.fallbackMessage || "Failed to load component"}
            </h2>
            
            <p className="mb-6 text-sm text-center text-gray-600">
              There was an error loading this component. This could be due to a network issue or a problem with the application.
            </p>
            
            {this.state.error && (
              <div className="p-3 mb-6 overflow-auto text-sm bg-gray-100 rounded max-h-40">
                <p className="font-medium">Error:</p>
                <p className="text-red-600">{this.state.error.message}</p>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button onClick={this.handleRetry} className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DynamicImportErrorBoundary;
