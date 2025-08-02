'use client';

import { useEffect } from 'react';

export default function GlobalDOMErrorHandler() {
  useEffect(() => {
    // Override DOM methods globally to prevent React errors
    const originalRemoveChild = Node.prototype.removeChild;
    const originalAppendChild = Node.prototype.appendChild;
    const originalInsertBefore = Node.prototype.insertBefore;

    // Enhanced removeChild override
    Node.prototype.removeChild = function<T extends Node>(child: T): T {
      try {
        // Check if child is actually a child of this node
        if (!this.contains(child)) {
          console.warn('🚨 DOM Error prevented: Attempted to remove node that is not a child', {
            parent: this.nodeName,
            child: child.nodeName,
            type: 'preventive DOM error handling'
          });
          return child as T;
        }
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
          return child as T;
        }
        throw error;
      }
    };

    // Enhanced appendChild override
    Node.prototype.appendChild = function<T extends Node>(child: T): T {
      try {
        return originalAppendChild.call(this, child) as T;
      } catch (error: any) {
        console.warn('🚨 DOM appendChild error suppressed:', {
          message: error.message,
          parent: this.nodeName,
          child: child.nodeName,
          type: 'DOM manipulation error'
        });
        return child as T;
      }
    };

    // Enhanced insertBefore override
    Node.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      } catch (error: any) {
        console.warn('🚨 DOM insertBefore error suppressed:', {
          message: error.message,
          parent: this.nodeName,
          newNode: newNode.nodeName,
          referenceNode: referenceNode?.nodeName,
          type: 'DOM manipulation error'
        });
        return newNode as T;
      }
    };

    // Global error handler for uncaught DOM errors
    const handleDOMError = (event: ErrorEvent) => {
      const message = event.message?.toLowerCase() || '';
      const filename = event.filename?.toLowerCase() || '';
      
      if (
        message.includes('notfounderror') ||
        message.includes('failed to execute') ||
        message.includes('removechild') ||
        message.includes('node to be removed is not a child') ||
        message.includes('parentnode') ||
        filename.includes('react-dom')
      ) {
        console.warn('🚨 Global DOM error suppressed:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'Global DOM error handler'
        });
        event.preventDefault();
        return true;
      }
      return false;
    };

    // Add global error listener
    window.addEventListener('error', handleDOMError);

    // Cleanup function
    return () => {
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.appendChild = originalAppendChild;
      Node.prototype.insertBefore = originalInsertBefore;
      window.removeEventListener('error', handleDOMError);
    };
  }, []);

  return null; // This component doesn't render anything
}
