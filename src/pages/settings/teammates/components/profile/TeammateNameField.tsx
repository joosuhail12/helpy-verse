
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardTitle } from "@/components/ui/card";
import type { Teammate } from '@/types/teammate';

interface TeammateNameFieldProps {
  teammate: Teammate;
  isEditing: boolean;
  isLoading: boolean;
  validationError?: string;
  onUpdateName: (name: string) => void;
}

export const TeammateNameField = ({
  teammate,
  isEditing,
  isLoading,
  validationError,
  onUpdateName,
}: TeammateNameFieldProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <div>
          <Input
            id="name"
            value={teammate.name}
            onChange={(e) => onUpdateName(e.target.value)}
            disabled={isLoading}
            className={validationError ? "border-red-500" : ""}
          />
          {validationError && (
            <p className="text-sm text-red-500 mt-1">{validationError}</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <CardTitle className="text-2xl">{teammate.name}</CardTitle>
    </div>
  );
};
