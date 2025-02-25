
import { QueryField } from '@/types/queryBuilder';
import { mockAudienceFields } from '@/mock/audienceFields';

export const useAudienceFields = (): QueryField[] => {
  return mockAudienceFields;
};
