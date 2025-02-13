
export interface CustomObject {
  id: string;
  name: string;
  description: string;
  slug: string;
  connectionType: 'customer' | 'ticket' | null;
  showInCustomerContext: boolean;
  showInCustomerDetail: boolean;
  showInCompanyDetail: boolean;
  createdAt: string;
  updatedAt: string;
  fields: {
    id: string;
    name: string;
    type: string;
    required: boolean;
    description: string;
    createdAt: string;
    updatedAt: string;
    history: {
      id: string;
      timestamp: string;
      userId: string;
      userName: string;
      action: 'created' | 'updated' | 'deleted';
      changes?: {
        field: string;
        oldValue: any;
        newValue: any;
      }[];
    }[];
  }[];
}

export const mockCustomObjects: CustomObject[] = [
  {
    id: '1',
    name: 'Orders',
    description: 'Track customer orders and their status',
    slug: 'orders',
    connectionType: 'customer',
    showInCustomerContext: true,
    showInCustomerDetail: true,
    showInCompanyDetail: false,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    fields: [
      {
        id: '1',
        name: 'Order Number',
        type: 'text',
        required: true,
        description: 'Unique identifier for the order',
        createdAt: '2024-03-10T10:00:00Z',
        updatedAt: '2024-03-10T10:00:00Z',
        history: [{
          id: '1',
          timestamp: '2024-03-10T10:00:00Z',
          userId: 'system',
          userName: 'System',
          action: 'created'
        }]
      },
      {
        id: '2',
        name: 'Total Amount',
        type: 'number',
        required: true,
        description: 'Total amount of the order',
        createdAt: '2024-03-10T10:00:00Z',
        updatedAt: '2024-03-10T10:00:00Z',
        history: [{
          id: '1',
          timestamp: '2024-03-10T10:00:00Z',
          userId: 'system',
          userName: 'System',
          action: 'created'
        }]
      }
    ]
  },
  {
    id: '2',
    name: 'Products',
    description: 'Manage product catalog',
    slug: 'products',
    connectionType: null,
    showInCustomerContext: false,
    showInCustomerDetail: false,
    showInCompanyDetail: true,
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z',
    fields: [
      {
        id: '1',
        name: 'SKU',
        type: 'text',
        required: true,
        description: 'Stock Keeping Unit',
        createdAt: '2024-03-10T11:00:00Z',
        updatedAt: '2024-03-10T11:00:00Z',
        history: [{
          id: '1',
          timestamp: '2024-03-10T11:00:00Z',
          userId: 'system',
          userName: 'System',
          action: 'created'
        }]
      },
      {
        id: '2',
        name: 'Price',
        type: 'number',
        required: true,
        description: 'Product price',
        createdAt: '2024-03-10T11:00:00Z',
        updatedAt: '2024-03-10T11:00:00Z',
        history: [{
          id: '1',
          timestamp: '2024-03-10T11:00:00Z',
          userId: 'system',
          userName: 'System',
          action: 'created'
        }]
      }
    ]
  }
];
