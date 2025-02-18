
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const hrContent: Content[] = [
  {
    id: '8',
    title: 'Onboarding Checklist',
    description: 'New employee onboarding procedures and requirements',
    category: 'hr',
    type: 'file',
    status: 'completed',
    lastUpdated: subDays(today, 5).toISOString(),
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
