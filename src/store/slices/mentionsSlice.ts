import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mentionsService, Mention } from '../../api/services/mentionsService';

interface MentionsState {
    mentions: Mention[];
    loading: boolean;
    error: string | null;
}

const initialState: MentionsState = {
    mentions: [],
    loading: false,
    error: null,
};

export const fetchMentions = createAsyncThunk(
    'mentions/fetchMentions',
    async (params?: {
        ticket_id?: string;
        user_id?: string;
        status?: string;
        is_read?: boolean;
        skip?: number;
        limit?: number;
    }) => {
        const response = await mentionsService.getMentions(params);
        return response.data;
    }
);

export const createMention = createAsyncThunk(
    'mentions/createMention',
    async (data: {
        ticketId: string;
        userId: string;
        mentionId?: string;
        mentionedBy?: string;
        content?: string;
    }) => {
        const response = await mentionsService.createMention(data);
        return response.data;
    }
);

export const markMentionAsRead = createAsyncThunk(
    'mentions/markMentionAsRead',
    async (mentionId: string) => {
        const response = await mentionsService.markMentionAsRead(mentionId);
        return response.data;
    }
);

const mentionsSlice = createSlice({
    name: 'mentions',
    initialState,
    reducers: {
        clearMentions: (state) => {
            state.mentions = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch mentions
            .addCase(fetchMentions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMentions.fulfilled, (state, action) => {
                state.loading = false;
                state.mentions = action.payload;
            })
            .addCase(fetchMentions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch mentions';
            })
            // Create mention
            .addCase(createMention.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMention.fulfilled, (state, action) => {
                state.loading = false;
                state.mentions.push(action.payload);
            })
            .addCase(createMention.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create mention';
            })
            // Mark mention as read
            .addCase(markMentionAsRead.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markMentionAsRead.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.mentions.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.mentions[index] = action.payload;
                }
            })
            .addCase(markMentionAsRead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to mark mention as read';
            });
    },
});

export const { clearMentions } = mentionsSlice.actions;
export default mentionsSlice.reducer; 