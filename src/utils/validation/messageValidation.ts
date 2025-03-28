
import DOMPurify from 'dompurify';

/**
 * Validate and sanitize a message
 * @param message The message to validate and sanitize
 * @param maxLength Maximum allowed length
 * @returns The sanitized message or false if invalid
 */
export const validateAndSanitizeMessage = (message: string, maxLength: number = 2000): string | false => {
  if (!message || message.trim() === '') {
    return false;
  }
  
  // Trim the message
  const trimmedMessage = message.trim();
  
  // Check length
  if (trimmedMessage.length > maxLength) {
    console.warn(`Message exceeded maximum length (${maxLength})`);
    return false;
  }
  
  // Sanitize the message to prevent XSS
  const sanitizedMessage = DOMPurify.sanitize(trimmedMessage);
  
  return sanitizedMessage;
};

/**
 * Checks if a message contains any profanity (basic implementation)
 * @param message The message to check
 * @returns True if profanity detected, false otherwise
 */
export const containsProfanity = (message: string): boolean => {
  // Basic profanity list - in a real app, you'd use a more comprehensive solution
  const profanityList = [
    'badword1',
    'badword2',
    'badword3'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  return profanityList.some(word => lowerMessage.includes(word));
};

/**
 * Check if a message contains personal information that should be protected
 * @param message The message to check
 * @returns True if PII is detected, false otherwise
 */
export const containsPersonalInfo = (message: string): boolean => {
  // Simple patterns for common PII
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const phonePattern = /\b(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}\b/;
  const ssnPattern = /\b\d{3}[-]?\d{2}[-]?\d{4}\b/;
  const creditCardPattern = /\b(?:\d{4}[-\s]?){3}\d{4}\b/;
  
  return emailPattern.test(message) || 
         phonePattern.test(message) || 
         ssnPattern.test(message) || 
         creditCardPattern.test(message);
};

/**
 * Redact potential PII from a message
 * @param message The message to redact
 * @returns The redacted message
 */
export const redactPersonalInfo = (message: string): string => {
  let redacted = message;
  
  // Redact email addresses
  redacted = redacted.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    '[EMAIL REDACTED]'
  );
  
  // Redact phone numbers
  redacted = redacted.replace(
    /\b(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}\b/g,
    '[PHONE REDACTED]'
  );
  
  // Redact SSNs
  redacted = redacted.replace(
    /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
    '[SSN REDACTED]'
  );
  
  // Redact credit card numbers
  redacted = redacted.replace(
    /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    '[CREDIT CARD REDACTED]'
  );
  
  return redacted;
};

export default {
  validateAndSanitizeMessage,
  containsProfanity,
  containsPersonalInfo,
  redactPersonalInfo
};
