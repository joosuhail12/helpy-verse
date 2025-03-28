
// This file is now just a re-export of the routes/index.tsx file to maintain compatibility
import { router } from './routes/index.tsx';
import LoadingSpinner from './components/shared/LoadingSpinner';

export { router, LoadingSpinner };

// Default export for backward compatibility
export default router;
