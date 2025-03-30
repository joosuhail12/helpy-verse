import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { customerService } from '@/api/services/customerService';
import type { Contact } from '@/types/contact';

// Define the state structure for the customers slice
interface CustomersState {
    customerCache: Record<string, Contact>;
    loading: Record<string, boolean>;
    error: string | null;
}

// Initial state
const initialState: CustomersState = {
    customerCache: {},
    loading: {},
    error: null
};

// Async thunk to fetch a customer by ID
export const fetchCustomerById = createAsyncThunk(
    'customers/fetchCustomerById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await customerService.fetchCustomerById(id);

            if (response.status !== "success") {
                return rejectWithValue('Failed to fetch customer data');
            }

            return { id, data: response.data };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch customer data');
        }
    }
);

// Async thunk to fetch multiple customers by ID at once
export const fetchCustomersForPage = createAsyncThunk(
    'customers/fetchCustomersForPage',
    async (customerIds: string[], { getState, dispatch }) => {
        const state = getState() as RootState;

        // Filter out customer IDs that are already in the cache or are currently loading
        const missingCustomerIds = customerIds.filter(id => {
            const isInCache = !!state.customers.customerCache[id];
            const isLoading = !!state.customers.loading[id];
            return id && !isInCache && !isLoading;
        });

        // If there are no missing customer IDs, don't do anything
        if (missingCustomerIds.length === 0) return;

        try {
            // Batch fetch all missing customers at once
            const customerDataMap = await customerService.fetchCustomersByIds(missingCustomerIds);

            return { customerDataMap, ids: missingCustomerIds };
        } catch (error) {
            console.error('Error batch fetching customers:', error);
            // If batch fetch fails, fall back to individual fetches
            const promises = missingCustomerIds.map(id => dispatch(fetchCustomerById(id)));
            await Promise.all(promises);
            return { ids: missingCustomerIds };
        }
    }
);

// Create the customers slice
const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        clearCustomerCache: (state) => {
            state.customerCache = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchCustomerById
            .addCase(fetchCustomerById.pending, (state, action) => {
                // Use the customer ID from the meta object to track loading state per customer
                const id = action.meta.arg;
                state.loading[id] = true;
            })
            .addCase(fetchCustomerById.fulfilled, (state, action) => {
                const { id, data } = action.payload;
                state.loading[id] = false;
                // Store customer data in cache
                state.customerCache[id] = data;
            })
            .addCase(fetchCustomerById.rejected, (state, action) => {
                const id = action.meta.arg;
                state.loading[id] = false;
                state.error = action.payload as string;
            })
            // Handle fetchCustomersForPage
            .addCase(fetchCustomersForPage.fulfilled, (state, action) => {
                if (action.payload?.customerDataMap) {
                    // Add all fetched customers to the cache
                    state.customerCache = {
                        ...state.customerCache,
                        ...action.payload.customerDataMap
                    };

                    // Update loading state for all fetched IDs
                    action.payload.ids.forEach(id => {
                        state.loading[id] = false;
                    });
                }
            });
    },
});

// Export actions
export const { clearCustomerCache } = customersSlice.actions;

// Export selectors
export const selectCustomerById = (state: RootState, id: string) => state.customers.customerCache[id];
export const selectIsCustomerLoading = (state: RootState, id: string) => !!state.customers.loading[id];
export const selectCustomerName = (state: RootState, id: string) => {
    const customer = state.customers.customerCache[id];
    return customer ? `${customer.firstname} ${customer.lastname}` : undefined;
};

// Export reducer
export default customersSlice.reducer; 