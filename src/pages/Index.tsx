
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Index redirector component
 * Simply redirects to the landing page
 */
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
