
import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const TagInput = ({ value = [], onChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Add tag if it doesn't exist already
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove the last tag when backspace is pressed on empty input
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {value.map(tag => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
          {tag}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={() => removeTag(tag)}
          />
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="flex-1 min-w-[120px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
        placeholder={value.length === 0 ? "Add tags..." : ""}
      />
    </div>
  );
};

export default TagInput;
