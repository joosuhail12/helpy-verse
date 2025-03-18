
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Company } from '@/types/company';

interface Deal {
  id: string;
  name: string;
  value: number;
  stage: 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  closingDate: string;
}

interface CompanyDealsProps {
  company: Company;
}

export const CompanyDeals: React.FC<CompanyDealsProps> = ({ company }) => {
  // Mock data for now
  const deals: Deal[] = [
    {
      id: '1',
      name: 'Annual subscription renewal',
      value: 12000,
      stage: 'negotiation',
      closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Enterprise license expansion',
      value: 48000,
      stage: 'proposal',
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const getStageBadge = (stage: Deal['stage']) => {
    const stageConfig = {
      'qualification': { label: 'Qualification', color: 'bg-blue-100 text-blue-800' },
      'proposal': { label: 'Proposal', color: 'bg-purple-100 text-purple-800' },
      'negotiation': { label: 'Negotiation', color: 'bg-yellow-100 text-yellow-800' },
      'closed-won': { label: 'Closed Won', color: 'bg-green-100 text-green-800' },
      'closed-lost': { label: 'Closed Lost', color: 'bg-red-100 text-red-800' },
    };

    const config = stageConfig[stage];
    return (
      <Badge className={`${config.color} border-none`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Deals</CardTitle>
        <Button size="sm">
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Deal
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {deals.length > 0 ? (
          <div className="space-y-4">
            {deals.map((deal) => (
              <div key={deal.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{deal.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getStageBadge(deal.stage)}
                    <span className="text-sm text-muted-foreground">
                      Closing: {new Date(deal.closingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 text-xl font-semibold">
                  ${deal.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No deals associated with this company</p>
            <Button variant="outline" className="mt-2">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create First Deal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyDeals;
