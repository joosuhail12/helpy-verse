
/**
 * Message validation utility
 */

interface ValidationOptions {
  maxLength?: number;
  allowHtml?: boolean;
  allowUrls?: boolean;
  blockWords?: string[];
}

interface ValidationResult {
  isValid: boolean;
  sanitizedContent: string;
  errors: string[];
}

/**
 * Validate and sanitize message content
 */
export function validateMessage(content: string, maxLength: number = 2000): ValidationResult {
  const errors: string[] = [];
  
  if (!content || content.trim().length === 0) {
    errors.push("Message cannot be empty");
    return { isValid: false, sanitizedContent: content, errors };
  }
  
  // Check message length
  if (content.length > maxLength) {
    errors.push(`Message is too long (maximum ${maxLength} characters)`);
  }
  
  // Basic sanitization - remove potential XSS
  let sanitized = content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/script/gi, 's*ript');
  
  return {
    isValid: errors.length === 0,
    sanitizedContent: sanitized,
    errors
  };
}

/**
 * Extended validation with more options
 */
export function validateMessageExtended(content: string, options: ValidationOptions): ValidationResult {
  const errors: string[] = [];
  let sanitized = content;
  
  if (!content || content.trim().length === 0) {
    errors.push("Message cannot be empty");
    return { isValid: false, sanitizedContent: content, errors };
  }
  
  // Check message length
  if (options.maxLength && content.length > options.maxLength) {
    errors.push(`Message is too long (maximum ${options.maxLength} characters)`);
  }
  
  // Check for blocked words
  if (options.blockWords && options.blockWords.length > 0) {
    const lowerContent = content.toLowerCase();
    const foundBlockedWords = options.blockWords.filter(word => 
      lowerContent.includes(word.toLowerCase())
    );
    
    if (foundBlockedWords.length > 0) {
      errors.push(`Message contains blocked words: ${foundBlockedWords.join(', ')}`);
    }
  }
  
  // Sanitize HTML if not allowed
  if (!options.allowHtml) {
    sanitized = sanitized
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/script/gi, 's*ript');
  }
  
  // Block URLs if not allowed
  if (!options.allowUrls) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    if (urlPattern.test(content)) {
      errors.push("URLs are not allowed in messages");
    }
  }
  
  return {
    isValid: errors.length === 0,
    sanitizedContent: sanitized,
    errors
  };
}

export default validateMessage;
