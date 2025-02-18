import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContentCenter = lazy(() => import('./pages/automation/ContentCenter'));
const ContentDetail = lazy(() => import('./pages/automation/ContentDetail'));
const SomeOtherComponent = lazy(() => import('./pages/SomeOtherComponent')); // Example of another lazy import

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/automation/content" element={<ContentCenter />} />
          <Route path="/automation/content/:id" element={<ContentDetail />} />
          <Route path="/some-other-route" element={<SomeOtherComponent />} /> {/* Example of another route */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
