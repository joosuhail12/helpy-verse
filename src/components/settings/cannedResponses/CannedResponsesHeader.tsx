
import { Button } from '@/components/ui/button';
import { PlusCircle, Keyboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CannedResponsesHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-[#9b87f5] bg-clip-text text-transparent">
          Canned Responses
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted-foreground">
            Create and manage your team's canned responses for quick replies
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <Keyboard className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium mb-1">Keyboard Shortcuts</p>
                  <div className="space-y-1">
                    <p>Create new response: Ctrl/⌘ + N</p>
                    <p>Search responses: Ctrl/⌘ + F</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/home/settings/canned-responses/create">
                <Button className="bg-[#9b87f5] hover:bg-[#9b87f5]/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Response
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Create new response (Ctrl/⌘ + N)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
