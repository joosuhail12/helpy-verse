
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();
const defaultAuthor = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
};

export const salesContent: Content[] = [
  {
    id: '2',
    title: 'Product Pricing Calculator',
    description: 'JavaScript snippet for calculating product pricing with discounts',
    category: 'sales',
    contentType: 'calculator',
    type: 'snippet',
    status: 'completed',
    createdAt: subDays(today, 5).toISOString(),
    updatedAt: subDays(today, 2).toISOString(), // Add the missing property
    lastUpdated: subDays(today, 2).toISOString(),
    author: defaultAuthor,
    messageCount: 850,
    content: `function calculatePrice(basePrice, quantity, discountCode) {
  const discounts = {
    'SUMMER10': 0.10,
    'BULK20': 0.20,
    'VIP30': 0.30
  };
  
  let discount = discountCode ? discounts[discountCode] || 0 : 0;
  if (quantity >= 10) discount += 0.05;
  
  const finalPrice = basePrice * quantity * (1 - discount);
  return finalPrice.toFixed(2);
}`,
    chatbots: [{
      id: '2',
      name: 'Sales Assistant',
    }],
  }
];
