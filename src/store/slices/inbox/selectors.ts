
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Ticket } from '../inbox/inboxSlice';

// Base selector
const getInboxState = (state: RootState) => state.inbox;

// Memoized selectors
export const selectTicketIds = createSelector(
  [getInboxState],
  (inboxState) => inboxState.ids
);

export const selectTicketEntities = createSelector(
  [getInboxState],
  (inboxState) => inboxState.entities
);

export const selectAllTickets = createSelector(
  [selectTicketIds, selectTicketEntities],
  (ids, entities) => ids.map(id => entities[id])
);

export const selectSelectedTicketId = createSelector(
  [getInboxState],
  (inboxState) => inboxState.selectedTicketId
);

export const selectSelectedTicket = createSelector(
  [selectTicketEntities, selectSelectedTicketId],
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectInboxLoading = createSelector(
  [getInboxState],
  (inboxState) => inboxState.loading
);

export const selectInboxError = createSelector(
  [getInboxState],
  (inboxState) => inboxState.error
);

// Parameterized selectors
export const selectTicketById = createSelector(
  [selectTicketEntities, (_, ticketId: string) => ticketId],
  (entities, ticketId) => entities[ticketId] || null
);

export const selectTicketsByStatus = createSelector(
  [selectAllTickets, (_, status: string) => status],
  (tickets, status) => tickets.filter(ticket => ticket.status === status)
);

export const selectTicketsByAssignee = createSelector(
  [selectAllTickets, (_, assigneeId: string) => assigneeId],
  (tickets, assigneeId) => tickets.filter(ticket => ticket.assignee === assigneeId)
);

export const selectUnreadTicketsCount = createSelector(
  [selectAllTickets],
  (tickets) => tickets.filter(ticket => ticket.unread).length
);
