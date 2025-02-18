
import React from 'react';
import { Outlet } from 'react-router-dom';

const Automation = () => {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export default Automation;
