
import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import { FileAttachment } from './types';

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: FileAttachment[]) => void;
  isDisabled?: boolean;
  conversationId?: string;
  workspaceId?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isDisabled = false,
  conversationId = '',
  workspaceId = ''
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { colors, labels } = useThemeContext();
  const { startTyping, stopTyping } = useTypingIndicator(conversationId, workspaceId);
  
  const handleSendMessage = async () => {
    if ((!message.trim() && attachments.length === 0) || isDisabled) return;
    
    // Convert file attachments to the format expected by ChatMessage
    const fileAttachments: FileAttachment[] = attachments.map(file => ({
      id: Math.random().toString(36).substring(2),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size
    }));
    
    onSendMessage(message, fileAttachments);
    setMessage('');
    setAttachments([]);
    stopTyping();
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setAttachments(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) {
          setAttachments(prev => [...prev, file]);
        }
      }
    }
  };
  
  return (
    <div 
      className="p-3 border-t"
      style={{ borderColor: colors.border }}
    >
      {/* File attachments preview */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="bg-gray-100 rounded px-2 py-1 flex items-center"
              style={{ backgroundColor: `${colors.border}50` }}
            >
              <Paperclip size={12} className="mr-1" />
              <span className="text-xs truncate max-w-[100px]">{file.name}</span>
              <button 
                onClick={() => handleRemoveFile(index)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end rounded-lg border overflow-hidden relative"
        style={{ borderColor: colors.border }}
      >
        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          placeholder={labels.messageInputPlaceholder || "Type a message..."}
          className="flex-1 p-3 resize-none outline-none max-h-24"
          style={{ color: colors.foreground }}
          rows={1}
          disabled={isDisabled}
        />
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-gray-500 hover:text-gray-700"
          disabled={isDisabled}
        >
          <Paperclip size={20} />
        </button>
        
        <button
          onClick={handleSendMessage}
          disabled={(!message.trim() && attachments.length === 0) || isDisabled}
          className={`p-3 ${(!message.trim() && attachments.length === 0) || isDisabled ? 'text-gray-400' : 'text-primary'}`}
          style={{ color: message.trim() || attachments.length > 0 ? colors.primary : undefined }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
