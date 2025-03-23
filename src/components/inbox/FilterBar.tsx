
import React from 'react';

export const FilterBar = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="border rounded-md px-3 py-1 text-sm bg-white flex items-center gap-1">
        <span className="text-gray-500">Status:</span> 
        <span>All</span>
      </div>
      
      <div className="border rounded-md px-3 py-1 text-sm bg-white flex items-center gap-1">
        <span className="text-gray-500">Priority:</span> 
        <span>All</span>
      </div>
      
      <div className="border rounded-md px-3 py-1 text-sm bg-white flex items-center gap-1">
        <span className="text-gray-500">Assignee:</span> 
        <span>All</span>
      </div>
    </div>
  );
};
