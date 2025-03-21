
import { Button } from "@/components/ui/button";
import type { TicketFormValues } from '../types';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  hasValidationErrors: boolean;
  defaultValues: TicketFormValues;
  onSubmit: (values: TicketFormValues, callback: () => void) => void;
  resetForm: () => void;
}

const FormActions = ({ 
  onCancel, 
  isSubmitting, 
  hasValidationErrors,
  defaultValues,
  onSubmit,
  resetForm
}: FormActionsProps) => {
  const handleCancel = () => {
    onSubmit(defaultValues, resetForm);
    onCancel();
  };

  return (
    <div className="flex justify-end space-x-3 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isSubmitting}
        className="transition-all border-gray-200 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || hasValidationErrors} 
        className="transition-all shadow-sm hover:shadow"
      >
        {isSubmitting ? 'Creating...' : 'Create Ticket'}
      </Button>
    </div>
  );
};

export default FormActions;
