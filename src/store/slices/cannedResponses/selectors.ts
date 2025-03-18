
import { RootState } from '../../store';

export const selectCannedResponses = (state: RootState) => state.cannedResponses.responses;
export const selectSelectedResponse = (state: RootState) => state.cannedResponses.selectedResponse;
export const selectCannedResponsesLoading = (state: RootState) => state.cannedResponses.loading;
export const selectCannedResponsesError = (state: RootState) => state.cannedResponses.error;

export const selectResponseById = (id: string) => 
  (state: RootState) => state.cannedResponses.responses.find(response => response.id === id);
