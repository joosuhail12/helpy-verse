
export interface CustomObject {
  id: string;
  name: string;
  description: string;
  slug: string;
  showInCustomerContext: boolean;
  createdAt: string;
  updatedAt: string;
  fields: {
    id: string;
    name: string;
    type: string;
    required: boolean;
  }[];
}

export const mockCustomObjects: CustomObject[] = [
  {
    id: '1',
    name: 'Orders',
    description: 'Track customer orders and their status',
    slug: 'orders',
    showInCustomerContext: true,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    fields: [
      {
        id: '1',
        name: 'Order Number',
        type: 'text',
        required: true
      },
      {
        id: '2',
        name: 'Total Amount',
        type: 'number',
        required: true
      }
    ]
  },
  {
    id: '2',
    name: 'Products',
    description: 'Manage product catalog',
    slug: 'products',
    showInCustomerContext: false,
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z',
    fields: [
      {
        id: '1',
        name: 'SKU',
        type: 'text',
        required: true
      },
      {
        id: '2',
        name: 'Price',
        type: 'number',
        required: true
      }
    ]
  }
];
