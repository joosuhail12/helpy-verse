
import type { CannedResponse } from '@/mock/cannedResponses';
import { EntityState } from '@reduxjs/toolkit';

export interface CannedResponsesState extends EntityState<CannedResponse, string> {
  loading: boolean;
  error: string | null;
  selectedResponseId: string | null;
  versionHistory: {
    responseId: string;
    versions: CannedResponse['versions'];
  } | null;
  categories: string[];
}

export { CannedResponse };
