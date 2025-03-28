
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <Outlet />
    </div>
  );
};

export default Home;
