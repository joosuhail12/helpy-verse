
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();
const defaultAuthor = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
};

export const marketingContent: Content[] = [
  {
    id: '4',
    title: 'Email Templates',
    description: 'Collection of marketing email templates',
    category: 'marketing',
    contentType: 'email',
    type: 'snippet',
    status: 'completed',
    createdAt: subDays(today, 7).toISOString(),
    updatedAt: subDays(today, 3).toISOString(), // Add the missing property
    lastUpdated: subDays(today, 3).toISOString(),
    author: defaultAuthor,
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
