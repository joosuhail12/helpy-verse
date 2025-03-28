
import inboxReducer from './inboxSlice';
import * as inboxActions from './actions';
import * as inboxSelectors from './selectors';

export { inboxReducer, inboxActions };

// Export specific selectors - avoid re-exporting the same ones
export { 
  selectAllTickets,
  selectInboxError,
  selectInboxLoading,
  selectSelectedTicket,
  selectTicketById,
  selectTicketsByAssignee,
  selectTicketsByStatus,
  selectUnreadTicketsCount
} from './selectors';

export default inboxReducer;
