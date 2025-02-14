
import React from 'react';
import { mockDomains } from '@/mock/domains';
import { Card } from '@/components/ui/card';
import { DomainListItem } from './components/DomainListItem';

const Domains = () => {
  return (
    <div className="space-y-6">
      <Card>
        <div className="divide-y">
          {mockDomains.map((domain) => (
            <DomainListItem key={domain.id} domain={domain} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Domains;

