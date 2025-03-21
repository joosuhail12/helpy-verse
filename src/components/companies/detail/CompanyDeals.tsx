
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CompanyDealsProps {
  company: any; // Replace with actual Company type
}

export const CompanyDeals: React.FC<CompanyDealsProps> = ({ company }) => {
  // Mock deals data
  const deals = [
    {
      id: '1',
      name: 'Annual Subscription',
      value: 12000,
      stage: 'negotiation',
      probability: 70,
      expectedCloseDate: '2023-12-15',
    },
    {
      id: '2',
      name: 'Custom Implementation',
      value: 5000,
      stage: 'proposal',
      probability: 50,
      expectedCloseDate: '2024-02-10',
    },
  ];

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'lead':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Lead</Badge>;
      case 'proposal':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Proposal</Badge>;
      case 'negotiation':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Negotiation</Badge>;
      case 'closed-won':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Closed (Won)</Badge>;
      case 'closed-lost':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Closed (Lost)</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Deals</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </CardHeader>
      <CardContent>
        {deals.length > 0 ? (
          <div className="space-y-4">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex justify-between items-center p-3 rounded-lg hover:bg-muted cursor-pointer"
              >
                <div>
                  <h4 className="font-medium">{deal.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getStageBadge(deal.stage)}
                    <span className="text-sm text-muted-foreground">
                      ${deal.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{deal.probability}%</div>
                  <div className="text-xs text-muted-foreground">
                    Due {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            No deals yet. Create your first deal!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyDeals;
