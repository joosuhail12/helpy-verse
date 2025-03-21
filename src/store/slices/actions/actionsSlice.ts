
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CustomAction } from '@/types/action';

interface ActionsState {
  items: CustomAction[];
}

const initialState: ActionsState = {
  items: [
    {
      id: "1",
      name: 'Create Support Ticket',
      toolName: 'Support API',
      description: 'Creates a new support ticket in the help desk system',
      endpoint: 'https://api.support.com/v1/tickets',
      method: 'POST',
      parameters: [
        {
          id: '1',
          name: 'subject',
          type: 'string',
          description: 'The subject line of the ticket',
          required: true,
        },
        {
          id: '2',
          name: 'description',
          type: 'string',
          description: 'Detailed description of the issue',
          required: true,
        },
        {
          id: '3',
          name: 'priority',
          type: 'string',
          description: 'Ticket priority (low, medium, high)',
          required: true,
          defaultValue: 'medium'
        },
        {
          id: '4',
          name: 'attachments',
          type: 'array',
          description: 'Array of file attachments',
          required: false,
        }
      ],
      headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json'
      },
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
      createdBy: {
        id: '1',
        name: 'Support Admin',
      },
      enabled: true,
    },
    {
      id: '2',
      name: 'Send Customer Email',
      toolName: 'Email Service API',
      description: 'Sends a transactional email to a customer',
      endpoint: 'https://api.email-service.com/v2/send',
      method: 'POST',
      parameters: [
        {
          id: '5',
          name: 'to',
          type: 'string',
          description: 'Recipient email address',
          required: true,
        },
        {
          id: '6',
          name: 'template_id',
          type: 'string',
          description: 'Email template identifier',
          required: true,
        },
        {
          id: '7',
          name: 'variables',
          type: 'object',
          description: 'Template variables to populate',
          required: true,
        },
        {
          id: '8',
          name: 'schedule_time',
          type: 'string',
          description: 'Optional time to schedule the email (ISO 8601)',
          required: false,
        }
      ],
      headers: {
        'X-API-Key': '{api_key}',
        'Content-Type': 'application/json'
      },
      createdAt: '2024-03-16T09:30:00Z',
      updatedAt: '2024-03-16T09:30:00Z',
      createdBy: {
        id: '2',
        name: 'Marketing Manager',
      },
      enabled: true,
    },
    {
      id: '3',
      name: 'Update Customer Profile',
      toolName: 'Customer Database API',
      description: 'Updates customer information in the database',
      endpoint: 'https://api.customer-db.com/v1/customers/{customer_id}',
      method: 'PATCH',
      parameters: [
        {
          id: '9',
          name: 'customer_id',
          type: 'string',
          description: 'Unique identifier of the customer',
          required: true,
        },
        {
          id: '10',
          name: 'profile_data',
          type: 'object',
          description: 'Customer profile information to update',
          required: true,
        },
        {
          id: '11',
          name: 'notify_customer',
          type: 'boolean',
          description: 'Whether to notify the customer of changes',
          required: false,
          defaultValue: 'false'
        }
      ],
      headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json'
      },
      createdAt: '2024-03-17T14:20:00Z',
      updatedAt: '2024-03-17T14:20:00Z',
      createdBy: {
        id: '3',
        name: 'Customer Success Manager',
      },
      enabled: true,
    },
    {
      id: '4',
      name: 'Generate Invoice',
      toolName: 'Billing API',
      description: 'Generates a new invoice for a customer',
      endpoint: 'https://api.billing.com/v1/invoices',
      method: 'POST',
      parameters: [
        {
          id: '12',
          name: 'customer_id',
          type: 'string',
          description: 'Customer identifier',
          required: true,
        },
        {
          id: '13',
          name: 'items',
          type: 'array',
          description: 'Array of line items for the invoice',
          required: true,
        },
        {
          id: '14',
          name: 'due_date',
          type: 'string',
          description: 'Invoice due date (ISO 8601)',
          required: true,
        },
        {
          id: '15',
          name: 'notes',
          type: 'string',
          description: 'Additional notes to appear on the invoice',
          required: false,
        }
      ],
      headers: {
        'Authorization': 'Bearer {token}',
        'Content-Type': 'application/json'
      },
      createdAt: '2024-03-18T11:45:00Z',
      updatedAt: '2024-03-18T11:45:00Z',
      createdBy: {
        id: '4',
        name: 'Billing Administrator',
      },
      enabled: false,
    }
  ],
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

