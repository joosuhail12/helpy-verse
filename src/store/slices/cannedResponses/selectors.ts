
import { RootState } from '../../store';

export const selectCannedResponses = (state: RootState) => state.cannedResponses?.responses || [];
export const selectCannedResponsesLoading = (state: RootState) => state.cannedResponses?.loading || false;
export const selectCannedResponsesError = (state: RootState) => state.cannedResponses?.error || null;
export const selectSelectedCannedResponse = (state: RootState) => state.cannedResponses?.selectedResponse || null;
export const selectCannedResponseById = (state: RootState, id: string) => 
  state.cannedResponses?.responses?.find(response => response.id === id) || null;
