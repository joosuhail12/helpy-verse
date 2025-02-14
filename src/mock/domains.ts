
export interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  dateAdded: string;
  verificationRecord: string;
  error?: string;
}

export const mockDomains: Domain[] = [
  {
    id: '1',
    domain: 'example.com',
    status: 'verified',
    dateAdded: '2024-03-15T10:00:00Z',
    verificationRecord: 'lovable-verify=abc123',
  },
  {
    id: '2',
    domain: 'test.company.co',
    status: 'pending',
    dateAdded: '2024-03-16T14:30:00Z',
    verificationRecord: 'lovable-verify=def456',
  },
  {
    id: '3',
    domain: 'failed-domain.net',
    status: 'failed',
    dateAdded: '2024-03-14T09:15:00Z',
    verificationRecord: 'lovable-verify=xyz789',
    error: 'DNS record not found',
  },
];
