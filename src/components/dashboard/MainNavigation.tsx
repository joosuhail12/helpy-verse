
import { ReactNode } from 'react';
import { mainNavItems } from './navigationConfig';

interface MainNavigationProps {
  activeMainNav: string;
  setActiveMainNav: (navKey: string) => void;
  navigate: (path: string) => void;
}

const MainNavigation = ({ activeMainNav, setActiveMainNav, navigate }: MainNavigationProps) => {
  const handleNavClick = (navKey: string, path: string) => {
    console.log(`MainNavigation: Clicked ${navKey}, path=${path}`);
    setActiveMainNav(navKey);
    navigate(path);
  };

  return (
    <nav className="flex flex-col items-center gap-4">
      {mainNavItems.map((item) => (
        <NavigationItem
          key={item.key}
          icon={<item.icon size={20} />}
          isActive={activeMainNav === item.key}
          onClick={() => handleNavClick(item.key, item.path)}
          tooltip={item.title}
        />
      ))}
    </nav>
  );
};

interface NavigationItemProps {
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
  tooltip: string;
}

export const NavigationItem = ({ icon, isActive, onClick, tooltip }: NavigationItemProps) => {
  return (
    <div className="relative group">
      <button
        className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-purple-100/80 text-purple-600 shadow-sm' 
            : 'text-gray-500 hover:bg-gray-100/80 hover:text-gray-700 hover:shadow-sm'
        }`}
        onClick={onClick}
        aria-label={tooltip}
      >
        {/* Background glow effect for active state */}
        {isActive && (
          <div className="absolute inset-0 bg-purple-300/30 rounded-xl blur-md opacity-70" />
        )}
        
        {/* Icon with relative positioning to appear above the glow */}
        <div className="relative z-10">{icon}</div>
      </button>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
        {tooltip}
      </div>
    </div>
  );
};

export default MainNavigation;
