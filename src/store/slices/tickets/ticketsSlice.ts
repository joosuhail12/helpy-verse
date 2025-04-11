import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '@/types/ticket';
import { ticketService } from '@/api/services/ticketService';

interface TicketsState {
    currentTicket: Ticket | null;
    ticketDetails: Record<string, Ticket>; // Store ticket details by sno/id
    loading: boolean;
    error: string | null;
}

const initialState: TicketsState = {
    currentTicket: null,
    ticketDetails: {},
    loading: false,
    error: null,
};

// ✅ Fetch ticket details by SNo
export const fetchTicketBySno = createAsyncThunk(
    'tickets/fetchTicketBySno',
    async (sno: string | number, { rejectWithValue }) => {
        try {
            console.log(`Fetching ticket details for SNo: ${sno}`);
            const response = await ticketService.fetchTicketBySno(sno);
            console.log('Ticket details response:', response);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching ticket details:', error);
            return rejectWithValue(error.message || 'Failed to fetch ticket details');
        }
    }
);

// ✅ Fetch multiple tickets by SNo or ID
export const fetchTicketsBySno = createAsyncThunk(
    'tickets/fetchTicketsBySno',
    async (identifiers: (string | number)[], { rejectWithValue }) => {
        try {
            console.log(`Fetching ticket details for identifiers: ${identifiers.join(', ')}`);
            const results: Record<string, Ticket> = {};

            // Process tickets in parallel
            const promises = identifiers.map(async (identifier) => {
                try {
                    const response = await ticketService.fetchTicketBySno(identifier);
                    if (response.data) {
                        // Store ticket by both sno and id for easy lookup
                        if (response.data.sno) {
                            results[String(response.data.sno)] = response.data;
                        }
                        if (response.data.id) {
                            results[response.data.id] = response.data;
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching ticket ${identifier}:`, err);
                }
            });

            await Promise.all(promises);
            return results;
        } catch (error: any) {
            console.error('Error fetching multiple tickets:', error);
            return rejectWithValue(error.message || 'Failed to fetch multiple tickets');
        }
    }
);

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

//get conversation for a ticket
export const getConversation = createAsyncThunk(
    'tickets/getConversation',
    async (ticket_sno: string | number | any, { rejectWithValue }) => {
        try {
            const response = await ticketService.getConversation(ticket_sno);
            return response.data;
        } catch (error: any) {
            console.error('Unhandled error in getConversation thunk:', error);
            return rejectWithValue(error.message || 'Failed to get conversation');
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
                    // Also update in the ticketDetails cache
                    if (action.payload.sno) {
                        state.ticketDetails[String(action.payload.sno)] = action.payload;
                    } else if (action.payload.id) {
                        state.ticketDetails[action.payload.id] = action.payload;
                    }
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
            })
            //get conversation
            .addCase(getConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getConversation.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Get conversation fulfilled with payload:', action.payload);
                console.log('Current ticket:', state.currentTicket, action.payload);
                if (action.payload) {
                    state.currentTicket.conversation = action.payload;
                }
            })
            .addCase(getConversation.rejected, (state, action) => {
                state.loading = false;
                console.error('Get conversation rejected:', action);
                state.error = action.payload as string || action.error.message || 'Failed to get conversation';
            })

            // Fetch ticket by SNo
            .addCase(fetchTicketBySno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketBySno.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.currentTicket = action.payload;

                    // Store in ticketDetails cache by both sno and id for easy lookup
                    if (action.payload.sno) {
                        state.ticketDetails[String(action.payload.sno)] = action.payload;
                    }
                    if (action.payload.id) {
                        state.ticketDetails[action.payload.id] = action.payload;
                    }
                }
            })
            .addCase(fetchTicketBySno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Failed to fetch ticket details';
            })

            // Fetch multiple tickets by SNo
            .addCase(fetchTicketsBySno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketsBySno.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    // Merge the new ticket details with existing ones
                    state.ticketDetails = {
                        ...state.ticketDetails,
                        ...action.payload
                    };
                }
            })
            .addCase(fetchTicketsBySno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Failed to fetch multiple tickets';
            });
    },
});

export const { setCurrentTicket, resetLoading, clearError } = ticketsSlice.actions;
export default ticketsSlice.reducer; 