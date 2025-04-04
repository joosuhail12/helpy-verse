
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Ticket } from '@/types/ticket';

// Mock data for initial tickets (this would typically come from an API)
const initialTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Cannot access my account',
    customer: 'John Doe',
    lastMessage: "I've been trying to log in for the past hour but keep getting an error message. Can someone help?",
    assignee: 'Sarah Wilson',
    company: 'Acme Corp',
    tags: ['login', 'urgent'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T10:00:00Z',
    isUnread: true,
    hasNotification: true,
    notificationType: 'mention',
    recipients: ['john.doe@acmecorp.com']
  },
  {
    id: '2',
    subject: 'How do I reset my password?',
    customer: 'Jane Smith',
    lastMessage: "I forgot my password and need help resetting it. I've tried the 'forgot password' link but haven't received any email.",
    assignee: null,
    company: 'TechStart Inc',
    tags: ['password-reset'],
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-14T15:30:00Z',
    isUnread: false,
    hasNotification: true,
    notificationType: 'assignment',
    recipients: ['jane.smith@techstart.com']
  },
  {
    id: '3',
    subject: 'Billing inquiry',
    customer: 'Robert Johnson',
    lastMessage: 'I have a question about my last invoice. There seems to be a discrepancy in the charges.',
    assignee: 'Mike Thompson',
    company: 'Global Solutions',
    tags: ['billing', 'invoice'],
    status: 'closed',
    priority: 'low',
    createdAt: '2024-03-13T09:15:00Z',
    isUnread: false,
    recipients: ['robert.johnson@globalsolutions.com']
  },
  {
    id: '4',
    subject: 'Feature request: Dark mode',
    customer: 'Emily Chen',
    lastMessage: 'Would it be possible to add a dark mode option to the dashboard? It would help reduce eye strain during night shifts.',
    assignee: null,
    company: 'NightWatch Security',
    tags: ['feature-request', 'ui'],
    status: 'open',
    priority: 'low',
    createdAt: '2024-03-12T22:45:00Z',
    isUnread: true,
    recipients: ['emily.chen@nightwatch.com']
  },
  {
    id: '5',
    subject: 'Integration issues with API',
    customer: 'David Lee',
    lastMessage: 'The API endpoints are returning 404 errors since this morning. This is blocking our development process.',
    assignee: null,
    company: 'DevTech Solutions',
    tags: ['api', 'urgent', 'bug'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T08:15:00Z',
    isUnread: true,
    recipients: ['david.lee@devtech.com']
  }
];

// Fetch tickets
export const fetchTickets = createAsyncThunk(
  'inbox/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/tickets');
      // return response.data;
      
      // For now, we'll just return mock data after a short delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return initialTickets;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tickets');
    }
  }
);

// Create ticket
export const createTicket = createAsyncThunk(
  'inbox/createTicket',
  async (ticketData: Partial<Ticket>, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.post('/tickets', ticketData);
      // return response.data;
      
      // For now, we'll just return mock data
      const newTicket: Ticket = {
        id: Math.random().toString(36).substring(2, 9),
        subject: ticketData.subject || 'New Ticket',
        customer: ticketData.customer || 'New Customer',
        lastMessage: ticketData.lastMessage || '',
        assignee: ticketData.assignee || null,
        tags: ticketData.tags || [],
        status: ticketData.status || 'open',
        priority: ticketData.priority || 'medium',
        createdAt: new Date().toISOString(),
        isUnread: true,
        recipients: ticketData.recipients || [],
        company: ticketData.company || '',
      };
      
      return newTicket;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create ticket');
    }
  }
);
