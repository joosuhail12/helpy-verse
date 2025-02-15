
import { Contact } from '@/types/contact';
import { InlineEditField } from '../InlineEditField';
import { Activity } from '@/types/activity';
import { Smile, Meh, Frown } from 'lucide-react';

interface ContactCompanyInfoProps {
  contact: Contact;
  activities: Activity[];
}

export const ContactCompanyInfo = ({ contact, activities }: ContactCompanyInfoProps) => {
  const calculateSentiment = () => {
    const recentActivities = activities.slice(0, 5);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Company</p>
        <InlineEditField
          value={contact.company || ''}
          contactId={contact.id}
          field="company"
          label="Company"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Customer Sentiment</p>
        <div className="flex items-center gap-2 py-1">
          {sentiment === 'positive' && (
            <Smile className="h-5 w-5 text-green-500" />
          )}
          {sentiment === 'neutral' && (
            <Meh className="h-5 w-5 text-yellow-500" />
          )}
          {sentiment === 'negative' && (
            <Frown className="h-5 w-5 text-red-500" />
          )}
          <span className="text-sm capitalize">{sentiment}</span>
        </div>
      </div>
    </div>
  );
};

