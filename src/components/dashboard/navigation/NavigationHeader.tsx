
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mainNavItems } from '../navigationConfig';
import { MainNavItem } from '../types/navigation';

interface NavigationHeaderProps {
  activeMainNav: string;
  isSecondPanelCollapsed: boolean;
  toggleSecondPanel: () => void;
}

const NavigationHeader = ({ 
  activeMainNav, 
  isSecondPanelCollapsed, 
  toggleSecondPanel 
}: NavigationHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {!isSecondPanelCollapsed && (
        <h2 className="text-lg font-semibold text-gray-800 ml-2">
          {mainNavItems.find(item => item.id === activeMainNav)?.title}
        </h2>
      )}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg flex justify-center items-center hover:bg-primary/5 transition-colors"
              onClick={toggleSecondPanel}
            >
              {isSecondPanelCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="z-[60] bg-white shadow-lg"
            sideOffset={12}
          >
            <p>Toggle panel (Ctrl + [)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NavigationHeader;

