import { createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';

/**
 * Creates standard action creators for CRUD operations
 * @param sliceName The name of the slice
 * @param api The API service for the entity
 */
export const createStandardActions = <T extends Record<string, any>>(
  sliceName: string,
  api: any
): Record<string, AsyncThunk<any, any, any>> => {
  // Create thunks for standard CRUD operations
  const thunks = {
    fetchAll: createAsyncThunk(
      `${sliceName}/fetchAll`,
      async (params: any = {}, { rejectWithValue }) => {
        try {
          return await api.getAll(params);
        } catch (error) {
          return rejectWithValue((error as Error).message);
        }
      }
    ),
    
    fetchById: createAsyncThunk(
      `${sliceName}/fetchById`,
      async (id: string, { rejectWithValue }) => {
        try {
          return await api.getById(id);
        } catch (error) {
          return rejectWithValue((error as Error).message);
        }
      }
    ),
    
    create: createAsyncThunk(
      `${sliceName}/create`,
      async (data: Partial<T>, { rejectWithValue }) => {
        try {
          return await api.create(data);
        } catch (error) {
          return rejectWithValue((error as Error).message);
        }
      }
    ),
    
    update: createAsyncThunk(
      `${sliceName}/update`,
      async ({ id, data }: { id: string; data: Partial<T> }, { rejectWithValue }) => {
        try {
          return await api.update(id, data);
        } catch (error) {
          return rejectWithValue((error as Error).message);
        }
      }
    ),
    
    delete: createAsyncThunk(
      `${sliceName}/delete`,
      async (id: string, { rejectWithValue }) => {
        try {
          return await api.delete(id);
        } catch (error) {
          return rejectWithValue((error as Error).message);
        }
      }
    ),
  };
  
  return thunks;
};
