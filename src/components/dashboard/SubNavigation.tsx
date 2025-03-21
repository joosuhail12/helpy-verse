
import { useState } from 'react';
import { NavigationItem, SubNavItem } from './types/navigation';
import { NavigationHeader } from './navigation/NavigationHeader';
import { NavigationItem as NavItem } from './navigation/NavigationItem';
import { SearchInput } from './navigation/SearchInput';

export interface SubNavigationProps {
  navItems: NavigationItem[];
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  expandedItems: string[];
  onItemToggle: (itemTitle: string) => void;
  onNavigate: (path: string) => void;
}

const SubNavigation = ({
  navItems,
  isCollapsed,
  toggleCollapsed,
  expandedItems,
  onItemToggle,
  onNavigate
}: SubNavigationProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter nav items based on search query
  const filteredItems = searchQuery.trim() === ''
    ? navItems
    : navItems.filter(item => {
        // Match parent item title
        if (item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        // Match child item titles
        if (item.children?.some(child => 
          child.title.toLowerCase().includes(searchQuery.toLowerCase())
        )) {
          return true;
        }
        return false;
      });

  return (
    <div 
      className={`h-screen bg-white/80 backdrop-blur-xl border-r border-purple-100/50 shadow-lg transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-64 opacity-100'
      }`}
    >
      <NavigationHeader 
        title="Navigation" 
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapsed}
      />
      
      <div className="px-4 py-3">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search..."
        />
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-3">
        {filteredItems.map((item, index) => (
          <NavItem
            key={`${item.title}-${index}`}
            item={item}
            isExpanded={expandedItems.includes(item.title)}
            onToggleExpand={() => onItemToggle(item.title)}
            onNavigate={onNavigate}
            isSearching={searchQuery.trim() !== ''}
          />
        ))}
      </div>
    </div>
  );
};

export default SubNavigation;
