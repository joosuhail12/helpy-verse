
import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Contacts parent component that serves as a layout container for all contacts pages
 * Uses Outlet from react-router-dom to render nested routes
 */
const Contacts: React.FC = () => {
  return (
    <div className="h-full overflow-hidden">
      <Outlet />
    </div>
  );
};

export default Contacts;
