
/**
 * Message validation and safety utilities
 */

// Detect potentially suspicious content in messages
export const detectSuspiciousContent = (content: string): boolean => {
  if (!content) return false;
  
  // Simplified check for demonstration purposes
  // In a real app, you would use more sophisticated detection
  const suspiciousPatterns = [
    /\b(password|credit\s*card|ssn|social\s*security)\b/i,
    /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Credit card pattern
    /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/, // SSN pattern
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(content));
};

// Check if a message is likely spam
export const isSpamMessage = (content: string): boolean => {
  if (!content) return false;
  
  // Simplified spam detection for demonstration
  const spamIndicators = [
    /\b(viagra|cialis|buy now|click here|free money|casino|lottery|winner)\b/i,
    /https?:\/\/\S+\.(xyz|top|ru|cn)\b/i,
    /\b(limited time|act now|exclusive offer)\b/i,
    // Excessive capitalization
    content.toUpperCase() === content && content.length > 15,
    // Excessive exclamation marks
    (content.match(/!/g) || []).length > 3,
  ];
  
  return spamIndicators.some(indicator => 
    typeof indicator === 'boolean' ? indicator : indicator.test(content)
  );
};

// Validate message content
export const validateMessage = (
  content: string, 
  options: {
    maxLength?: number;
    allowHtml?: boolean;
    allowUrls?: boolean;
    blockWords?: string[];
  } = {}
): { isValid: boolean; sanitizedContent: string; errors: string[] } => {
  const {
    maxLength = 2000,
    allowHtml = false,
    allowUrls = true,
    blockWords = []
  } = options;
  
  const errors: string[] = [];
  let sanitizedContent = content;
  
  // Check length
  if (content.length > maxLength) {
    errors.push(`Message exceeds maximum length of ${maxLength} characters`);
    sanitizedContent = content.substring(0, maxLength);
  }
  
  // Check for HTML if not allowed
  if (!allowHtml && /<\/?[a-z][\s\S]*>/i.test(content)) {
    errors.push('HTML content is not allowed');
    sanitizedContent = content.replace(/<\/?[a-z][\s\S]*>/gi, '');
  }
  
  // Check for URLs if not allowed
  if (!allowUrls && /https?:\/\/\S+/i.test(content)) {
    errors.push('URLs are not allowed');
    sanitizedContent = content.replace(/https?:\/\/\S+/gi, '[URL removed]');
  }
  
  // Check for blocked words
  if (blockWords.length > 0) {
    const pattern = new RegExp(`\\b(${blockWords.join('|')})\\b`, 'i');
    if (pattern.test(content)) {
      errors.push('Message contains blocked words');
      sanitizedContent = content.replace(pattern, '***');
    }
  }
  
  // Check for suspicious content
  if (detectSuspiciousContent(content)) {
    errors.push('Message contains potentially sensitive information');
  }
  
  // Check for spam
  if (isSpamMessage(content)) {
    errors.push('Message appears to be spam');
  }
  
  return {
    isValid: errors.length === 0,
    sanitizedContent,
    errors
  };
};

export default validateMessage;
