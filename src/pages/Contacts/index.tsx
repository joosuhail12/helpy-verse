
import React from 'react';
import { Outlet } from 'react-router-dom';

const Contacts = () => {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export default Contacts;
