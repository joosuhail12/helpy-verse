
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Teammate } from '@/types/teammate';
import { getStatusDescription } from './utils/statusUtils';

interface TeammateStatusBadgeProps {
  status: Teammate['status'];
}

const TeammateStatusBadge = ({ status }: TeammateStatusBadgeProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{getStatusDescription(status)}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TeammateStatusBadge;
