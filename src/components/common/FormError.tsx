'use client';

import React, { useState } from 'react';
import { AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FormErrorsProps {
  errors: unknown[];
  className?: string;
  dismissible?: boolean;
  expandable?: boolean;
}

const FormErrors = ({ errors, className = '', dismissible = false, expandable = false }: FormErrorsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!errors || errors.length === 0 || isDismissed) return null;

  const displayErrors = isExpanded ? errors : errors.slice(0, 1);

  return (
    <div className={`bg-red-50 border-l-4 border-red-400 p-4 rounded-md ${className}`}>
      <div className="flex items-start">
        <div className="shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            There {errors.length === 1 ? 'is' : 'are'} {errors.length} {errors.length === 1 ? 'error' : 'errors'} that need to be fixed
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {displayErrors.map((error, index) => (
                <li key={index}>{error as string}</li>
              ))}
            </ul>
          </div>
          {errors.length > 1 && expandable && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center text-sm text-red-700 hover:text-red-900"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show {errors.length - 1} more {errors.length - 1 === 1 ? 'error' : 'errors'}
                </>
              )}
            </button>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={() => setIsDismissed(true)}
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormErrors;