import DOMPurify from 'dompurify';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  sanitizedContent: string;
  errors: { code: string; message: string }[];
}

/**
 * Validation options
 */
export interface ValidationOptions {
  maxLength?: number;
  allowHtml?: boolean;
  allowUrls?: boolean;
  blockWords?: string[];
}

/**
 * Validate and sanitize a message with detailed result
 * @param message The message to validate and sanitize
 * @param options Validation options
 * @returns Validation result with sanitized content or errors
 */
export const validateAndSanitizeMessage = (message: string, options: ValidationOptions = {}): ValidationResult => {
  const {
    maxLength = 2000,
    allowHtml = false,
    allowUrls = true,
    blockWords = []
  } = options;
  
  const errors: { code: string; message: string }[] = [];
  
  if (!message || message.trim() === '') {
    return {
      isValid: false,
      sanitizedContent: '',
      errors: [{ code: 'empty', message: 'Message cannot be empty' }]
    };
  }
  
  // Trim the message
  const trimmedMessage = message.trim();
  
  // Check length
  if (trimmedMessage.length > maxLength) {
    errors.push({
      code: 'length',
      message: `Message exceeded maximum length (${maxLength})`
    });
  }
  
  // Check for blocked words
  if (blockWords.length > 0) {
    const lowerMessage = trimmedMessage.toLowerCase();
    const foundBlockedWords = blockWords.filter(word => 
      lowerMessage.includes(word.toLowerCase())
    );
    
    if (foundBlockedWords.length > 0) {
      errors.push({
        code: 'blocked_words',
        message: 'Message contains blocked words'
      });
    }
  }
  
  // Check for URLs if not allowed
  if (!allowUrls) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(trimmedMessage)) {
      errors.push({
        code: 'urls_not_allowed',
        message: 'URLs are not allowed in messages'
      });
    }
  }
  
  // Sanitize the message
  let sanitizedContent = allowHtml 
    ? DOMPurify.sanitize(trimmedMessage)
    : trimmedMessage;
  
  return {
    isValid: errors.length === 0,
    sanitizedContent,
    errors
  };
};

/**
 * Simple version for backward compatibility
 * @param message The message to validate and sanitize
 * @param maxLength Maximum allowed length
 * @returns The sanitized message or false if invalid
 */
export const validateMessage = (message: string, maxLength: number = 2000): string | false => {
  if (!message || message.trim() === '') {
    return false;
  }
  
  // Trim the message
  const trimmedMessage = message.trim();
  
  // Check length
  if (trimmedMessage.length > maxLength) {
    return false;
  }
  
  return trimmedMessage;
};

/**
 * Detect suspicious content in a message
 * @param message The message to check
 * @returns True if suspicious content is detected
 */
export const detectSuspiciousContent = (message: string): boolean => {
  // Check for potential script injection attempts
  const scriptRegex = /<script|javascript:|data:text\/html|eval\(|document\.cookie/i;
  if (scriptRegex.test(message)) {
    return true;
  }
  
  // Check for excessive use of special characters (potential zalgo text or spam)
  const specialCharsRegex = /[^\w\s]/g;
  const specialChars = message.match(specialCharsRegex) || [];
  if (specialChars.length > message.length * 0.3) {
    return true;
  }
  
  // Check for repeated characters (potential spam)
  const repeatedCharsRegex = /(.)\1{10,}/;
  if (repeatedCharsRegex.test(message)) {
    return true;
  }
  
  return false;
};

/**
 * Check if a message appears to be spam
 * @param message The message to check
 * @returns True if the message appears to be spam
 */
export const isSpamMessage = (message: string): boolean => {
  if (!message) return false;
  
  // Check for all caps
  const isAllCaps = message.length > 5 && message === message.toUpperCase();
  
  // Check for repeated phrases
  const repeatedPhrasesRegex = /(.{5,})\1{2,}/;
  const hasRepeatedPhrases = repeatedPhrasesRegex.test(message);
  
  // Check for common spam phrases
  const spamPhrases = [
    'viagra', 'cialis', 'free money', 'earn money fast', 'get rich',
    'lottery winner', 'casino bonus', 'prize winner', 'you won',
    'bitcoin investment', 'forex trading', 'weight loss pill'
  ];
  
  const lowerMessage = message.toLowerCase();
  const containsSpamPhrase = spamPhrases.some(phrase => 
    lowerMessage.includes(phrase)
  );
  
  // Check for excessive URL count
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = message.match(urlRegex) || [];
  const excessiveUrls = urls.length > 2;
  
  return isAllCaps || hasRepeatedPhrases || containsSpamPhrase || excessiveUrls;
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
  validateMessage,
  detectSuspiciousContent,
  isSpamMessage,
  containsProfanity,
  containsPersonalInfo,
  redactPersonalInfo
};
