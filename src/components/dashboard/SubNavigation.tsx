
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { subNavItems } from './navigationConfig';
import { Button } from '@/components/ui/button';

interface SubNavigationProps {
  activeMainNav: string;
  isSecondPanelCollapsed: boolean;
  toggleSecondPanel: () => void;
  expandedItems: string[];
  toggleExpanded: (itemTitle: string) => void;
  navigate: (path: string) => void;
}

const SubNavigation = ({
  activeMainNav,
  isSecondPanelCollapsed,
  toggleSecondPanel,
  expandedItems,
  toggleExpanded,
  navigate
}: SubNavigationProps) => {
  const subItems = subNavItems[activeMainNav as keyof typeof subNavItems] || [];
  
  // Get all links for the active section to find the active one
  const allLinks = subItems.flatMap(group => group.subItems || []);
  
  const handleNavigate = (path: string) => {
    console.log(`SubNavigation: Navigating to ${path}`);
    navigate(path);
  };

  return (
    <div 
      className={`min-h-screen bg-white/90 backdrop-blur-md border-r border-purple-100/50 shadow-md transition-all duration-300 overflow-hidden ${
        isSecondPanelCollapsed ? 'w-0 opacity-0' : 'w-56 opacity-100'
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-800">
            {activeMainNav.charAt(0).toUpperCase() + activeMainNav.slice(1)}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg"
            onClick={toggleSecondPanel}
          >
            {isSecondPanelCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <span className="sr-only">Collapse panel</span>
          </Button>
        </div>

        <div className="space-y-6 overflow-y-auto flex-1">
          {subItems.map((group, index) => (
            <div key={`${group.title}-${index}`} className="space-y-1">
              <div
                className="flex items-center justify-between cursor-pointer px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                onClick={() => toggleExpanded(group.title)}
              >
                <span>{group.title}</span>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${
                    expandedItems.includes(group.title) ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {/* Sub-items */}
              <div
                className={`space-y-1 pl-2 transition-all duration-200 ${
                  expandedItems.includes(group.title)
                    ? 'max-h-screen opacity-100'
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                {group.subItems?.map((item) => (
                  <button
                    key={item.key}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    onClick={() => handleNavigate(item.path)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubNavigation;
