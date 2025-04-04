
import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import AttachmentPreview from './AttachmentPreview';
import { v4 as uuidv4 } from 'uuid';
import { FileAttachment } from '../../types';

interface MessageInputProps {
  onSendMessage: (content: string, attachments: FileAttachment[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = 'Type a message...', 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { colors } = useThemeContext();
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: FileAttachment[] = [];
      
      Array.from(e.target.files).forEach(file => {
        const fileUrl = URL.createObjectURL(file);
        newAttachments.push({
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: fileUrl
        });
      });
      
      setAttachments(prev => [...prev, ...newAttachments]);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };
  
  return (
    <div className="border-t p-2 bg-white">
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map(attachment => (
            <AttachmentPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={() => removeAttachment(attachment.id)}
            />
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-gray-100"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
        </button>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 max-h-32 p-2 rounded-md border resize-none focus:outline-none focus:border-primary"
          rows={1}
          disabled={disabled}
          style={{ 
            minHeight: '40px',
            borderColor: colors.border
          }}
        />
        
        <button
          type="button"
          onClick={handleSendMessage}
          className="p-2 rounded-full"
          disabled={disabled || (message.trim() === '' && attachments.length === 0)}
          style={{ 
            backgroundColor: (message.trim() || attachments.length > 0) ? colors.primary : '#e5e7eb',
            color: (message.trim() || attachments.length > 0) ? 'white' : '#9ca3af',
            cursor: (message.trim() || attachments.length > 0) && !disabled ? 'pointer' : 'not-allowed'
          }}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
