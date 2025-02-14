
import { mockCannedResponses } from '@/mock/cannedResponses';

export const isShortcutUnique = (shortcut: string, excludeId?: string): boolean => {
  return !mockCannedResponses.some(
    response => response.shortcut === shortcut && response.id !== excludeId
  );
};

export const getSimilarShortcuts = (input: string): string[] => {
  if (!input) return [];
  
  return mockCannedResponses
    .map(response => response.shortcut)
    .filter(existingShortcut => 
      existingShortcut.toLowerCase().includes(input.toLowerCase())
    )
    .slice(0, 5); // Limit to 5 suggestions
};

export const validateShortcut = (shortcut: string): string | null => {
  if (!shortcut) return "Shortcut is required";
  if (shortcut.length > 20) return "Shortcut must be 20 characters or less";
  if (!/^[a-zA-Z0-9-_]+$/.test(shortcut)) {
    return "Shortcut can only contain letters, numbers, hyphens, and underscores";
  }
  if (!isShortcutUnique(shortcut)) {
    return "This shortcut is already in use";
  }
  return null;
};
