
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './App.css';

// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContentCenter = lazy(() => import('./pages/automation/ContentCenter'));
const ContentDetail = lazy(() => import('./pages/automation/ContentDetail'));

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/automation/content" element={<ContentCenter />} />
            <Route path="/automation/content/:id" element={<ContentDetail />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

