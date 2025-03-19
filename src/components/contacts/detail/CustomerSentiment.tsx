
import { Smile, Meh, Frown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity } from '@/types/activity';
import { CustomerSentimentProps } from '@/types/contact';

export const CustomerSentiment = ({ activities }: CustomerSentimentProps) => {
  // Calculate sentiment based on recent activities
  const calculateSentiment = () => {
    const recentActivities = activities?.slice(0, 5) || [];
    let positiveCount = 0;
    let negativeCount = 0;

    recentActivities.forEach(activity => {
      if (activity.metadata?.category === 'positive') positiveCount++;
      if (activity.metadata?.category === 'negative') negativeCount++;
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const sentiment = calculateSentiment();

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Customer Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          {sentiment === 'positive' && (
            <Smile className="h-8 w-8 text-green-500" />
          )}
          {sentiment === 'neutral' && (
            <Meh className="h-8 w-8 text-yellow-500" />
          )}
          {sentiment === 'negative' && (
            <Frown className="h-8 w-8 text-red-500" />
          )}
          <p className="text-sm capitalize">{sentiment} Sentiment</p>
        </div>
      </CardContent>
    </Card>
  );
};
