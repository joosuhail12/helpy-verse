
import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeammatesHeader = () => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Link 
        to="/home/settings"
        className="text-sm text-gray-500 hover:text-gray-900 flex items-center"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Settings
      </Link>
      <div>
        <h1 className="text-2xl font-semibold">Teammates</h1>
      </div>
    </div>
  );
};

export default TeammatesHeader;
