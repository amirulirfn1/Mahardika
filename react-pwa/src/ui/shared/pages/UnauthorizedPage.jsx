import React from 'react';
import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            403 - Unauthorized
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        <div className="mt-6">
          <Link
            to="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Go back home<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
