
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, BarChart2 } from 'lucide-react';
import { Company } from '@/types/company';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface CompanyDealsProps {
  company: Company;
}

export const CompanyDeals: React.FC<CompanyDealsProps> = ({ company }) => {
  // Mock deals for demonstration
  const deals = [
    {
      id: '1',
      name: 'Annual Service Contract',
      value: 25000,
      stage: 'Proposal',
      probability: 60,
      expectedCloseDate: '2023-12-15',
    },
    {
      id: '2',
      name: 'Software Implementation',
      value: 75000,
      stage: 'Negotiation',
      probability: 80,
      expectedCloseDate: '2023-11-30',
    },
    {
      id: '3',
      name: 'Hardware Upgrade',
      value: 35000,
      stage: 'Qualification',
      probability: 40,
      expectedCloseDate: '2024-01-20',
    },
  ];

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  const getStageBadgeVariant = (stage: string) => {
    switch (stage) {
      case 'Qualification':
        return 'outline';
      case 'Proposal':
        return 'secondary';
      case 'Negotiation':
        return 'default';
      case 'Closed Won':
        return 'success';
      case 'Closed Lost':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg">Deals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {deals.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Weighted Value</p>
                <p className="text-2xl font-bold">${Math.round(weightedValue).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {deals.map((deal) => (
                <div key={deal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{deal.name}</h3>
                    <Badge variant={getStageBadgeVariant(deal.stage)}>{deal.stage}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Value:</span>{' '}
                      <span className="font-medium">${deal.value.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Close Date:</span>{' '}
                      <span className="font-medium">
                        {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Probability</span>
                      <span>{deal.probability}%</span>
                    </div>
                    <Progress value={deal.probability} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p>No deals found</p>
            <p className="text-sm mt-1">Create deals to track opportunities with this company</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyDeals;
