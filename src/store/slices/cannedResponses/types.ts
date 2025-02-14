
import type { CannedResponse } from '@/mock/cannedResponses';

export interface CannedResponsesState {
  responses: CannedResponse[];
  loading: boolean;
  error: string | null;
  selectedResponse: CannedResponse | null;
  versionHistory: {
    responseId: string;
    versions: CannedResponse['versions'];
  } | null;
}

