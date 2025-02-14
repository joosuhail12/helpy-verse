
export interface DnsRecord {
  type: 'TXT' | 'MX' | 'CNAME';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  dateAdded: string;
  verificationRecord: string;
  error?: string;
  ownerConfirmed: boolean;
  dnsRecords?: DnsRecord[];
}

export const mockDomains: Domain[] = [
  {
    id: '1',
    domain: 'example.com',
    status: 'verified',
    dateAdded: '2024-03-15T10:00:00Z',
    verificationRecord: 'lovable-verify=abc123',
    ownerConfirmed: true,
    dnsRecords: [
      {
        type: 'TXT',
        name: '_lovable-verification.example.com',
        value: 'lovable-verify=abc123',
        ttl: 3600
      },
      {
        type: 'MX',
        name: 'example.com',
        value: 'mx.lovable.mail',
        ttl: 3600,
        priority: 10
      },
      {
        type: 'CNAME',
        name: 'mail.example.com',
        value: 'mail.lovable.com',
        ttl: 3600
      }
    ]
  },
  {
    id: '2',
    domain: 'test.company.co',
    status: 'pending',
    dateAdded: '2024-03-16T14:30:00Z',
    verificationRecord: 'lovable-verify=def456',
    ownerConfirmed: true,
    dnsRecords: [
      {
        type: 'TXT',
        name: '_lovable-verification.test.company.co',
        value: 'lovable-verify=def456',
        ttl: 3600
      },
      {
        type: 'MX',
        name: 'test.company.co',
        value: 'mx.lovable.mail',
        ttl: 3600,
        priority: 10
      },
      {
        type: 'CNAME',
        name: 'mail.test.company.co',
        value: 'mail.lovable.com',
        ttl: 3600
      }
    ]
  },
  {
    id: '3',
    domain: 'failed-domain.net',
    status: 'failed',
    dateAdded: '2024-03-14T09:15:00Z',
    verificationRecord: 'lovable-verify=xyz789',
    error: 'DNS record not found',
    ownerConfirmed: true
  }
];

