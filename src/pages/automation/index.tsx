
import * as React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Container component for all automation-related pages
 */
const Automation: React.FC = () => {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
};

export default Automation;
