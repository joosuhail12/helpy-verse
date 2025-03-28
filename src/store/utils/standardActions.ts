
import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Creates a set of standard CRUD async thunks for an entity
 * @param prefix The prefix for the action types
 * @param api The API service for the entity
 */
export const createStandardCrudThunks = <T, S>(
  prefix: string, 
  api: { 
    fetch: (params?: any) => Promise<any>,
    getById?: (id: string) => Promise<any>,
    create?: (data: any) => Promise<any>,
    update?: (id: string, data: any) => Promise<any>,
    delete?: (id: string) => Promise<any>,
    // Add any additional API methods as needed
  }
) => {
  const thunks: Record<string, any> = {};
  
  // Define fetchAll thunk
  thunks.fetchAll = createAsyncThunk(
    `${prefix}/fetchAll`,
    async (params = {}, { rejectWithValue }) => {
      try {
        const response = await api.fetch(params);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.message || `Failed to fetch ${prefix}`);
      }
    }
  );

  // Define fetchById thunk if api.getById exists
  if (api.getById) {
    thunks.fetchById = createAsyncThunk(
      `${prefix}/fetchById`,
      async (id: string, { rejectWithValue }) => {
        try {
          const response = await api.getById(id);
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || `Failed to fetch ${prefix} details`);
        }
      }
    );
  }

  // Define create thunk if api.create exists
  if (api.create) {
    thunks.create = createAsyncThunk(
      `${prefix}/create`,
      async (data: any, { rejectWithValue }) => {
        try {
          const response = await api.create(data);
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || `Failed to create ${prefix}`);
        }
      }
    );
  }

  // Define update thunk if api.update exists
  if (api.update) {
    thunks.update = createAsyncThunk(
      `${prefix}/update`,
      async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
          const response = await api.update(id, data);
          return response.data;
        } catch (error: any) {
          return rejectWithValue(error.message || `Failed to update ${prefix}`);
        }
      }
    );
  }

  // Define delete thunk if api.delete exists
  if (api.delete) {
    thunks.delete = createAsyncThunk(
      `${prefix}/delete`,
      async (id: string, { rejectWithValue }) => {
        try {
          await api.delete(id);
          return id; // Return the ID for reducer handling
        } catch (error: any) {
          return rejectWithValue(error.message || `Failed to delete ${prefix}`);
        }
      }
    );
  }

  return thunks;
};
