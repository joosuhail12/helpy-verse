
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface Subscription {
  id: string;
  name: string;
  status: 'active' | 'canceled' | 'expired';
  startDate: string;
  endDate?: string;
  price: number;
}

interface CustomerSubscriptionsProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
}

const CustomerSubscriptions = ({ subscriptions, isLoading }: CustomerSubscriptionsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subscriptions.map((sub) => (
        <Card key={sub.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{sub.name}</h4>
                <Badge 
                  variant={
                    sub.status === 'active' ? 'default' :
                    sub.status === 'canceled' ? 'destructive' : 'secondary'
                  }
                >
                  {sub.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Started {formatDistanceToNow(new Date(sub.startDate), { addSuffix: true })}
              </p>
            </div>
            <p className="font-medium">${sub.price}/mo</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CustomerSubscriptions;
