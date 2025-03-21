
// This file has been disabled since we're not using Supabase
// We're using our custom Node.js backend instead

import type { Database } from './types';

// Placeholder client that throws an error if used
export const supabase = {
  auth: {
    signIn: () => {
      console.error('Supabase is not used in this application. Using custom Node.js backend instead.');
      return Promise.reject(new Error('Supabase is disabled'));
    },
    signUp: () => {
      console.error('Supabase is not used in this application. Using custom Node.js backend instead.');
      return Promise.reject(new Error('Supabase is disabled'));
    }
  }
};

// Export a clear indication that Supabase is not being used
export const SUPABASE_ENABLED = false;
