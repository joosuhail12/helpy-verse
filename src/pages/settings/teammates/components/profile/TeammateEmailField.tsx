
import { Input } from "@/components/ui/input";
import { Mail } from 'lucide-react';
import type { Teammate } from '@/types/teammate';

interface TeammateEmailFieldProps {
  teammate: Teammate;
  isEditing: boolean;
  isLoading: boolean;
  validationError?: string;
  onUpdateEmail: (email: string) => void;
}

export const TeammateEmailField = ({
  teammate,
  isEditing,
  isLoading,
  validationError,
  onUpdateEmail,
}: TeammateEmailFieldProps) => {
  return (
    <div className="flex items-center gap-2">
      <Mail className="h-4 w-4" />
      {isEditing ? (
        <div className="flex-grow">
          <Input
            value={teammate.email}
            onChange={(e) => onUpdateEmail(e.target.value)}
            disabled={isLoading}
            className={validationError ? "border-red-500" : ""}
          />
          {validationError && (
            <p className="text-sm text-red-500 mt-1">{validationError}</p>
          )}
        </div>
      ) : (
        teammate.email
      )}
    </div>
  );
};
