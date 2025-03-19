
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from '@/types/activity';

export interface CustomerSentimentProps {
  activities: Activity[];
}

export const CustomerSentiment = ({ activities }: CustomerSentimentProps) => {
  // Calculate sentiment score based on activities
  const calculateSentiment = () => {
    if (!activities || activities.length === 0) return null;
    
    // Simple implementation - in a real app, this would use NLP or more complex logic
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    activities.forEach(activity => {
      // This is a simplified example - real implementation would do actual sentiment analysis
      const text = activity.description || '';
      if (text.includes('happy') || text.includes('satisfied') || text.includes('thank')) {
        positive++;
      } else if (text.includes('unhappy') || text.includes('issue') || text.includes('problem')) {
        negative++;
      } else {
        neutral++;
      }
    });
    
    const total = positive + negative + neutral;
    return {
      positive: Math.round((positive / total) * 100) || 0,
      negative: Math.round((negative / total) * 100) || 0,
      neutral: Math.round((neutral / total) * 100) || 0,
      overall: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral',
    };
  };
  
  const sentiment = calculateSentiment();
  
  if (!sentiment) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Customer Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Positive</span>
            <span className="text-green-600 font-medium">{sentiment.positive}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${sentiment.positive}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Neutral</span>
            <span className="text-gray-600 font-medium">{sentiment.neutral}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gray-500 h-2.5 rounded-full" 
              style={{ width: `${sentiment.neutral}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Negative</span>
            <span className="text-red-600 font-medium">{sentiment.negative}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-red-500 h-2.5 rounded-full" 
              style={{ width: `${sentiment.negative}%` }}
            ></div>
          </div>
          
          <div className="pt-4 text-center">
            <span className="text-sm text-gray-500">Based on {activities.length} interactions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
