
export interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export const mockContentCategories: ContentCategory[] = [
  {
    id: '1',
    name: 'Product Documentation',
    description: 'Official product documentation and guides',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'FAQs',
    description: 'Frequently asked questions and answers',
    createdAt: '2024-03-14T15:30:00Z',
  },
  {
    id: '3',
    name: 'Knowledge Base',
    description: 'General knowledge base articles',
    createdAt: '2024-03-13T09:15:00Z',
  },
];

