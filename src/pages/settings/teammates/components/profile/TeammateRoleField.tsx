
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Teammate } from '@/types/teammate';

interface TeammateRoleFieldProps {
  teammate: Teammate;
  isEditing: boolean;
  isLoading: boolean;
  onUpdateRole: (role: Teammate['role']) => void;
}

export const TeammateRoleField = ({
  teammate,
  isEditing,
  isLoading,
  onUpdateRole,
}: TeammateRoleFieldProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Role</span>
      {isEditing ? (
        <Select
          value={teammate.role}
          onValueChange={(value: Teammate['role']) => onUpdateRole(value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Badge variant="secondary">{teammate.role}</Badge>
      )}
    </div>
  );
};
