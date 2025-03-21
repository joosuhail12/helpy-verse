
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const marketingContent: Content[] = [
  {
    id: '4',
    title: 'Email Templates',
    description: 'Collection of marketing email templates',
    category: 'marketing',
    type: 'snippet',
    status: 'completed',
    lastUpdated: subDays(today, 3).toISOString(),
    messageCount: 450,
    content: `<!DOCTYPE html>
<html>
<head>
  <title>Welcome Email</title>
</head>
<body>
  <h1>Welcome to Our Platform!</h1>
  <p>Dear {{username}},</p>
  <p>We're excited to have you on board...</p>
</body>
</html>`,
    chatbots: [{
      id: '2',
      name: 'Sales Assistant',
    }],
  }
];
