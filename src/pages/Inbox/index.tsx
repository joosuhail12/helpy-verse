
import React from 'react';
import { Outlet } from 'react-router-dom';

const Inbox = () => {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export default Inbox;
