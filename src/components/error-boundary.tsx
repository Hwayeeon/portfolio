"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold">Something went wrong</h1>
              <p className="text-muted-foreground max-w-md">
                An unexpected error occurred. Please refresh the page or try again later.
              </p>
            </div>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}