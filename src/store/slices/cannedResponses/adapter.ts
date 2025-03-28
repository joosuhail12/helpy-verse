import { createEntityAdapter, EntityAdapter } from '@reduxjs/toolkit';
import { CannedResponse } from '@/mock/cannedResponses';

// Create and export the entity adapter
export const cannedResponsesAdapter: EntityAdapter<CannedResponse, string> = createEntityAdapter<CannedResponse, string>({
  // Select the id of the entity
  selectId: (response: CannedResponse) => response.id,
  // Keep the "all IDs" array sorted based on creation date (newest first)
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

// Export adapter selectors
export const {
  selectAll: selectAllCannedResponses,
  selectById: selectCannedResponseById,
  selectIds: selectCannedResponseIds,
} = cannedResponsesAdapter.getSelectors();
