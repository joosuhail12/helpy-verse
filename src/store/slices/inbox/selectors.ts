
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

// Base selector
const getInboxState = (state: RootState) => state.inbox;

// Memoized selectors
export const selectTickets = createSelector(
  [getInboxState],
  (inboxState) => inboxState?.tickets ?? []
);

export const selectSelectedTicket = createSelector(
  [getInboxState],
  (inboxState) => inboxState?.selectedTicket ?? null
);

export const selectInboxLoading = createSelector(
  [getInboxState],
  (inboxState) => inboxState?.loading ?? false
);

export const selectInboxError = createSelector(
  [getInboxState],
  (inboxState) => inboxState?.error ?? null
);

// Parameterized selectors
export const selectTicketById = createSelector(
  [selectTickets, (_, ticketId: string) => ticketId],
  (tickets, ticketId) => tickets.find(ticket => ticket.id === ticketId) || null
);
