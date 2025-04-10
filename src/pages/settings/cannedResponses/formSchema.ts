
import * as z from 'zod';
import { validateShortcut } from '@/utils/shortcutUtils';

export const shareSchema = z.object({
  teamId: z.string().optional(),
  userId: z.string().optional(),
  teamName: z.string().optional(),
  userName: z.string().optional(),
  permissions: z.enum(['view', 'edit']),
});

export const formSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less"),
  content: z.string()
    .min(1, "Content is required"),
  shortcut: z.string()
    .min(1, "Shortcut is required")
    .max(20, "Shortcut must be 20 characters or less")
    .regex(/^[a-zA-Z0-9-_]+$/, "Shortcut can only contain letters, numbers, hyphens, and underscores")
    .refine(val => validateShortcut(val) === null, {
      message: "This shortcut is already in use"
    }),
  category: z.string()
    .min(1, "Category is required"),
  isShared: z.boolean(),
  createdBy: z.string(),
  sharedWith: z.array(shareSchema).optional(),
});

export type FormValues = z.infer<typeof formSchema>;
