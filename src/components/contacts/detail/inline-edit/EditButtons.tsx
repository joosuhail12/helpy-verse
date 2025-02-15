
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const EditButtons = ({ onSave, onCancel, isSaving }: EditButtonsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={onSave}
        disabled={isSaving}
        className="h-8 w-8 p-0"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4 text-green-500" />
        )}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onCancel}
        disabled={isSaving}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
};
