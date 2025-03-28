
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Base selector
const getEmailChannelsState = (state: RootState) => state.emailChannels;

// Memoized selectors
export const selectEmailChannels = createSelector(
  [getEmailChannelsState],
  (state) => state?.channels || []
);

export const selectEmailChannelsLoading = createSelector(
  [getEmailChannelsState],
  (state) => state?.loading || false
);

export const selectEmailChannelsError = createSelector(
  [getEmailChannelsState],
  (state) => state?.error || null
);

export const selectDefaultChannel = createSelector(
  [getEmailChannelsState],
  (state) => state?.defaultChannel || null
);

export const selectHasDomainVerified = createSelector(
  [getEmailChannelsState],
  (state) => state?.hasDomainVerified || false
);
