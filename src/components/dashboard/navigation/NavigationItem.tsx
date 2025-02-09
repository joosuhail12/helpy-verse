
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavigationItem as NavItemType } from '../types/navigation';

interface NavigationItemProps {
  item: NavItemType;
  isSecondPanelCollapsed: boolean;
  expandedItems: string[];
  toggleExpanded: (itemTitle: string) => void;
  hasActiveChild?: (children: NavItemType[]) => boolean;
  isItemActive: (path: string) => boolean;
  navigate: (path: string) => void;
  filterMenuItems: (items: NavItemType[]) => NavItemType[];
}

const NavigationItem = ({
  item,
  isSecondPanelCollapsed,
  expandedItems,
  toggleExpanded,
  hasActiveChild,
  isItemActive,
  navigate,
  filterMenuItems,
}: NavigationItemProps) => {
  if (item.children) {
    return (
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full flex items-center rounded-lg transition-all duration-300 group ${
                  isSecondPanelCollapsed ? 'justify-center p-2' : 'justify-between px-4 py-2'
                } ${hasActiveChild?.(item.children) 
                    ? 'bg-primary/5 text-primary shadow-sm hover:shadow-md' 
                    : 'hover:bg-primary/5'}`}
                onClick={() => toggleExpanded(item.title)}
              >
                <div className={`flex items-center ${isSecondPanelCollapsed ? 'justify-center' : 'gap-3'}`}>
                  {item.icon && (
                    <div className="flex items-center justify-center w-5">
                      <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  )}
                  {!isSecondPanelCollapsed && (
                    <span className="font-medium transition-colors group-hover:text-primary">
                      {item.title}
                    </span>
                  )}
                </div>
                {!isSecondPanelCollapsed && (
                  <ChevronRight className={`h-4 w-4 transition-all duration-300 ${
                    expandedItems.includes(item.title) ? 'rotate-90' : ''
                  } group-hover:text-primary`} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
              <p className="text-xs text-muted-foreground">
                Click to {expandedItems.includes(item.title) ? 'collapse' : 'expand'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {expandedItems.includes(item.title) && !isSecondPanelCollapsed && (
          <div className="ml-8 mt-1 space-y-1 animate-accordion-down">
            {filterMenuItems(item.children).map((child: NavItemType) => (
              <TooltipProvider key={child.title}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full flex items-center justify-start text-sm px-4 py-2 rounded-lg transition-all duration-300 group
                        ${isItemActive(child.path) 
                          ? 'bg-primary/5 text-primary shadow-sm hover:shadow-md' 
                          : 'hover:bg-primary/5'}`}
                      onClick={() => navigate(child.path)}
                    >
                      <span className="transition-colors group-hover:text-primary">
                        {child.title}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{child.title}</p>
                    <p className="text-xs text-muted-foreground">Click to navigate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full flex items-center rounded-lg transition-all duration-300 group ${
              isSecondPanelCollapsed ? 'justify-center p-2' : 'justify-start px-4 py-2'
            } ${isItemActive(item.path) 
                ? 'bg-primary/5 text-primary shadow-sm hover:shadow-md' 
                : 'hover:bg-primary/5'}`}
            onClick={() => navigate(item.path)}
          >
            <div className={`flex items-center ${isSecondPanelCollapsed ? 'justify-center' : 'gap-3'}`}>
              {item.icon && (
                <div className="flex items-center justify-center w-5">
                  <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
              )}
              {!isSecondPanelCollapsed && (
                <span className="font-medium transition-colors group-hover:text-primary">
                  {item.title}
                </span>
              )}
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.title}</p>
          <p className="text-xs text-muted-foreground">Click to navigate</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavigationItem;
