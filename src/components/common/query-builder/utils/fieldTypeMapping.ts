
import type { FieldType } from '@/types/queryBuilder';

export const mapFieldType = (type: string): FieldType => {
  switch (type) {
    case 'text':
      return 'text';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'date';
    case 'select':
      return 'select';
    case 'multi-select':
      return 'multi-select';
    default:
      return 'text';
  }
};
