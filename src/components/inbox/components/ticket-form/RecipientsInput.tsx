
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RecipientsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const RecipientsInput = ({ value = [''], onChange }: RecipientsInputProps) => {
  const updateRecipient = (index: number, email: string) => {
    const newRecipients = [...value];
    newRecipients[index] = email;
    onChange(newRecipients);
  };

  const addRecipient = () => {
    onChange([...value, '']);
  };

  const removeRecipient = (index: number) => {
    if (value.length > 1) {
      const newRecipients = value.filter((_, i) => i !== index);
      onChange(newRecipients);
    } else {
      // If it's the last recipient, just clear it
      onChange(['']);
    }
  };

  return (
    <div className="space-y-2">
      {value.map((email, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => updateRecipient(index, e.target.value)}
            placeholder="recipient@example.com"
            className="flex-1"
          />
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeRecipient(index)}
            className="text-gray-500 hover:text-destructive"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRecipient}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Recipient
      </Button>
    </div>
  );
};

export default RecipientsInput;
