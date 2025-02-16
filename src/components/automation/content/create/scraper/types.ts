
import * as z from 'zod';

export const scraperFormSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  chatbotId: z.string().min(1, 'Please select a chatbot'),
  categoryId: z.string().min(1, 'Please select a category'),
});

export type ScraperFormValues = z.infer<typeof scraperFormSchema>;
