
// This file is no longer needed as we're using the new router structure
// The content is kept in routes/index.tsx
import { redirect } from 'react-router-dom';

export default () => {
  console.warn('Legacy routes.tsx is still being imported but should not be used anymore');
  return null;
};
