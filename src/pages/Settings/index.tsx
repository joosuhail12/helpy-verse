
import React from 'react';
import { Outlet } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export default Settings;
