
import React from 'react';
import { Outlet } from 'react-router-dom';

const Contacts = () => {
  console.log('Contacts index page rendered');
  return (
    <div className="h-full overflow-hidden">
      <Outlet />
    </div>
  );
};

export default Contacts;
