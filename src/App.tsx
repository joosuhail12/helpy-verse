
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './components/app/AppRoutes';
import AppProviders from './components/app/AppProviders';
import AppErrorBoundary from './components/app/AppErrorBoundary';

function App() {
  return (
    <Provider store={store}>
      <AppErrorBoundary>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </AppErrorBoundary>
    </Provider>
  );
}

export default App;
