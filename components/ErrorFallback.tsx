import React from 'react';
import Link from 'next/link';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  message?: string;
}

export default function ErrorFallback({ 
  error, 
  resetError, 
  message 
}: ErrorFallbackProps) {
  const errorMessage = message || error?.message || 'Something went wrong';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error details (dev only)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto text-red-600">
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resetError && (
            <button
              onClick={resetError}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
          
          <Link 
            href="/english-demo"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors inline-block"
          >
            Go to Courses
          </Link>
          
          <Link 
            href="/"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

