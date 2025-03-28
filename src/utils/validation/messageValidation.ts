
/**
 * Message validation utilities for detecting spam, suspicious content, etc.
 */

// List of potentially suspicious patterns
const SUSPICIOUS_PATTERNS = [
  /\b(password|credit card|ssn|social security)\b/i,
  /\b\d{16}\b/, // Potential credit card numbers
  /\b\d{3}-\d{2}-\d{4}\b/, // US SSN pattern
];

// List of common spam phrases
const SPAM_PHRASES = [
  "click here to win",
  "buy now",
  "limited time offer",
  "special promotion",
  "act now",
  "free money",
  "make money fast",
  "get rich quick",
  "lottery winner",
];

/**
 * Check if a message contains potentially sensitive/suspicious information
 */
export const detectSuspiciousContent = (message: string): boolean => {
  if (!message || typeof message !== 'string') return false;
  
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(message));
};

/**
 * Check if a message appears to be spam
 */
export const isSpamMessage = (message: string): boolean => {
  if (!message || typeof message !== 'string') return false;
  
  const lowerCaseMessage = message.toLowerCase();
  
  // Check for spam phrases
  const containsSpamPhrase = SPAM_PHRASES.some(phrase => 
    lowerCaseMessage.includes(phrase.toLowerCase())
  );
  
  // Check for excessive capitalization (SHOUTING)
  const uppercaseRatio = (message.match(/[A-Z]/g)?.length || 0) / message.length;
  const excessiveCaps = uppercaseRatio > 0.7 && message.length > 10;
  
  // Check for excessive use of special characters
  const specialCharsRatio = (message.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g)?.length || 0) / message.length;
  const excessiveSpecialChars = specialCharsRatio > 0.3 && message.length > 10;
  
  // Check for excessive repeating characters
  const hasRepeatingChars = /(.)\1{7,}/.test(message);
  
  // Check for excessive URLs
  const urlCount = (message.match(/https?:\/\/[^\s]+/g) || []).length;
  const excessiveUrls = urlCount > 3;
  
  return containsSpamPhrase || excessiveCaps || excessiveSpecialChars || hasRepeatingChars || excessiveUrls;
};

/**
 * Validate message content against various criteria
 */
export const validateMessage = (
  message: string, 
  options: {
    maxLength?: number;
    blockSuspicious?: boolean;
    blockSpam?: boolean;
    blockWords?: string[];
  } = {}
): { isValid: boolean; reason?: string } => {
  const {
    maxLength = 5000,
    blockSuspicious = false,
    blockSpam = true,
    blockWords = [],
  } = options;
  
  // Check if message is empty
  if (!message || message.trim() === '') {
    return { 
      isValid: false, 
      reason: 'Message cannot be empty' 
    };
  }
  
  // Check message length
  if (message.length > maxLength) {
    return { 
      isValid: false, 
      reason: `Message exceeds maximum length of ${maxLength} characters` 
    };
  }
  
  // Check for blocked words
  if (blockWords.length > 0) {
    const lowerCaseMessage = message.toLowerCase();
    for (const word of blockWords) {
      if (lowerCaseMessage.includes(word.toLowerCase())) {
        return { 
          isValid: false, 
          reason: 'Message contains blocked words' 
        };
      }
    }
  }
  
  // Check for suspicious content
  if (blockSuspicious && detectSuspiciousContent(message)) {
    return { 
      isValid: false, 
      reason: 'Message contains potentially sensitive information' 
    };
  }
  
  // Check for spam
  if (blockSpam && isSpamMessage(message)) {
    return { 
      isValid: false, 
      reason: 'Message appears to be spam' 
    };
  }
  
  return { isValid: true };
};

export default {
  detectSuspiciousContent,
  isSpamMessage,
  validateMessage
};
