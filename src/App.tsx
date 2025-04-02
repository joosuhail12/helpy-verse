
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import AppProviders from './components/app/AppProviders';
import './App.css';

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
