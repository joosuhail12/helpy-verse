
import type { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const mockContent: Content[] = [
  {
    id: '1',
    title: 'API Documentation v2.0',
    description: 'Updated API documentation with new endpoints and examples',
    category: 'documentation',
    type: 'file',
    status: 'completed',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 1250,
    content: '# API Documentation\n\n## Authentication\n\nTo authenticate your requests, include your API key in the Authorization header:\n\n```\nAuthorization: Bearer YOUR_API_KEY\n```\n\n## Endpoints\n\n### GET /api/v2/users\n\nRetrieve a list of users...',
    chatbot: {
      id: '1',
      name: 'Documentation Bot',
    },
  },
  {
    id: '2',
    title: 'Product Pricing Calculator',
    description: 'JavaScript snippet for calculating product pricing with discounts',
    category: 'sales',
    type: 'snippet',
    status: 'completed',
    lastUpdated: subDays(today, 2).toISOString(),
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
    chatbot: {
      id: '2',
      name: 'Sales Assistant',
    },
  },
  {
    id: '3',
    title: 'Support Knowledge Base',
    description: 'Customer support articles and troubleshooting guides',
    category: 'support',
    type: 'website',
    status: 'processing',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 2100,
    progress: 75,
    content: 'https://support.example.com/kb',
    chatbot: {
      id: '3',
      name: 'Support Bot',
    },
  },
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
    chatbot: {
      id: '2',
      name: 'Sales Assistant',
    },
  },
  {
    id: '5',
    title: 'Security Guidelines',
    description: 'Internal security protocols and best practices',
    category: 'documentation',
    type: 'file',
    status: 'failed',
    lastUpdated: subDays(today, 2).toISOString(),
    messageCount: 180,
    errorMessage: 'Access denied: insufficient permissions',
    chatbot: {
      id: '1',
      name: 'Documentation Bot',
    },
  },
  {
    id: '6',
    title: 'Product Feature Overview',
    description: 'Comprehensive overview of platform features',
    category: 'product',
    type: 'website',
    status: 'queued',
    lastUpdated: today.toISOString(),
    messageCount: 0,
    content: 'https://products.example.com/features',
    chatbot: {
      id: '3',
      name: 'Support Bot',
    },
  },
  {
    id: '7',
    title: 'Data Processing Script',
    description: 'Python script for processing customer data',
    category: 'development',
    type: 'snippet',
    status: 'processing',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 320,
    progress: 45,
    content: `import pandas as pd
import numpy as np

def process_customer_data(data_file):
    # Load customer data
    df = pd.read_csv(data_file)
    
    # Clean and process data
    df['age'] = df['birthdate'].apply(calculate_age)
    df['lifetime_value'] = df['purchases'].sum()
    
    return df.to_json()`,
    chatbot: {
      id: '1',
      name: 'Documentation Bot',
    },
  },
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
    chatbot: {
      id: '2',
      name: 'Sales Assistant',
    },
  },
  {
    id: '9',
    title: 'Customer Feedback Analysis',
    description: 'Analysis of customer feedback and satisfaction scores',
    category: 'analytics',
    type: 'file',
    status: 'queued',
    lastUpdated: today.toISOString(),
    messageCount: 0,
    chatbot: {
      id: '3',
      name: 'Support Bot',
    },
  },
  {
    id: '10',
    title: 'API Rate Limiting Policy',
    description: 'Documentation for API rate limiting and quotas',
    category: 'documentation',
    type: 'snippet',
    status: 'completed',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 567,
    content: `# API Rate Limiting

## Default Limits
- 1000 requests per hour
- 10 concurrent connections

## Premium Tier
- 5000 requests per hour
- 25 concurrent connections

Rate limits are applied per API key and reset hourly.`,
    chatbot: {
      id: '1',
      name: 'Documentation Bot',
    },
  }
];
