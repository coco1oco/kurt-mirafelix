import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { RefreshCcw, AlertOctagon } from 'lucide-react';
import { ReactNode } from 'react';

function GlobalFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-10 h-10 text-red-500" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          System Failure
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400">
          A critical error occurred that crashed the entire application. We apologize for the inconvenience.
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl overflow-x-auto text-left">
          <code className="text-xs text-red-500 dark:text-red-400 whitespace-pre-wrap font-mono">
            {errorMessage}
          </code>
        </div>

        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium w-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Reload Application
        </button>
      </div>
    </div>
  );
}

export function GlobalErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={GlobalFallback} onReset={() => window.location.reload()}>
      {children}
    </ErrorBoundary>
  );
}
