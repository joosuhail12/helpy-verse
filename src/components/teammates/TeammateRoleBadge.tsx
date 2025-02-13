
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Teammate } from '@/types/teammate';
import { getRoleBadgeVariant, getRoleDescription } from './utils/roleUtils';

interface TeammateRoleBadgeProps {
  role: Teammate['role'];
}

const TeammateRoleBadge = ({ role }: TeammateRoleBadgeProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant={getRoleBadgeVariant(role)}>
          {role}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{getRoleDescription(role)}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TeammateRoleBadge;
