
import React from 'react';
import { Outlet } from 'react-router-dom';

const Settings = () => {
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
