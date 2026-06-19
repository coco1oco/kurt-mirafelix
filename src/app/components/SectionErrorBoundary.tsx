import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

function SectionFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="py-24 px-6 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900 border border-red-100 dark:border-red-900/30 w-full min-h-[40vh]">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" strokeWidth={1.5} />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Failed to load this section
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {errorMessage || "Something went wrong while rendering this part of the page."}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={SectionFallback}>
      {children}
    </ErrorBoundary>
  );
}
