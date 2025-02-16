
import * as z from 'zod';

export const snippetFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  chatbotId: z.string().min(1, 'Please select a chatbot'),
  categoryId: z.string().min(1, 'Please select a category'),
});

export type SnippetFormValues = z.infer<typeof snippetFormSchema>;
