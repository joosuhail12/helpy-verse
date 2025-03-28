
interface ValidationOptions {
  maxLength?: number;
  allowHtml?: boolean;
  allowUrls?: boolean;
  urlMaxLength?: number;
}

interface ValidationError {
  message: string;
  code: string;
}

interface ValidationResult {
  isValid: boolean;
  sanitizedContent: string;
  errors: ValidationError[];
}

export function validateAndSanitizeMessage(
  content: string,
  options: ValidationOptions = {}
): ValidationResult {
  const {
    maxLength = 2000,
    allowHtml = false,
    allowUrls = true,
    urlMaxLength = 100
  } = options;
  
  const errors: ValidationError[] = [];
  let sanitizedContent = content;
  
  // Check for empty content
  if (!content.trim()) {
    errors.push({
      message: 'Message cannot be empty',
      code: 'EMPTY_MESSAGE'
    });
    return { isValid: false, sanitizedContent: '', errors };
  }
  
  // Check length
  if (content.length > maxLength) {
    errors.push({
      message: `Message exceeds maximum length of ${maxLength} characters`,
      code: 'MESSAGE_TOO_LONG'
    });
    sanitizedContent = content.substring(0, maxLength);
  }
  
  // Sanitize HTML if not allowed
  if (!allowHtml) {
    sanitizedContent = sanitizedContent
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  
  // Check for URLs if not allowed
  if (!allowUrls) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(content)) {
      errors.push({
        message: 'URLs are not allowed in messages',
        code: 'URLS_NOT_ALLOWED'
      });
      sanitizedContent = sanitizedContent.replace(urlRegex, '[URL REMOVED]');
    }
  } else if (urlMaxLength) {
    // Truncate long URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    sanitizedContent = sanitizedContent.replace(urlRegex, (url) => {
      if (url.length > urlMaxLength) {
        return url.substring(0, urlMaxLength) + '...';
      }
      return url;
    });
  }
  
  return {
    isValid: errors.length === 0,
    sanitizedContent,
    errors
  };
}
