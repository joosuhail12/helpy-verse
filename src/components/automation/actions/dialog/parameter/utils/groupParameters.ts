
import type { CustomAction } from '@/types/action';
import type { ParameterGroupsState } from '../types/parameterGroup';

export const groupParameters = (parameters: CustomAction['parameters']): ParameterGroupsState => {
  return {
    authentication: {
      name: 'Authentication',
      isOpen: true,
      parameters: parameters.filter(p => 
        p.name.toLowerCase().includes('token') || 
        p.name.toLowerCase().includes('key') || 
        p.name.toLowerCase().includes('auth')
      )
    },
    pagination: {
      name: 'Pagination',
      isOpen: true,
      parameters: parameters.filter(p => 
        p.name.toLowerCase().includes('page') || 
        p.name.toLowerCase().includes('limit') ||
        p.name.toLowerCase().includes('offset')
      )
    },
    filtering: {
      name: 'Filtering',
      isOpen: true,
      parameters: parameters.filter(p => 
        p.name.toLowerCase().includes('filter') || 
        p.name.toLowerCase().includes('sort') ||
        p.name.toLowerCase().includes('search')
      )
    },
    other: {
      name: 'Other',
      isOpen: true,
      parameters: parameters.filter(p => 
        !p.name.toLowerCase().includes('token') &&
        !p.name.toLowerCase().includes('key') &&
        !p.name.toLowerCase().includes('auth') &&
        !p.name.toLowerCase().includes('page') &&
        !p.name.toLowerCase().includes('limit') &&
        !p.name.toLowerCase().includes('offset') &&
        !p.name.toLowerCase().includes('filter') &&
        !p.name.toLowerCase().includes('sort') &&
        !p.name.toLowerCase().includes('search')
      )
    }
  };
};
