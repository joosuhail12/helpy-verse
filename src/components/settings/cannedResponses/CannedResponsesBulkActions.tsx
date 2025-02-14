
import { Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/settings/cannedResponses/ViewToggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CannedResponsesBulkActionsProps {
  selectedResponses: string[];
  view: 'list' | 'grid';
  onViewChange: (view: 'list' | 'grid') => void;
  onBulkShare: () => void;
  onBulkDelete: () => void;
}

export const CannedResponsesBulkActions = ({
  selectedResponses,
  view,
  onViewChange,
  onBulkShare,
  onBulkDelete,
}: CannedResponsesBulkActionsProps) => {
  if (selectedResponses.length === 0) {
    return <ViewToggle view={view} onViewChange={onViewChange} />;
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkShare}
              className="text-[#9b87f5]"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share selected responses</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDelete}
              className="text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete selected responses</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className="text-sm text-muted-foreground">
        {selectedResponses.length} selected
      </span>
      <ViewToggle view={view} onViewChange={onViewChange} />
    </div>
  );
};
