
import { QueryField } from '@/types/queryBuilder';
import { audienceFields } from '@/mock/audienceFields';

export const useAudienceFields = (): QueryField[] => {
  return audienceFields;
};
