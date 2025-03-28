
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSafeNavigation } from '@/context/NavigationContext';

interface NavigationItemProps {
  item: any;
  isSecondPanelCollapsed: boolean;
  expandedItems: string[];
  toggleExpanded: (itemTitle: string) => void;
  hasActiveChild: (children: any[]) => boolean;
  isItemActive: (path: string) => boolean;
  filterMenuItems: (items: any[]) => any[];
}

const NavigationItem = ({
  item,
  isSecondPanelCollapsed,
  expandedItems,
  toggleExpanded,
  hasActiveChild,
  isItemActive,
  filterMenuItems
}: NavigationItemProps) => {
  const { navigate } = useSafeNavigation();
  
  const isExpanded = expandedItems.includes(item.title);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = isItemActive(item.path);
  const hasActiveChildren = hasChildren && hasActiveChild(item.children);
  
  // Filter children based on search query, if available
  const filteredChildren = hasChildren ? filterMenuItems(item.children) : [];
  const hasFilteredChildren = filteredChildren.length > 0;

  if (isSecondPanelCollapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'w-8 h-8 flex justify-center items-center rounded-xl mb-1',
          (isActive || hasActiveChildren) && 'bg-primary/10 text-primary'
        )}
        onClick={() => {
          if (!hasChildren) {
            navigate(item.path);
          }
        }}
      >
        <item.icon className="h-4 w-4" />
        <span className="sr-only">{item.title}</span>
      </Button>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-1">
        <Button
          variant="ghost"
          className={cn(
            'w-full h-8 justify-start px-2 rounded-xl text-sm',
            (isActive || hasActiveChildren) && 'bg-primary/10 text-primary font-medium'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.title);
            } else {
              navigate(item.path);
            }
          }}
        >
          <div className="flex items-center w-full">
            <div className="h-4 w-4 mr-2">
              <item.icon className="h-4 w-4" />
            </div>
            <span className="flex-1 truncate text-left">{item.title}</span>
            {hasChildren && (
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 opacity-70" />
                ) : (
                  <ChevronRight className="h-4 w-4 opacity-70" />
                )}
              </div>
            )}
          </div>
        </Button>
      </div>

      {hasChildren && isExpanded && hasFilteredChildren && (
        <div className="ml-6 pl-2 border-l border-purple-100/50 space-y-1 mb-2">
          {filteredChildren.map((child: any) => (
            <Button
              key={child.title}
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start px-2 rounded-lg text-xs h-7',
                isItemActive(child.path) && 'bg-primary/10 text-primary font-medium'
              )}
              onClick={() => navigate(child.path)}
            >
              <span className="truncate">{child.title}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationItem;
