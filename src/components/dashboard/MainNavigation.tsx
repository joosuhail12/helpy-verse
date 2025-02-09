
import { Button } from '@/components/ui/button';
import { mainNavItems } from './navigationConfig';
import { NavigateFunction, useLocation } from 'react-router-dom';

interface MainNavigationProps {
  activeMainNav: string;
  setActiveMainNav: (id: string) => void;
  navigate: NavigateFunction;
}

const MainNavigation = ({ activeMainNav, setActiveMainNav, navigate }: MainNavigationProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {mainNavItems.map((item) => {
        const isActive = location.pathname.startsWith(`/home/${item.id}`);
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group ${
              isActive 
                ? 'text-primary bg-primary/10 shadow-sm hover:shadow-md hover:bg-primary/15' 
                : 'text-gray-500 hover:text-primary hover:bg-primary/5'
            }`}
            onClick={() => {
              setActiveMainNav(item.id);
              navigate(item.path);
            }}
          >
            <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span className="sr-only">{item.title}</span>
            {isActive && (
              <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full animate-fade-in" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default MainNavigation;
