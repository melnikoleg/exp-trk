import React, { useState } from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '../Button';
import { captureMessage, trackUserAction } from '../../utils/sentry';
import styles from './styles.module.css';

/**
 * A component to test Sentry error reporting functionality
 * This should only be used in development environments
 */
const SentryTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testErrorBoundary = () => {
    // This error will be caught by the nearest ErrorBoundary
    throw new Error('Test error thrown from SentryTest component');
  };

  const testUnhandledError = () => {
    // Simulating an unhandled error
    setTimeout(() => {
      const obj: any = null;
      // This will cause a TypeError: Cannot read properties of null
      obj.nonExistentProperty.access();
    }, 100);

    setTestResult('Triggered unhandled error. Check Sentry dashboard in a moment.');
  };

  const testPerformanceMonitoring = async () => {
    setIsLoading(true);
    setTestResult('Running performance test...');
    
    // Use startSpan for performance monitoring in latest Sentry versions
    Sentry.startSpan({ name: 'Test Transaction', op: 'test' }, async (span) => {
      try {
        // Add some breadcrumbs for tracking
        Sentry.addBreadcrumb({
          category: 'test',
          message: 'Test performance monitoring breadcrumb',
          level: 'info',
        });
  
        // Create a child operation
        await Sentry.startSpan({ 
          name: 'Test Child Operation', 
          op: 'test.operation' 
        }, async () => {
          // Simulate a slower operation
          await new Promise(resolve => setTimeout(resolve, 1000));
        });
  
        // Track a user action
        trackUserAction('performance_test', { duration: '1000ms' });
  
        // Send a message
        captureMessage('Performance test completed successfully', 'info');
  
        setTestResult('Performance test completed! Check Sentry for the transaction.');
      } catch (error) {
        Sentry.captureException(error);
        setTestResult('Error during performance test.');
      } finally {
        setIsLoading(false);
      }
    });
  };

  const testMessage = () => {
    captureMessage('Test message from SentryTest component', 'info');
    setTestResult('Test message sent to Sentry!');
  };

  return (
    <div className={styles.container}>
      <h2>Sentry Integration Test</h2>
      <p className={styles.description}>
        Use these buttons to verify Sentry integration is working correctly.
        All actions will report to your Sentry dashboard.
      </p>
      
      <div className={styles.buttonGroup}>
        <Button 
          onClick={testErrorBoundary}
          variant="danger"
          disabled={isLoading}
        >
          Test Error Boundary
        </Button>
        
        <Button 
          onClick={testUnhandledError} 
          variant="primary"
          disabled={isLoading}
        >
          Test Unhandled Error
        </Button>
        
        <Button 
          onClick={testPerformanceMonitoring}
          disabled={isLoading}
        >
          {isLoading ? 'Testing...' : 'Test Performance Monitoring'}
        </Button>
        
        <Button 
          onClick={testMessage}
          variant="primary"
          disabled={isLoading}
        >
          Test Message
        </Button>
      </div>
      
      {testResult && (
        <div className={styles.result}>
          <p>{testResult}</p>
        </div>
      )}
      
      <div className={styles.note}>
        <strong>Note:</strong> This component is for testing purposes only and should not be included in production builds.
      </div>
    </div>
  );
};

export default SentryTest;
