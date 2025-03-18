
import { createSlice } from '@reduxjs/toolkit';

export type ContentState = {
  content: any[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  filterBy: string;
};

const initialState: ContentState = {
  content: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  filterBy: 'all',
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const contentReducer = contentSlice.reducer;
