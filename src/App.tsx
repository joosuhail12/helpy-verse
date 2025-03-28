
import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './components/app/AppRoutes';
import AppProviders from './components/app/AppProviders';
import AppErrorBoundary from './components/app/AppErrorBoundary';

function App() {
  return (
    <React.StrictMode>
      <AppErrorBoundary>
        <Provider store={store}>
          <AppProviders>
            <AppRoutes />
          </AppProviders>
        </Provider>
      </AppErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
