import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '@/types/ticket';
import { ticketService } from '@/api/services/ticketService';

interface TicketsState {
    currentTicket: Ticket | null;
    loading: boolean;
    error: string | null;
}

const initialState: TicketsState = {
    currentTicket: null,
    loading: false,
    error: null,
};

// ✅ Update ticket
export const updateTicket = createAsyncThunk(
    'tickets/updateTicket',
    async ({ ticket_sno, updates }: { ticket_sno: string | number | any; updates: Partial<Ticket> }, { rejectWithValue }) => {
        try {
            // First, ensure we have a string value for ticket_sno
            let actualSno: string;

            // Handle if ticket_sno is an object
            if (typeof ticket_sno === 'object' && ticket_sno !== null) {
                if (ticket_sno.sno) {
                    actualSno = String(ticket_sno.sno);
                } else if (ticket_sno.id) {
                    actualSno = ticket_sno.id;
                } else {
                    console.error('Invalid ticket identifier object:', ticket_sno);
                    return rejectWithValue('Invalid ticket identifier');
                }
            } else {
                // Convert to string for consistent handling
                actualSno = String(ticket_sno);

                // If actualSno looks like a UUID, try to get the numeric sno
                if (actualSno && actualSno.includes('-')) {
                    try {
                        // Try the direct getSno method
                        actualSno = await ticketService.getSno(actualSno);
                    } catch (err) {
                        console.warn('Could not get ticket sno, using provided identifier:', err);
                    }
                }
            }

            console.log('Using ticket_sno for update:', actualSno);

            try {
                const response = await ticketService.updateTicket(actualSno, updates);
                console.log('Update ticket API response:', response);
                return response.data;
            } catch (apiError: any) {
                console.error('API Error in updateTicket:', apiError);
                // Return structured error data for better error handling
                return rejectWithValue({
                    message: apiError.message || 'Failed to update ticket',
                    status: apiError.response?.status,
                    data: apiError.response?.data
                });
            }
        } catch (error: any) {
            console.error('Unhandled error in updateTicket thunk:', error);
            return rejectWithValue(error.message || 'Failed to update ticket');
        }
    }
);

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        setCurrentTicket: (state, action: PayloadAction<Ticket>) => {
            state.currentTicket = action.payload;
        },
        resetLoading: (state) => {
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Update ticket
            .addCase(updateTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Update ticket fulfilled with payload:', action.payload);
                if (action.payload) {
                    state.currentTicket = action.payload;
                }
            })
            .addCase(updateTicket.rejected, (state, action) => {
                state.loading = false;
                console.error('Update ticket rejected:', action);

                // Handle both simple string errors and complex error objects
                if (typeof action.payload === 'object' && action.payload !== null) {
                    const errorPayload = action.payload as any;
                    state.error = errorPayload.message || action.error.message || 'Unknown error';
                } else {
                    state.error = action.payload as string || action.error.message || 'Failed to update ticket';
                }
            });
    },
});

export const { setCurrentTicket, resetLoading, clearError } = ticketsSlice.actions;
export default ticketsSlice.reducer; 