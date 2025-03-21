
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();
const defaultAuthor = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
};

export const hrContent: Content[] = [
  {
    id: '8',
    title: 'Onboarding Checklist',
    description: 'New employee onboarding procedures and requirements',
    category: 'hr',
    contentType: 'checklist',
    type: 'file',
    status: 'completed',
    createdAt: subDays(today, 10).toISOString(),
    lastUpdated: subDays(today, 5).toISOString(),
    author: defaultAuthor,
    messageCount: 890,
    content: `# New Employee Onboarding Checklist

## Before First Day
- [ ] Prepare workstation
- [ ] Set up email account
- [ ] Configure access credentials

## First Day
- [ ] Team introduction
- [ ] Security training
- [ ] Platform overview`,
    chatbots: [{
      id: '2',
      name: 'Sales Assistant',
    }],
  }
];
