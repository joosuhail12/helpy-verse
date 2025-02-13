
import { CustomField } from '@/types/customField';

export const getSuggestions = (fieldType: CustomField['type'], value: string): string[] => {
  // This would normally fetch from your backend, for now using mock suggestions
  const suggestionMap: Record<string, string[]> = {
    'email': ['@gmail.com', '@yahoo.com', '@outlook.com'],
    'phone': ['+1', '+44', '+81'],
    'currency': ['USD', 'EUR', 'GBP'],
    'text': [],
    'url': ['https://', 'http://'],
  };

  if (!value) return [];
  
  return (suggestionMap[fieldType] || [])
    .filter(suggestion => suggestion.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 5);
};
