
import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { FileAttachment } from './types';
import FileAttachmentItem from './FileAttachmentItem';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping?: () => void;
  isDisabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping, isDisabled = false }) => {
  const { colors, labels } = useThemeContext();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '' && attachments.length === 0) return;
    
    let content = message;
    
    // Add attachment info to the message if there are any
    if (attachments.length > 0) {
      const attachmentSummary = attachments.map(a => a.name).join(', ');
      content = `${message}\n\nAttachments: ${attachmentSummary}`;
    }
    
    onSendMessage(content);
    setMessage('');
    setAttachments([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Trigger typing indicator when user is typing
    if (onTyping && e.target.value.length > 0) {
      onTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments: FileAttachment[] = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        size: file.size
      }));
      
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  return (
    <div className="border-t p-3" style={{ borderColor: colors.border }}>
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map(attachment => (
            <div key={attachment.id} onClick={() => removeAttachment(attachment.id)}>
              <FileAttachmentItem attachment={attachment} />
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button 
          type="button"
          onClick={handleAttachmentClick}
          className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
          disabled={isDisabled}
        >
          <Paperclip size={18} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          multiple
          disabled={isDisabled}
        />
        <textarea
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={labels.messagePlaceholder || "Type a message..."}
          className="flex-1 resize-none rounded-lg p-3 min-h-[40px] max-h-32 focus:outline-none"
          style={{ 
            backgroundColor: colors.inputBackground || '#f9f9f9',
            border: `1px solid ${colors.border}`
          }}
          rows={1}
          disabled={isDisabled}
        />
        <button
          type="submit"
          className="p-3 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ 
            backgroundColor: (message.trim() || attachments.length > 0) && !isDisabled ? colors.primary : '#ccc',
            color: colors.primaryForeground
          }}
          disabled={message.trim() === '' && attachments.length === 0 || isDisabled}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
