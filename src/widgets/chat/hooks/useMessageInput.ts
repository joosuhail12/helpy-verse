
/**
 * Hook for managing message input state and operations
 */
import { useState, useCallback } from 'react';
import { FileAttachment } from '../types';

const useMessageInput = (onSend: (content: string, attachments: FileAttachment[]) => void) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const handleTextChange = (text: string) => {
    setMessageText(text);
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
    } else if (isTyping && text.length === 0) {
      setIsTyping(false);
    }
  };
  
  const addAttachment = useCallback((attachment: FileAttachment) => {
    setAttachments(prev => [...prev, attachment]);
  }, []);
  
  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  }, []);
  
  const clearInput = useCallback(() => {
    setMessageText('');
    setAttachments([]);
    setIsTyping(false);
  }, []);
  
  const handleSend = useCallback(() => {
    if (messageText.trim() || attachments.length > 0) {
      onSend(messageText, attachments);
      clearInput();
    }
  }, [messageText, attachments, onSend, clearInput]);
  
  return {
    messageText,
    setMessageText: handleTextChange,
    attachments,
    addAttachment,
    removeAttachment,
    isTyping,
    clearInput,
    handleSend
  };
};

export default useMessageInput;
