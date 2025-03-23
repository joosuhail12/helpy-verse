
// Line 63: Update localeCompare for TeamMember
// Convert to strings for comparison
const assigneeA = ticketA.assignee ? ticketA.assignee.toString() : '';
const assigneeB = ticketB.assignee ? ticketB.assignee.toString() : '';
return sortDirection === 'asc' ? assigneeA.localeCompare(assigneeB) : assigneeB.localeCompare(assigneeA);

// Line 102-105: Update toLowerCase checks for objects
const customerSearch = ticket.customer.name.toLowerCase().includes(searchQuery);
const messageSearch = (ticket.lastMessage || '').toLowerCase().includes(searchQuery);
const companySearch = ticket.company?.name.toLowerCase().includes(searchQuery) || false;
const assigneeSearch = ticket.assignee ? ticket.assignee.name.toLowerCase().includes(searchQuery) : false;
