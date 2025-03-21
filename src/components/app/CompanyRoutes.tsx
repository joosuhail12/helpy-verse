
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// Lazy-load the company detail component
const CompanyDetail = lazy(() => import('@/pages/contacts/CompanyDetail'));

const CompanyRoutes = () => {
  return (
    <Routes>
      <Route path=":id" element={<CompanyDetail />} />
    </Routes>
  );
};

export default CompanyRoutes;
