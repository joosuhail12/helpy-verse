
import React from 'react';

/**
 * Component displayed when no conversations match the current filters
 */
const NoResultsFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-gray-800 font-semibold">No results found</h3>
      <p className="text-gray-500 text-center mt-2">
        Try adjusting your search or filter to find what you're looking for
      </p>
    </div>
  );
};

export default NoResultsFound;
