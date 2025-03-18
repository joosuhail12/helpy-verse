
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Deal {
  id: string;
  name: string;
  amount: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
}

interface CompanyDealsProps {
  companyId: string;
}

const CompanyDeals: React.FC<CompanyDealsProps> = ({ companyId }) => {
  // This would be fetched from the API in a real application
  const deals: Deal[] = [
    {
      id: '1',
      name: 'Enterprise License',
      amount: 25000,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: '2023-07-30',
    },
    {
      id: '2',
      name: 'Professional Services',
      amount: 15000,
      stage: 'negotiation',
      probability: 80,
      expectedCloseDate: '2023-06-15',
    },
    {
      id: '3',
      name: 'Support Renewal',
      amount: 10000,
      stage: 'closed-won',
      probability: 100,
      expectedCloseDate: '2023-05-01',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStageBadgeVariant = (stage: Deal['stage']) => {
    switch (stage) {
      case 'prospecting':
        return 'secondary';
      case 'qualification':
        return 'outline';
      case 'proposal':
        return 'default';
      case 'negotiation':
        return 'secondary';
      case 'closed-won':
        return 'success';
      case 'closed-lost':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTotalAmount = () => {
    return deals.reduce((sum, deal) => sum + deal.amount, 0);
  };

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-lg">Deals</CardTitle>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {deals.length > 0 ? (
            <>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">Total Value</div>
                <div className="font-bold">{formatCurrency(getTotalAmount())}</div>
              </div>
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{deal.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStageBadgeVariant(deal.stage)}>
                            {deal.stage.replace('-', ' ')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(deal.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center justify-end mb-1">
                          <span className="text-muted-foreground mr-2">Probability:</span>
                          <span className="font-medium">{deal.probability}%</span>
                        </div>
                        <Progress value={deal.probability} className="h-2 w-24" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Expected close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No deals associated with this company</p>
              <Button className="mt-4" size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDeals;
