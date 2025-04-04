
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { mockDomains } from '@/mock/domains';
import { DomainDNSCard } from '../domains/components/DomainDNSCard';
import { DomainVerificationCard } from '../domains/components/DomainVerificationCard';
import { DomainHealthCard } from '../domains/components/DomainHealthCard';
import { DomainHeader } from '../domains/components/DomainHeader';

const DomainDetail = () => {
  const { id } = useParams();
  const domain = mockDomains.find(d => d.id === id);

  if (!domain) {
    return <div>Domain not found</div>;
  }

  return (
    <div className="space-y-6">
      <DomainHeader domain={domain} />
      <div className="grid gap-6 md:grid-cols-2">
        <DomainVerificationCard domain={domain} />
        <DomainHealthCard domain={domain} />
      </div>
      <DomainDNSCard domain={domain} />
    </div>
  );
};

export default DomainDetail;
