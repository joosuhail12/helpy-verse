
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '@/utils/auth/tokenManager';

// Create the base API with shared configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL || '/api',
    prepareHeaders: (headers) => {
      // Get token for auth
      const token = getAuthToken();
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Get workspace_id from localStorage
      const workspaceId = localStorage.getItem('workspaceId');
      
      // Set default headers
      headers.set('Content-Type', 'application/json');
      
      return headers;
    },
    paramsSerializer: (params) => {
      const workspaceId = localStorage.getItem('workspaceId');
      const newParams = { ...params };
      
      // Add workspace_id to all requests if not already present
      if (workspaceId && !newParams.workspace_id) {
        newParams.workspace_id = workspaceId;
      }
      
      // Convert params object to query string
      return Object.keys(newParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(newParams[key])}`)
        .join('&');
    }
  }),
  tagTypes: [
    'Contacts', 
    'Contact', 
    'Companies', 
    'Company', 
    'Tags', 
    'Teammates', 
    'Teams',
    'EmailChannels',
    'CannedResponses'
  ],
  endpoints: () => ({}),
});

// Export hooks factory
export const { 
  useQuery: useBaseQuery, 
  useMutation: useBaseMutation, 
  useLazyQuery: useBaseLazyQuery 
} = baseApi;
