
import DOMPurify from 'dompurify';
import { isValidHttpUrl } from './validationUtils';

/**
 * Message validation errors
 */
export type MessageValidationError = {
  code: 'xss' | 'length' | 'spam' | 'format' | 'url';
  message: string;
};

/**
 * Validate and sanitize chat message content
 */
export const validateAndSanitizeMessage = (
  content: string, 
  options: {
    maxLength?: number;
    allowHtml?: boolean;
    allowUrls?: boolean;
    blockWords?: string[];
  } = {}
): { 
  isValid: boolean; 
  sanitizedContent: string; 
  errors: MessageValidationError[];
} => {
  const {
    maxLength = 2000,
    allowHtml = false,
    allowUrls = true,
    blockWords = []
  } = options;
  
  const errors: MessageValidationError[] = [];
  
  // Sanitize content to prevent XSS
  let sanitizedContent = allowHtml 
    ? DOMPurify.sanitize(content, { 
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
      })
    : DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  
  // Check message length
  if (sanitizedContent.length > maxLength) {
    errors.push({
      code: 'length',
      message: `Message exceeds maximum length of ${maxLength} characters`
    });
  }
  
  // Check for blocked words
  if (blockWords.length > 0) {
    const lowerContent = sanitizedContent.toLowerCase();
    for (const word of blockWords) {
      if (lowerContent.includes(word.toLowerCase())) {
        sanitizedContent = sanitizedContent.replace(
          new RegExp(word, 'gi'), 
          '*'.repeat(word.length)
        );
        errors.push({
          code: 'spam',
          message: 'Message contains blocked words'
        });
      }
    }
  }
  
  // Validate URLs if present and not allowed
  if (!allowUrls) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = sanitizedContent.match(urlRegex);
    
    if (urls && urls.length > 0) {
      for (const url of urls) {
        if (isValidHttpUrl(url)) {
          sanitizedContent = sanitizedContent.replace(url, '[URL REMOVED]');
          errors.push({
            code: 'url',
            message: 'URLs are not allowed in this conversation'
          });
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    sanitizedContent,
    errors
  };
};

/**
 * Check if content potentially contains suspicious patterns
 */
export const detectSuspiciousContent = (content: string): boolean => {
  // Check for script tags or suspicious patterns
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /on\w+=/gi, // onclick, onload, etc.
    /expression\(/gi, // CSS expressions
    /<iframe/gi
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(content));
};

/**
 * Check if the message is potentially a spam
 */
export const isSpamMessage = (
  content: string, 
  options: { 
    maxRepeatedChars?: number;
    maxUrls?: number; 
  } = {}
): boolean => {
  const { maxRepeatedChars = 5, maxUrls = 3 } = options;
  
  // Check for repeated characters (like "aaaaa")
  const repeatedCharsRegex = new RegExp(`(.)\\1{${maxRepeatedChars},}`, 'g');
  if (repeatedCharsRegex.test(content)) {
    return true;
  }
  
  // Check for too many URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = content.match(urlRegex);
  if (urls && urls.length > maxUrls) {
    return true;
  }
  
  // Check for all caps (shouting)
  const words = content.split(/\s+/);
  const capsWords = words.filter(word => word.length > 3 && word === word.toUpperCase());
  if (capsWords.length > words.length * 0.7) { // If more than 70% of words are all caps
    return true;
  }
  
  return false;
};
