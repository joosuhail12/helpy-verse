
import { useAppDispatch } from '../useAppDispatch';
import { AsyncThunk } from '@reduxjs/toolkit';

/**
 * A hook to provide standardized dispatch functions for common operations
 * @param thunks Object containing async thunks for CRUD operations
 */
export const useStandardDispatch = <T>(thunks: {
  fetchAll?: AsyncThunk<any, any, any>;
  fetchById?: AsyncThunk<any, string, any>;
  create?: AsyncThunk<any, any, any>;
  update?: AsyncThunk<any, { id: string; data: any }, any>;
  delete?: AsyncThunk<any, string, any>;
  [key: string]: any;
}) => {
  const dispatch = useAppDispatch();
  
  const dispatchActions = {
    fetch: async (params = {}) => {
      if (!thunks.fetchAll) throw new Error('fetchAll thunk not provided');
      return dispatch(thunks.fetchAll(params)).unwrap();
    },
    
    fetchById: async (id: string) => {
      if (!thunks.fetchById) throw new Error('fetchById thunk not provided');
      return dispatch(thunks.fetchById(id)).unwrap();
    },
    
    create: async (data: Partial<T>) => {
      if (!thunks.create) throw new Error('create thunk not provided');
      return dispatch(thunks.create(data)).unwrap();
    },
    
    update: async (id: string, data: Partial<T>) => {
      if (!thunks.update) throw new Error('update thunk not provided');
      return dispatch(thunks.update({ id, data })).unwrap();
    },
    
    delete: async (id: string) => {
      if (!thunks.delete) throw new Error('delete thunk not provided');
      return dispatch(thunks.delete(id)).unwrap();
    },
  };
  
  return dispatchActions;
};
