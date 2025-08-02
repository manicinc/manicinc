'use client';

import React, { Component, ReactNode } from 'react';

interface DOMErrorBoundaryState {
  hasError: boolean;
  errorInfo?: string;
}

interface DOMErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  suppressErrors?: boolean;
}

class DOMErrorBoundary extends Component<DOMErrorBoundaryProps, DOMErrorBoundaryState> {
  constructor(props: DOMErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DOMErrorBoundaryState {
    // Check if this is a DOM manipulation error we want to suppress
    const message = error.message?.toLowerCase() || '';
    const stack = error.stack?.toLowerCase() || '';
    
    const isDOMError = (
      message.includes('notfounderror') ||
      message.includes('failed to execute') ||
      message.includes('removechild') ||
      message.includes('node to be removed is not a child') ||
      message.includes('parentnode') ||
      stack.includes('commitdeletioneffects') ||
      stack.includes('removechild')
    );

    if (isDOMError) {
      console.warn('🚨 DOM Error caught by boundary (suppressed):', {
        message: error.message,
        type: 'DOM manipulation error',
        suppressed: true
      });
      
      // Return state that indicates error was handled but don't show error UI
      return { 
        hasError: false, // Don't show error UI for DOM errors
        errorInfo: `DOM Error: ${error.message}` 
      };
    }

    // For non-DOM errors, show the error UI
    return { 
      hasError: true,
      errorInfo: error.message 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const message = error.message?.toLowerCase() || '';
    const stack = error.stack?.toLowerCase() || '';
    
    const isDOMError = (
      message.includes('notfounderror') ||
      message.includes('failed to execute') ||
      message.includes('removechild') ||
      message.includes('node to be removed is not a child') ||
      message.includes('parentnode') ||
      stack.includes('commitdeletioneffects') ||
      stack.includes('removechild')
    );

    if (isDOMError) {
      console.warn('🚨 DOM Error details (suppressed):', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        type: 'React DOM cleanup error',
        suppressed: true
      });
    } else {
      // Log non-DOM errors normally
      console.error('React Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Only show fallback for non-DOM errors
      return this.props.fallback || (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">
            Something went wrong. Please refresh the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DOMErrorBoundary;

// Enhanced DOM error suppression hook
export function useDOMErrorSuppression() {
  React.useEffect(() => {
    const originalRemoveChild = Node.prototype.removeChild;
    const originalAppendChild = Node.prototype.appendChild;
    const originalInsertBefore = Node.prototype.insertBefore;

    // Override removeChild to catch and suppress specific errors
    Node.prototype.removeChild = function<T extends Node>(child: T): T {
      try {
        return originalRemoveChild.call(this, child) as T;
      } catch (error: any) {
        const message = error.message?.toLowerCase() || '';
        if (
          message.includes('node to be removed is not a child') ||
          message.includes('notfounderror') ||
          message.includes('failed to execute')
        ) {
          console.warn('🚨 DOM removeChild error suppressed:', {
            message: error.message,
            parent: this.nodeName,
            child: child.nodeName,
            type: 'DOM manipulation error'
          });
          // Return the child node to maintain interface compatibility
          return child as T;
        }
        // Re-throw non-DOM errors
        throw error;
      }
    };

    // Override appendChild for safety
    Node.prototype.appendChild = function<T extends Node>(child: T): T {
      try {
        return originalAppendChild.call(this, child) as T;
      } catch (error: any) {
        console.warn('🚨 DOM appendChild error suppressed:', error.message);
        return child as T;
      }
    };

    // Override insertBefore for safety  
    Node.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      } catch (error: any) {
        console.warn('🚨 DOM insertBefore error suppressed:', error.message);
        return newNode as T;
      }
    };

    // Cleanup function to restore original methods
    return () => {
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.appendChild = originalAppendChild;
      Node.prototype.insertBefore = originalInsertBefore;
    };
  }, []);
}
