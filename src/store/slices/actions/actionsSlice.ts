
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CustomAction } from '@/types/action';

interface ActionsState {
  items: CustomAction[];
}

const initialState: ActionsState = {
  items: [],
};

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    addAction: (state, action: PayloadAction<CustomAction>) => {
      state.items.push(action.payload);
    },
    updateAction: (state, action: PayloadAction<CustomAction>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteAction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleAction: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items[index].enabled = !state.items[index].enabled;
      }
    },
  },
});

export const { addAction, updateAction, deleteAction, toggleAction } = actionsSlice.actions;
export default actionsSlice.reducer;
