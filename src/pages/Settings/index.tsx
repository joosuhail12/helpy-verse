
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  
  // Log to help debug route issues
  console.log("Settings page rendered, current path:", location.pathname);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="bg-white rounded-lg shadow">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
