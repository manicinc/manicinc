// src/components/SenderFormErrorBoundary.tsx
'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SenderFormErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a DOM removeChild error
    if (error.name === 'NotFoundError' && 
        error.message.includes('removeChild') && 
        error.message.includes('not a child of this node')) {
      console.log('🛡️ Caught React DOM removeChild error - ignoring for Sender.net integration');
      // Don't trigger error state for these specific errors
      return { hasError: false };
    }
    
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log non-DOM manipulation errors
    if (!(error.name === 'NotFoundError' && error.message.includes('removeChild'))) {
      console.error('SenderForm Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">
            Newsletter form error
          </h3>
          <p className="text-red-600 text-sm">
            Something went wrong loading the newsletter form. Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
