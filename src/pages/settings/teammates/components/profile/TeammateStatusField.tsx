
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Teammate } from '@/types/teammate';

interface TeammateStatusFieldProps {
  teammate: Teammate;
  isEditing: boolean;
  isLoading: boolean;
  onUpdateStatus: (status: Teammate['status']) => void;
}

export const TeammateStatusField = ({
  teammate,
  isEditing,
  isLoading,
  onUpdateStatus,
}: TeammateStatusFieldProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Status</span>
      {isEditing ? (
        <Select
          value={teammate.status}
          onValueChange={(value: Teammate['status']) => onUpdateStatus(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Badge variant={teammate.status === 'active' ? 'default' : 'secondary'}>
          {teammate.status}
        </Badge>
      )}
    </div>
  );
};
