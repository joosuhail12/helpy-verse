
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { fetchTeammates } from '@/store/slices/teammatesSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class TeammatesErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in teammates component:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    const dispatch = useAppDispatch();
    dispatch(fetchTeammates());
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTitle>Something went wrong while loading teammates</AlertTitle>
          <AlertDescription className="mt-2">
            {this.state.error?.message || 'An unexpected error occurred'}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={this.handleRetry}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default TeammatesErrorBoundary;
