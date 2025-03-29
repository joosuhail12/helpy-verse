
// Re-export client
export { apiClient } from './client';
export type { ApiResponse, ApiError, RequestOptions } from './client';

// Re-export all services
export * from './services';

// Export a default API object with all services
import { apiClient } from './client';
import { contactsService, companiesService, ticketsService } from './services';

const API = {
  client: apiClient,
  contacts: contactsService,
  companies: companiesService,
  tickets: ticketsService,
  
  // Helper method to check API health
  checkHealth: () => apiClient.checkHealth()
};

export default API;
