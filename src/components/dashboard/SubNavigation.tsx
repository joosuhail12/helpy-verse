
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { subNavItems, mainNavItems } from './navigationConfig';
import { NavigateFunction, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface SubNavigationProps {
  activeMainNav: string;
  isSecondPanelCollapsed: boolean;
  toggleSecondPanel: () => void;
  expandedItems: string[];
  toggleExpanded: (itemTitle: string) => void;
  navigate: NavigateFunction;
}

const SubNavigation = ({ 
  activeMainNav, 
  isSecondPanelCollapsed, 
  toggleSecondPanel, 
  expandedItems, 
  toggleExpanded, 
  navigate 
}: SubNavigationProps) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const isItemActive = (path: string) => location.pathname === path;
  const hasActiveChild = (children: any[]) => {
    return children.some(child => 
      isItemActive(child.path) || 
      (child.children && hasActiveChild(child.children))
    );
  };

  const filterMenuItems = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (item.children) {
        const filteredChildren = filterMenuItems(item.children);
        return matchesSearch || filteredChildren.length > 0;
      }
      
      return matchesSearch;
    });
  };

  const currentNavItems = subNavItems[activeMainNav as keyof typeof subNavItems] || [];
  const filteredNavItems = searchQuery ? filterMenuItems(currentNavItems) : currentNavItems;

  return (
    <div 
      className={`${
        isSecondPanelCollapsed ? 'w-12' : 'w-64'
      } min-h-screen bg-white/60 backdrop-blur-lg border-r border-purple-100/50 transition-all duration-300 ease-in-out relative`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isSecondPanelCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 ml-2">
              {mainNavItems.find(item => item.id === activeMainNav)?.title}
            </h2>
          )}
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
        </div>

        {!isSecondPanelCollapsed && (
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-white/50"
            />
          </div>
        )}

        <div className="space-y-1">
          {filteredNavItems.map((item: any) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center rounded-lg transition-colors ${
                      isSecondPanelCollapsed ? 'justify-center p-2' : 'justify-between px-4 py-2'
                    } ${hasActiveChild(item.children) ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'}`}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <div className={`flex items-center ${isSecondPanelCollapsed ? 'justify-center' : 'gap-3'}`}>
                      {item.icon && (
                        <div className="flex items-center justify-center w-5">
                          <item.icon className="h-4 w-4" />
                        </div>
                      )}
                      {!isSecondPanelCollapsed && <span>{item.title}</span>}
                    </div>
                    {!isSecondPanelCollapsed && (
                      <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                        expandedItems.includes(item.title) ? 'rotate-90' : ''
                      }`} />
                    )}
                  </Button>
                  {expandedItems.includes(item.title) && !isSecondPanelCollapsed && (
                    <div className="ml-8 mt-1 space-y-1 animate-accordion-down">
                      {filterMenuItems(item.children).map((child: any) => (
                        <Button
                          key={child.title}
                          variant="ghost"
                          className={`w-full flex items-center justify-start text-sm px-4 py-2 rounded-lg transition-colors
                            ${isItemActive(child.path) 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-primary/5'}`}
                          onClick={() => navigate(child.path)}
                        >
                          {child.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={`w-full flex items-center rounded-lg transition-colors ${
                    isSecondPanelCollapsed ? 'justify-center p-2' : 'justify-start px-4 py-2'
                  } ${isItemActive(item.path) ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className={`flex items-center ${isSecondPanelCollapsed ? 'justify-center' : 'gap-3'}`}>
                    {item.icon && (
                      <div className="flex items-center justify-center w-5">
                        <item.icon className="h-4 w-4" />
                      </div>
                    )}
                    {!isSecondPanelCollapsed && <span>{item.title}</span>}
                  </div>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubNavigation;
