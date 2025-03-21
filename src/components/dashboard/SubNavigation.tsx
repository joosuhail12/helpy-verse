
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { subNavItems } from './navigationConfig';
import UserProfileCard from './UserProfileCard';
import NavigationHeader from './navigation/NavigationHeader';
import SearchInput from './navigation/SearchInput';
import NavigationItem from './navigation/NavigationItem';

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
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '/') {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          event.preventDefault();
          searchInput.focus();
        }
      }
      if (event.ctrlKey && event.key === '[') {
        toggleSecondPanel();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleSecondPanel]);

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
      } min-h-screen bg-white/60 backdrop-blur-lg border-r border-purple-100/50 transition-all duration-300 ease-in-out relative flex flex-col`}
    >
      <div className="flex-1 p-4">
        <NavigationHeader
          activeMainNav={activeMainNav}
          isSecondPanelCollapsed={isSecondPanelCollapsed}
          toggleSecondPanel={toggleSecondPanel}
        />

        {!isSecondPanelCollapsed && (
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        <div className="space-y-1">
          {filteredNavItems.map((item: any) => (
            <NavigationItem
              key={item.title}
              item={item}
              isSecondPanelCollapsed={isSecondPanelCollapsed}
              expandedItems={expandedItems}
              toggleExpanded={toggleExpanded}
              hasActiveChild={hasActiveChild}
              isItemActive={isItemActive}
              navigate={navigate}
              filterMenuItems={filterMenuItems}
            />
          ))}
        </div>
      </div>

      <UserProfileCard isCollapsed={isSecondPanelCollapsed} />
    </div>
  );
};

export default SubNavigation;
