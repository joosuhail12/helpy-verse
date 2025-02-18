
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const developmentContent: Content[] = [
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
  }
];
