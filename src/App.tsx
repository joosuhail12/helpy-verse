
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from './components/ui/toaster';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CaslProvider from './components/CaslProvider';
import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    console.log('App mounted');
    
    // Log authentication state on start
    const authState = store.getState().auth;
    console.log('Initial auth state:', authState);
  }, []);

  return (
    <Provider store={store}>
      <CaslProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CaslProvider>
    </Provider>
  );
}

export default App;
