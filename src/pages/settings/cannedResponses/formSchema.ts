
import * as z from 'zod';
import { validateShortcut } from '@/utils/shortcutUtils';

export const shareSchema = z.object({
  teamId: z.string().optional(),
  typeOfSharing: z.string(),
});

export const formSchema = z.object({
  name: z.string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less"),
  message: z.string()
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
  sharedTeams: z.array(shareSchema).optional(),
});

export type FormValues = z.infer<typeof formSchema>;
