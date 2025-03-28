
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges Tailwind CSS classes with clsx and tailwind-merge
 * This prevents class conflicts and duplications
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
